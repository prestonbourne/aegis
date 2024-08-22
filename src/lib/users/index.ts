type UserConstructorParams = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  IPAddress: string;
  avatarURL?: string;
  prompts: string[];
  dateJoined: string;
};

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  IPAddress: string;
  avatarURL?: string;
  prompts: string[];
  dateJoined: string;
}

export function createUser({
  id,
  firstName,
  lastName,
  email,
  IPAddress,
  avatarURL,
  prompts,
  dateJoined,
}: UserConstructorParams): User {
  return {
    id,
    firstName,
    lastName,
    email,
    IPAddress,
    avatarURL: avatarURL || "",
    prompts,
    dateJoined,
  };
}

export function getFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}
