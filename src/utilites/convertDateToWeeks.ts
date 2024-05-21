// !!! run convertDateToWeeks.spec.ts test when you edit this funciton !!! use - 'yarn test' or 'npm run test'
import { convertStringToDate } from ".";
import { dayInMilliseconds, hourInMilliseconds, weekInMilliseconds } from "./dateConstants";

//Difference between Thursday 00:00 and Sunday 01:00 in milliseconds
const differenceMonThu = (4 * dayInMilliseconds) + (3 * hourInMilliseconds)

// This function converts date to number of weeks (age in weeks)    Separator is Sunday 01:00
export const convertDateToWeeks = (date: Date) => {
  let milliseconds = date.getTime()
  // getTime() returns milliseconds from 1 jan 1970 00:00 it's Thursday, we need to start count from Sunday on 01:00
  milliseconds = milliseconds + differenceMonThu
  const weeks = Math.floor(milliseconds / weekInMilliseconds)
  return weeks
};


export const convertStrDateToWeeks = (date: string) => {
  return convertDateToWeeks(convertStringToDate(date))
}


