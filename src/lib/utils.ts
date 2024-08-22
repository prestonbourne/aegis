import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const randomId = () => {
  // base36 is 0-9 and a-z so it's a good choice for generating random ids
  const base = Date.now().toString(36);
  const extra = Math.random().toString(36).slice(2);
  return base + extra;
};

const getFirstDayOfPreviousMonth = () => {
  // Get the current date
  let currentDate = new Date();

  // Set the date to the first day of the current month
  currentDate.setDate(1);

  // Subtract one month
  currentDate.setMonth(currentDate.getMonth() - 1);

  // Now the date is the first day of the previous month
  return currentDate;
};

export function getRandDateBetween(
  endDate: Date = new Date(),
  startDate?: Date
): Date {
  startDate = startDate || getFirstDayOfPreviousMonth();

  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
}

export const getFullName = (firstName: string, lastName: string) => {
  return `${firstName} ${lastName}`;
};

export const getInitials = (firstName: string, lastName: string) => {
  return `${firstName[0]}${lastName[0]}`;
};


export const arraysOverlap = (arr1: any[], arr2: any[]) => {
  return arr1.some((item) => arr2.includes(item));
};

export const randomFloatBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const prettyFloat = (num: number) => {
  return parseFloat(num.toFixed(2));
};

export const prettyPercent = (num: number): string => {
  return `${parseInt(num.toLocaleString())}%`;
};

export const toInt = (num: number) => {
  return Math.trunc(num);
};

// https://www.youtube.com/watch?v=1k8lF3BriXM
const betaRandom = (alpha: number, beta: number): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  const v1 = Math.pow(u1, 1 / alpha);
  const v2 = Math.pow(u2, 1 / beta);
  return v1 / (v1 + v2);
};

export const weightedRandomFloat = (
  min: number,
  max: number,
  bias: number
): number => {
  // Ensure bias is within [0, 1] range
  bias = Math.max(0, Math.min(1, bias));

  // Determine alpha and beta based on the bias
  const alpha = 1 - bias + 1; // If bias is 0, alpha is 2 (favoring lower end), if bias is 1, alpha is 1 (even)
  const beta = bias + 1; // If bias is 0, beta is 1 (favoring lower end), if bias is 1, beta is 2 (favoring upper end)

  // Generate a random number and scale it to the desired range
  const random = betaRandom(alpha, beta);
  return min + random * (max - min);
};