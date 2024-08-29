import {
  PromptWithRiskMetrics,
  PromptWithUserAndRiskMetrics,
  UserWithRiskMetrics,
} from "../db/types";
import type { Prompt } from "../prompts";
import type { User } from "../users";

// Prompt analytics utils
export const mapPromptsByMonth = (prompts: Prompt[]) => {
  const promptsByMonth: Record<number, Prompt[]> = {};

  prompts.forEach((p) => {
    const month = new Date(p.createdAt).getMonth();
    if (promptsByMonth[month]) {
      promptsByMonth[month].push(p);
    } else {
      promptsByMonth[month] = [p];
    }
  });

  return promptsByMonth;
};

export const getPromptPercentageChangeByMonth = (
  promptsByMonth: Record<number, Prompt[]>
) => {
  const months = Object.keys(promptsByMonth).map(Number);
  const monthValues = Object.values(promptsByMonth);

  const monthToPercentDiff: Record<number, number> = {};
  months.forEach((month, i) => {
    if (i === 0) {
      return;
    }

    const prevMonth = monthValues[i - 1].length;
    const currentMonth = monthValues[i].length;

    const diff = currentMonth - prevMonth;
    const res = (diff / prevMonth) * 100;
    monthToPercentDiff[month] = res;
  });

  return monthToPercentDiff;
};
// user analytics utils

export const mapUsersByMonth = (users: User[]) => {
  const usersByMonth: Record<number, User[]> = {};

  users.forEach((u) => {
    const month = new Date(u.dateJoined).getMonth();
    if (usersByMonth[month]) {
      usersByMonth[month].push(u);
    } else {
      usersByMonth[month] = [u];
    }
  });

  return usersByMonth;
};

export const getUserPercentageChangeByMonth = (
  usersByMonth: Record<number, User[]>
) => {
  const months = Object.keys(usersByMonth).map(Number);
  const monthValues = Object.values(usersByMonth);

  const monthToPercentDiff: Record<number, number> = {};
  months.forEach((month, i) => {
    if (i === 0) {
      return;
    }

    const prevMonth = monthValues[i - 1].length;
    const currentMonth = monthValues[i].length;

    const diff = currentMonth - prevMonth;
    const res = (diff / prevMonth) * 100;
    monthToPercentDiff[month] = res;
  });

  return monthToPercentDiff;
};

type PromptDateMapWithRiskLite = Record<
  string,
  {
    safe: number;
    low: number;
    medium: number;
    high: number;
  }
>;

export const createDateToPromptMap = (
  prompts: PromptWithRiskMetrics[]
): PromptDateMapWithRiskLite => {
  const promptsByDate: PromptDateMapWithRiskLite = {};

  prompts.forEach((p) => {
    const date = new Date(p.createdAt).toDateString();
    if (promptsByDate[date]) {
      const { level } = p.riskMetrics;
      promptsByDate[date][level] += 1;
    } else {
      const { level } = p.riskMetrics;
      promptsByDate[date] = {
        safe: 0,
        low: 0,
        medium: 0,
        high: 0,
      };
      promptsByDate[date][level] += 1;
    }
  });

  return promptsByDate;
};

export const transformPromptDateMapToRechartsData = (
  promptMap: PromptDateMapWithRiskLite
) => {
  const data = Object.keys(promptMap).map((date) => {
    // we just compress medium and high into one category
    // alongside safe and low
    const { safe, low, medium, high } = promptMap[date];
    return {
      date,
      safe: safe + low,
      malicious: medium + high,
    };
  });

  return data;
};

export const orderPromptsByDate = <
  T extends Prompt | PromptWithRiskMetrics | PromptWithUserAndRiskMetrics
>(
  prompts: T[]
): T[] => {
  return prompts.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
};

export const orderUsersByDate = <T extends User | UserWithRiskMetrics>(
  users: T[]
): T[] => {
  return users.sort((a, b) => {
    return new Date(a.dateJoined).getTime() - new Date(b.dateJoined).getTime();
  });
};

type UserDateMap = Record<string, (User | UserWithRiskMetrics)[]>;

export const aggregateUsersBySignupWeek = <
  T extends User | UserWithRiskMetrics
>(
  users: T[]
): UserDateMap => {
  const aggregatedUsers: UserDateMap = {};

  users.forEach((u) => {
    const joinDate = new Date(u.dateJoined);
    const midnightDiff = joinDate.getDate() - joinDate.getDay();
    const prevSunday = new Date(joinDate.setDate(midnightDiff));

    prevSunday.setHours(0, 0, 0, 0);

    const year = prevSunday.getFullYear();
    const month = (prevSunday.getMonth() + 1).toString().padStart(2, "0");
    const day = prevSunday.getDate().toString().padStart(2, "0");
    const key = `${year}-${month}-${day}`;

    if (aggregatedUsers[key]) {
      aggregatedUsers[key].push(u);
    } else {
      aggregatedUsers[key] = [u];
    }
  });

  return aggregatedUsers;
};

export const transfomUserDateMapToRechartData = (userDateMap: UserDateMap) => {
  const signupsByWeek: Array<{ week: string; signupCount: number }> = [];

  Object.keys(userDateMap).forEach((week) => {
    const signupCount = userDateMap[week].length;
    signupsByWeek.push({
      week,
      signupCount,
    });
  });
  return signupsByWeek;
};

export const aggregatePromptsRiskedByWeek = <
  T extends PromptWithRiskMetrics | PromptWithUserAndRiskMetrics
>(
  prompts: T[]
) => {
  const aggregatedPrompts: PromptDateMapWithRiskLite = {};

  prompts.forEach((prompt) => {
    const date = new Date(prompt.createdAt);
    const midnightDiff = date.getDate() - date.getDay();
    const sundayDate = new Date(date.setDate(midnightDiff)); // Get the Sunday of the week

    // Normalize time to the start of the day in local time
    sundayDate.setHours(0, 0, 0, 0);

    // Format as YYYY-MM-DD in local time zone
    const year = sundayDate.getFullYear();
    const month = (sundayDate.getMonth() + 1).toString().padStart(2, "0");
    const day = sundayDate.getDate().toString().padStart(2, "0");
    const key = `${year}-${month}-${day}`;

    if (!aggregatedPrompts[key]) {
      aggregatedPrompts[key] = {
        safe: 0,
        low: 0,
        medium: 0,
        high: 0,
      };
    }
    const { level } = prompt.riskMetrics;
    aggregatedPrompts[key][level]++;
  });
  return aggregatedPrompts;
};
