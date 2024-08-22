import { DataConfig } from "./db/types";

export const MAX_USERS = 1_000;
export const MAX_PROMPTS = 5_000;
export const MIN_USERS = 10;
export const MIN_PROMPTS = 20;
export const MAX_MALICIOUS_PROMPT_RATE = 1;
export const MIN_MALICIOUS_PROMPT_RATE = 0;

const { floor: fl, random: rnd } = Math;

export const DEFAULT_DATA_CONFIG: DataConfig = {
  userCount: fl(rnd() * (MAX_USERS - MIN_USERS / 3) + MIN_USERS) ,
  promptCount: fl(rnd() * (MAX_PROMPTS - MIN_PROMPTS / 3) + MIN_PROMPTS),
  maliciousPromptRate: 1,
  riskThresholds: {
    low: 30,
    medium: 60,
    high: 80,
  },
} as const;
