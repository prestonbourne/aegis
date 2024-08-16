export type Prompt = {
  id: string;
  content: string;
  createdAt: string;
  user: User;
  categories: Category[];
  risk: Risk;
};

export type PromptRawData = {
  content: string;
  categories: Category[];
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarURL?: string;
  prompts: Prompt[];
  dateJoined: string;
};

export type RiskAssessedUser = User & {
  violationCategories: Category[];
  risk: Risk;
};

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
export type Risk = {
  level: RiskLevel;
  score: RiskScore;
};

export type DataConfig = {
  userCount: number;
  promptCount: number;
  maliciousPromptRate: number;
  riskThresholds: RiskThresholds;
};

export type RiskThresholds = {
  low: RiskScore;
  medium: RiskScore;
  high: RiskScore;
};
