import {
  uniqueNamesGenerator,
  names,
  colors,
  adjectives,
  type Config,
} from "unique-names-generator";
import { User } from "./types";
import { randomId, getRandDateBetween } from "@/lib/utils";

const NAME_SEPARATOR = "#";

const defaultNamesConfig: Partial<Config> = {
  length: 2,
  separator: NAME_SEPARATOR,
  style: "capital",
};

const namesConfigColor: Config = {
  dictionaries: [names, colors],
  ...defaultNamesConfig,
};

const namesConfigPlain: Config = {
  dictionaries: [names, names],
  ...defaultNamesConfig,
};

const namesConfigGOT: Config = {
  dictionaries: [names, colors],
  ...defaultNamesConfig,
};

const generateFullName = () => {
  const configs = [namesConfigColor, namesConfigPlain, namesConfigGOT];
  const namesConfig = configs[Math.floor(Math.random() * configs.length)];

  const fullName = uniqueNamesGenerator(namesConfig).split(NAME_SEPARATOR);
  return {
    firstName: fullName[0],
    lastName: fullName[1],
  };
};

const generateUsername = (first: string, last: string) => {
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randInt = Math.floor(Math.random() * 99) + 1;

  const useAdjProb = Math.random() > 0.5;
  const useNumProb = Math.random() > 0.5;
  const useFirstLetterProb = Math.random() > 0.5;
  const seperators = [".", "-", "_", ""];

  let username = "";

  if (useAdjProb) {
    username += randomAdjective;
  }

  if (useFirstLetterProb) {
    username += first[0];
  } else {
    username +=
      first + seperators[Math.floor(Math.random() * seperators.length)];
  }
  username += last;
  if (useNumProb) {
    username += randInt;
  }

  return username;
};

export const generateUsers = (numUsers: number): User[] => {
  const users: User[] = [];
  for (let i = 0; i < numUsers; i++) {
    const { firstName, lastName } = generateFullName();
    const username = generateUsername(firstName, lastName);
    const id = randomId();
    const user: User = {
      id,
      firstName,
      lastName,
      email: `${username}@email.com`,
      prompts: [],
      dateJoined: getRandDateBetween().toISOString(),
    };
    users.push(user);
  }
  return users;
};
