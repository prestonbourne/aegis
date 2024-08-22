import { Category } from "../risk/types";

type PromptConstructorParams = {
  id: string;
  content: string;
  createdAt: string;
  userID: string;
  category: Category;
};

export class Prompt {
  id: string;
  content: string;
  createdAt: string;
  userID: string;
  category: Category;

  constructor({
    id,
    content,
    createdAt,
    userID,
    category,
  }: PromptConstructorParams) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.userID = userID;
    this.category = category;
  }
}
