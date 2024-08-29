import type { RiskThresholds } from "@/lib/risk/types";
import type { Prompt } from "../prompts";
import type { User } from "../users";
import type { RiskMetrics } from "../risk/types";

export type DataConfig = {
  userCount: number;
  promptCount: number;
  maliciousPromptRate: number;
  riskThresholds: RiskThresholds;
};

export type PromptWithUserDetails = Prompt & {
  user: User;
};

export type PromptWithRiskMetrics = Prompt & {
  riskMetrics: RiskMetrics;
};

export type PromptWithUserAndRiskMetrics = Prompt & {
  user: User;
  riskMetrics: RiskMetrics;
};

export type UserWithRiskMetrics = User & { riskMetrics: RiskMetrics };

export { User };
