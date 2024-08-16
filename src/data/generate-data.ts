import { DataConfig } from "./types";
import { generateUsers } from "./user-gen";
import { generatePrompts } from "./prompt-gen";
import safePromptsRaw from "./static/safe_prompts.json" assert { type: "json" };
import unsafePromptsRaw from "./static/unsafe_prompts.json" assert { type: "json" };
import { Category } from "./types";

// TODO: Would be nice to have certain users sway towards certain categories of prompts, but for now, we'll just randomly assign
export const generateData = (config: DataConfig) => {
  const users = generateUsers(config.userCount);
  const safePromptsData = transformRawPrompts(safePromptsRaw, ["other"]);
  const unsafePromptsData = transformRawPrompts(unsafePromptsRaw, [
    "substance_abuse",
    "DoS",
    "data_leakage",
    "hate_speech",
    "violence",
    "prompt_injection",
  ]);
  console.log('generate')

  const numUnsafePrompts = Math.floor(
    config.promptCount * config.maliciousPromptRate
  );
  const numSafePrompts = config.promptCount - numUnsafePrompts;
  console.log({
    numUnsafePrompts,
    numSafePrompts,
  })

  const safePrompts = generatePrompts({
    rawPromptDataSource: safePromptsData,
    numPrompts: numSafePrompts,
    users,
    threshold: config.riskThresholds,
  });

  const unsafePrompts = generatePrompts({
    rawPromptDataSource: unsafePromptsData,
    numPrompts: numUnsafePrompts,
    users,
    threshold: config.riskThresholds,
  });
  console.log({
    safePrompts,
    unsafePrompts,
  })

  return { users, prompts: [...safePrompts, ...unsafePrompts] };
};

type RawPromptData = Record<string, string[]>;

export const transformRawPrompts = (
  rawData: RawPromptData,
  categories: Category[]
) => {
  const prompts = [];
  for (const c of categories) {
    const currPrompts = rawData[c].map((content) => {
      return {
        content,
        categories: [c],
      };
    });
    prompts.push(...currPrompts);
  }
  return prompts;
};
