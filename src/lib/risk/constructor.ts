import type { Prompt } from "../prompts";
import type { Category, RiskMetrics, RiskThresholds } from "./types";
import type { User } from "../users";

// TODO: Come up with a ui for this to allow users to set their own thresholds
const categoryToRisk: Record<Category, [number, number]> = {
  substance_abuse: [30, 80],
  DoS: [30, 70],
  data_leakage: [20, 60],
  hate_speech: [60, 80],
  violence: [63, 100],
  prompt_injection: [43, 100],
  other: [1, 18],
} as const;

const categoryToScore = (category: Category): number => {
  const [min, max] = categoryToRisk[category];
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export class RiskService {
  private _threshold: RiskThresholds;
  private _cachedFilteredRiskMetrics: {
    safe: RiskMetrics[];
    flagged: RiskMetrics[];
    blocked: RiskMetrics[];
    riskMetrics: RiskMetrics[];
  } | null;

  constructor(threshold: RiskThresholds) {
    this._threshold = threshold;
    this._cachedFilteredRiskMetrics = null;
  }

  setThresholds(threshold: RiskThresholds) {
    this._threshold = threshold;
  }

  assessPrompts(prompts: Prompt[]): RiskMetrics[] {
    return prompts.map((p) => this.asssessPrompt(p));
  }
  assessUsers(users: User[], userPrompts: Prompt[][]): RiskMetrics[] {
    return users.map((u, i) => this.assessUser(u, userPrompts[i]));
  }

  asssessPrompt(prompt: Prompt): RiskMetrics {
    const { category } = prompt;

    const score = categoryToScore(category);
    const level = this.getRiskLevel(score);

    return {
      id: prompt.id,
      type: "prompt",
      level,
      score,
    };
  }

  assessUser(user: User, userPrompts: Prompt[]): RiskMetrics {
    // if the user has no prompts, we can't assess them
    if (userPrompts.length === 0) {
      return {
        id: user.id,
        type: "user",
        level: "safe",
        score: 0,
        categories: [],
      };
    }

    // assess the user on the average of their prompts
    const totalPrompts = userPrompts.length;
    let totalScore = 0;
    const userCategories: Partial<Record<Category, number>> = {};

    for (const p of userPrompts) {
      const { category } = p;
      const score = categoryToScore(category);
      totalScore += score;

      if (userCategories[category]) {
        userCategories[category] += 1;
      } else {
        userCategories[category] = 1;
      }
    }

    const averageScore = totalScore / totalPrompts;
    const level = this.getRiskLevel(averageScore);

    const sortedCategories = Object.entries(userCategories).sort(
      (a, b) => b[1] - a[1]
    );
    const highestCategory = sortedCategories[0][0];

    const hasOneCategory = sortedCategories.length === 1;
    const hasMoreThanOne = sortedCategories.length >= 2;

    if (hasOneCategory) {
      return {
        id: user.id,
        type: "user",
        level,
        score: averageScore,
        categories: [highestCategory as Category],
      };
    }
    if (hasMoreThanOne) {
      // only picks the 2 highest
      return {
        id: user.id,
        type: "user",
        level,
        score: averageScore,
        categories: [
          highestCategory as Category,
          sortedCategories[1][0] as Category,
        ],
      };
    }
    return {
      id: user.id,
      type: "user",
      level,
      score: averageScore,
      categories: [],
    };
  }

  getRiskLevel = (score: number): RiskMetrics["level"] => {
    const { low, medium, high } = this._threshold;

    if (score <= low) {
      return "safe";
    } else if (score < medium) {
      return "low";
    } else if (score < high) {
      return "medium";
    } else {
      return "high";
    }
  };

  /**
   * 
   * Ideally there would be a more mature model to classify what is a safe, flagged, or blocked prompt
   * it would be based on a the admin's configuration of the thresholds. The current implementation is 
   * spaghetti(ish) because the risk service is not aware of the user set thresholds, it is only aware of the its own
   *  discretionary idea of what should be safe, flagged or blocked.
   * 
   */
  assessAndFilterPrompts = (prompts: Prompt[]) => {
    if (this._cachedFilteredRiskMetrics) {
      return this._cachedFilteredRiskMetrics;
    }

    const riskMetrics = this.assessPrompts(prompts);

    const safe = [];
    const flagged = [];
    const blocked = [];

    for (const rm of riskMetrics) {
      switch (rm.level) {
        case "safe":
          safe.push(rm);
          break;
        case "low":
        case "medium":
          flagged.push(rm);
          break;
        case "high":
          blocked.push(rm);
          break;
      }
    }

    this._cachedFilteredRiskMetrics = { safe, flagged, blocked, riskMetrics };

    return { flagged, blocked, safe, riskMetrics };
  };

  assessAndFilterUsers = (users: User[], userPrompts: Prompt[][]) => {
    const riskMetrics = this.assessUsers(users, userPrompts);

    const safe = [];
    const flagged = [];
    const blocked = [];

    for (const rm of riskMetrics) {
      switch (rm.level) {
        case "safe":
          safe.push(rm);
          break;
        case "low":
        case "medium":
          flagged.push(rm);
          break;
        case "high":
          blocked.push(rm);
          break;
      }
    }

    return { flagged, blocked, safe, riskMetrics };
  };
}
