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
