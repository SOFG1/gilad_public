// !!! run getMondayFromWeek.spec.ts test when you edit this funciton !!! use - 'yarn test' or 'npm run test'
import { dayInMilliseconds, weekInMilliseconds } from "./dateConstants";

//This function takes in weeks count and returns Monday date of that week
export const getMondayFromWeek = (weeks: number): Date => {
  //new Date() returns Thursday, so we need to add some offset to get Monday
  const offset = 3 * dayInMilliseconds;
  const date = new Date(weeks * weekInMilliseconds - offset);
  return date;
};
