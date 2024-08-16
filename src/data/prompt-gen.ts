import { User, Prompt, RiskThresholds, PromptRawData } from "./types";
import { randomId, getRandDateBetween } from "@/lib/utils";
import { assessPromptRiskByCategory } from "./assess-risk";

type GeneratePromptsParams = {
  rawPromptDataSource: PromptRawData[];
  numPrompts: number;
  users: User[];
  threshold: RiskThresholds;
};

export const generatePrompts = ({
  rawPromptDataSource,
  numPrompts,
  users,
  threshold,
}: GeneratePromptsParams): Prompt[] => {
  const prompts: Prompt[] = [];
  const totalUsers = users.length;
  let remainingPrompts = numPrompts;

  while (remainingPrompts > 0) {
    remainingPrompts--;
    const randomUserIdx = Math.floor(Math.random() * totalUsers);
    const user = users[randomUserIdx];
    const randomPromptIdx = Math.floor(
      Math.random() * rawPromptDataSource.length
    );
    const prompt = rawPromptDataSource[randomPromptIdx];

    const highestRiskAssessment = prompt.categories
      .map((c) => assessPromptRiskByCategory(c, threshold))
      .sort((a, b) => b.score - a.score)[0];
    prompts.push({
      id: randomId(),
      content: prompt.content,
      createdAt: getRandDateBetween(
        new Date(),
        new Date(user.dateJoined)
      ).toISOString(),
      user,
      categories: prompt.categories,
      risk: highestRiskAssessment,
    });
  }
  return prompts;
};
