import {
  uniqueNamesGenerator,
  names,
  colors,
  adjectives,
  type Config,
} from "unique-names-generator";
import { createUser, User } from "./";
import { randomId, getRandDateBetween } from "@/lib/utils";

/*
 dictionary for [unique-names-generator](https://github.com/andreasonny83/unique-names-generator)
 based on "bastard" names from Game of Thrones
 */

const gameOfThronesBastardNames = [
  "Snow",
  "Sand",
  "Rivers",
  "Stone",
  "Pyke",
  "Waters",
  "Hill",
  "Flowers",
];

export abstract class UserFactory {
  protected static readonly NAME_SEPARATOR = "#";

  protected static readonly defaultNamesConfig: Partial<Config> = {
    length: 2,
    separator: UserFactory.NAME_SEPARATOR,
    style: "capital",
  };

  protected static readonly namesConfigColor: Config = {
    dictionaries: [names, colors],
    ...UserFactory.defaultNamesConfig,
  };

  protected static readonly namesConfigPlain: Config = {
    dictionaries: [names, names],
    ...UserFactory.defaultNamesConfig,
  };

  protected static readonly namesConfigGOT: Config = {
    dictionaries: [names, gameOfThronesBastardNames],
    ...UserFactory.defaultNamesConfig,
  };

  protected static generateFullName(): { firstName: string; lastName: string } {
    const configs = [
      UserFactory.namesConfigColor,
      UserFactory.namesConfigPlain,
      UserFactory.namesConfigGOT,
    ];
    const namesConfig = configs[Math.floor(Math.random() * configs.length)];

    const fullName = uniqueNamesGenerator(namesConfig).split(
      UserFactory.NAME_SEPARATOR
    );
    return {
      firstName: fullName[0],
      lastName: fullName[1],
    };
  }

  protected static generateUsername(first: string, last: string): string {
    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randInt = Math.floor(Math.random() * 99) + 1;

    const useAdjProb = Math.random() > 0.5;
    const useNumProb = Math.random() > 0.5;
    const useFirstLetterProb = Math.random() > 0.5;
    const initialsProb = Math.random() < 0.3;
    const separators = [".", "-", "_", ""];

    if (initialsProb) {
      return `${first[0]}${last[0]}${randInt}`;
    }

    let username = "";

    if (useAdjProb) {
      username += randomAdjective;
    }

    if (useFirstLetterProb) {
      username += first[0];
    } else {
      username +=
        first + separators[Math.floor(Math.random() * separators.length)];
    }
    username += last;
    if (useNumProb) {
      username += randInt;
    }

    return username;
  }

  protected static randomEmail(): string {
    const domains = ["gmail", "kmail", "aol", "outlook", "yahoo", "hotmail"];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return domain;
  }

  protected static randomIP(): string {
    const ip = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256));
    return ip.join(".");
  }

  public static generateUsers(numUsers: number): User[] {
    const users: User[] = [];
    for (let i = 0; i < numUsers; i++) {
      const { firstName, lastName } = UserFactory.generateFullName();
      const username = UserFactory.generateUsername(
        firstName,
        lastName
      ).toLocaleLowerCase();
      const id = randomId();
      const user = createUser({
        id,
        firstName,
        lastName,
        IPAddress: UserFactory.randomIP(),
        email: `${username}@${UserFactory.randomEmail()}.com`,
        prompts: [],
        dateJoined: getRandDateBetween().toISOString(),
      });
      users.push(user);
    }
    return users;
  }
}
