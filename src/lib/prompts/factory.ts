// types
import type { User } from "../users";
import type { Category } from "../risk/types";

// static data
import safePromptsRaw from "./static-data/safe_prompts.json" assert { type: "json" };
import unsafePromptsRaw from "./static-data/unsafe_prompts.json" assert { type: "json" };

// utils
import { randomId, getRandDateBetween } from "../utils";
import { Prompt } from ".";

type RawPromptData = {
  content: string;
  category: string;
};

export abstract class PromptFactory {
  static safePrompts: RawPromptData[];
  static unsafePrompts: RawPromptData[];
  private constructor() {}

  static {
    const { safePrompts, unsafePrompts } = this.load();
    PromptFactory.safePrompts = safePrompts;
    PromptFactory.unsafePrompts = unsafePrompts;
  }

  private static load() {
    const safeCategories = Object.keys(safePromptsRaw);
    const safePrompts = [];
    for (const c of safeCategories) {
      //@ts-ignore
      for (const content of safePromptsRaw[c]) {
        safePrompts.push({
          content,
          category: c,
        });
      }
    }

    const unsafeCategories = Object.keys(unsafePromptsRaw);
    const unsafePrompts = [];

    for (const c of unsafeCategories) {
      //@ts-ignore
      for (const content of unsafePromptsRaw[c]) {
        unsafePrompts.push({
          content,
          category: c,
        });
      }
    }

    return { safePrompts, unsafePrompts };
  }

  static makeUnsafe(user: User): Prompt {
    const { unsafePrompts } = PromptFactory;

    const randomPromptIdx = Math.floor(Math.random() * unsafePrompts.length);
    const prompt = unsafePrompts[randomPromptIdx];

    return {
      id: randomId(),
      content: prompt.content,
      createdAt: getRandDateBetween(
        new Date(),
        new Date(user.dateJoined)
      ).toISOString(),
      userID: user.id,
      category: prompt.category as Category,
    };
  }

  static makeSafe(user: User): Prompt {
    const { safePrompts } = PromptFactory;

    const randomPromptIdx = Math.floor(Math.random() * safePrompts.length);
    const prompt = safePrompts[randomPromptIdx];

    return {
      id: randomId(),
      content: prompt.content,
      createdAt: getRandDateBetween(
        new Date(),
        new Date(user.dateJoined)
      ).toISOString(),
      userID: user.id,
      category: prompt.category as Category,
    };
  }
}
