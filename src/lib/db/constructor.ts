import { UserFactory } from "@/lib/users/factory";
import type {
  DataConfig,
  PromptWithUserAndRiskMetrics,
  PromptWithUserDetails,
  UserWithRiskMetrics,
} from "./types";
import { PromptFactory } from "@/lib/prompts/factory";
import { User } from "@/lib/users";
import { Prompt } from "@/lib/prompts";
import { RiskMetrics } from "../risk/types";

export class DB {
  users: User[];
  prompts: Prompt[];
  riskMetrics: RiskMetrics[];

  riskMetricsMap: Record<string, RiskMetrics>;
  usersMap: Record<string, User>;
  promptsMap: Record<string, Prompt>;
  config: DataConfig;

  constructor(config: DataConfig) {
    this.config = config;
    this.usersMap = {};
    this.promptsMap = {};
    this.riskMetricsMap = {};

    this.riskMetrics = [];

    this.users = UserFactory.generateUsers(config.userCount);
    for (const u of this.users) {
      this.usersMap[u.id] = u;
    }

    this.prompts = [];

    const fl = Math.floor;
    const unsafePromptNum = fl(config.maliciousPromptRate * config.promptCount);

    for (let i = 0; i < unsafePromptNum; i++) {
      const randUserIdx = fl(this.users.length * Math.random());
      const randUser = this.users[randUserIdx];
      const p = PromptFactory.makeUnsafe(randUser);
      this.prompts.push(p);
      this.promptsMap[p.id] = p;
    }

    const safePromptNum = config.promptCount - unsafePromptNum;

    for (let i = 0; i < safePromptNum; i++) {
      const randUserIdx = fl(this.users.length * Math.random());
      const randUser = this.users[randUserIdx];
      const p = PromptFactory.makeSafe(randUser);
      this.prompts.push(p);
      this.promptsMap[p.id] = p;
    }
    this.shufflePrompts();
  }

  /* 
  necessary because we make safe and unsafe prompts by order in the constructor. 
  this makes the data flow in more naturally at query time
  */
  private shufflePrompts() {
    this.prompts.sort(() => {
      const randA = Math.random();
      const randB = Math.random();
      return randA - randB;
    });
    return this.prompts;
  }

  getPromptsWithUserDetails(): PromptWithUserDetails[] {
    const res = this.prompts.map((p) => {
      const user = this.usersMap[p.userID];
      return { ...p, user };
    });
    return res;
  }

  getPromptsWithUserAndRiskMetrics(): PromptWithUserAndRiskMetrics[] {
    const res = this.prompts.map((p) => {
      const user = this.usersMap[p.userID];
      if (!user) {
        throw new Error(`User not found for prompt ${p.id}`);
      }

      const riskMetrics = this.riskMetricsMap[p.id];
      if (!riskMetrics) {
        throw new Error(`RiskMetrics not found for prompt ${p.id}`);
      }

      return { ...p, user, riskMetrics };
    });
    return res;
  }

  getRiskMetricsById(id: string): RiskMetrics | undefined {
    return this.riskMetricsMap[id];
  }

  getPromptById(id: string): Prompt | undefined {
    return this.promptsMap[id];
  }

  getUserById(id: string): User | undefined {
    return this.usersMap[id];
  }

  setRiskMetrics(metrics: RiskMetrics[]) {
    this.riskMetrics = metrics;
    this.riskMetricsMap = metrics.reduce((acc, m) => {
      acc[m.id] = m;
      return acc;
    }, {} as Record<string, RiskMetrics>);
  }

  addRiskMetrics(metrics: RiskMetrics) {
    this.riskMetricsMap[metrics.id] = metrics;
    this.riskMetrics.push(metrics);


  }

  addRisMetricsSet(metrics: RiskMetrics[]) {
    metrics.forEach(this.addRiskMetrics.bind(this));
  }

  getUsersWithRiskMetrics(): UserWithRiskMetrics[] {
    const res = this.users.map((u) => {
      const riskMetrics = this.riskMetricsMap[u.id];
      if (!riskMetrics) {
        throw new Error(`RiskMetrics not found for user ${u.id}`);
      }

      return { ...u, riskMetrics };
    });
    return res;
  }

  getPromptsByUserId(userId: string): Prompt[] {
    return this.prompts.filter((p) => p.userID === userId);
  }
}
