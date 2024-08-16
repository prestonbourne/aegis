import { weightedRandomFloat } from "@/lib/number-utils";
import { Risk, RiskThresholds, Category } from "./types";

// export const assessUserRisk = (user: ): Risk => {};

export const assessPromptRiskByCategory = (
  category: Category,
  threshold: RiskThresholds
): Risk => {
  switch (category) {
    case "hate_speech":
    case "violence": {
      const score = weightedRandomFloat(30, 97, 2/3);
      const level = getRiskLevel(score, threshold);
      return {
        level,
        score,
      };
    }
    case "substance_abuse":
    case "DoS":
    case "data_leakage": {
      const score = weightedRandomFloat(35, 65, 1/3);
      const level = getRiskLevel(score, threshold);
      return {
        level,
        score,
      };
    }
    case "prompt_injection": {
      const score = weightedRandomFloat(15, 80, .5);
      const level = getRiskLevel(score, threshold);
      return {
        level,
        score,
      };
    }
    case "other":
    default: {
      const score = weightedRandomFloat(0, 25, .15);
      const level = getRiskLevel(score, threshold);
      return {
        level,
        score,
      };
    }
  }
};

export const getRiskLevel = (
  score: number,
  threshold: RiskThresholds
): Risk["level"] => {
  if (score < threshold.low) {
    return "safe";
  } else if (score < threshold.medium) {
    return "low";
  } else if (score < threshold.high) {
    return "medium";
  } else {
    return "high";
  }
};
