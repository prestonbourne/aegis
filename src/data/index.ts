
export const MAX_USERS = 10_000;
export const MAX_PROMPTS = 30_000;
export const MIN_USERS = 1;
export const MIN_PROMPTS = 1;
export const MAX_MALICIOUS_PROMPT_RATE = 1;
export const MIN_MALICIOUS_PROMPT_RATE = 0;


export const DEFAULT_CONFIG = {
    userCount: 10,
    promptCount: 10,
    maliciousPromptRate: 0.5,
    riskThresholds: {
        low: 30,
        medium: 60,
        high: 80,
    },
} as const;