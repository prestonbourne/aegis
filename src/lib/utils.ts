import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const randomId = () => {
  // base36 is 0-9 and a-z so it's a good choice for generating random ids
  const base = Date.now().toString(36)
  const extra = Math.random().toString(36).slice(2)
  return base + extra
}

export function getRandDateBetween(endDate: Date = new Date, startDate?: Date): Date {
  const daysInSixMonths = 180;
  const hoursInDay = 24;
  const minutesInHour = 60;
  const secondsInMinute = 60;
  const millisecondsInSecond = 1000;

  const millisecondsInSixMonths = daysInSixMonths * hoursInDay * minutesInHour * secondsInMinute * millisecondsInSecond;

  const sixMonthsAgo = new Date(Date.now() - millisecondsInSixMonths);
  startDate = startDate || sixMonthsAgo;

  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
}

export const getFullName = (firstName: string, lastName: string) => {
  return `${firstName} ${lastName}`;
};