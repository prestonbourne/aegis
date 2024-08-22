export const CATEGORIES: Category[] = [
  "substance_abuse",
  "DoS",
  "data_leakage",
  "hate_speech",
  "violence",
  "prompt_injection",
  "other",
];
export type Category =
  | "substance_abuse"
  | "DoS"
  | "data_leakage"
  | "hate_speech"
  | "violence"
  | "prompt_injection"
  | "other";

export type RiskLevel = "safe" | "low" | "medium" | "high";
export type RiskScore = number; // 0-100

export type PromptRiskMetrics = {
  id: string;
  type: "prompt";
  level: RiskLevel;
  score: RiskScore;
};

export type UserRiskMetrics = {
  id: string;
  type: "user";
  level: RiskLevel;
  score: RiskScore;
  categories: Category[];
};

export type RiskMetrics = PromptRiskMetrics | UserRiskMetrics;

export type RiskThresholds = {
  low: RiskScore;
  medium: RiskScore;
  high: RiskScore;
};
