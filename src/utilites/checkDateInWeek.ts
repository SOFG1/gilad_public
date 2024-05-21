// !!! run checkDateInWeek.spec.ts test when you edit this funciton !!! use - 'yarn test' or 'npm run test'

import { convertStringToDate } from ".";

//This function checks whether the received date is beetween the specified date range in a week
export const checkDateInWeek = (
  date: Date,
  firstDate: string,
  secondDate: string
): boolean => {
  //Checking date in minutes
  const checkingDateInMinutes = convertDateToMinutes(date);
  //Filters dates in minutes
  const firstDateInMinutes = convertStringDateToMinutes(firstDate);
  const secondDateInMinutes = convertStringDateToMinutes(secondDate);

  if (firstDateInMinutes < secondDateInMinutes) {
    return (
      checkingDateInMinutes > firstDateInMinutes &&
      checkingDateInMinutes < secondDateInMinutes
    );
  }
  if (firstDateInMinutes > secondDateInMinutes) {
    return (
      checkingDateInMinutes > firstDateInMinutes ||
      checkingDateInMinutes < secondDateInMinutes
    );
  }
  return false;
};

export const checkStrDateinWeek = (
  date: string,
  firstDate: string,
  secondDate: string
): boolean => {
  return checkDateInWeek(convertStringToDate(date), firstDate, secondDate);
};

//This fuction receives 3 arguments:
//1. Date object that will be checked
//2. First date <string>
//3. Second date <string>
//2 and 3 values must be strings in this format: 'D HH:MM'
//where D is a number between 0 and 6 which specifies week day. 0 - is Sunday

//Returns true if first Date param is between 2 and 3 dates

//This function takes in date in string format: "D HH:MM"
//and converts it into minutes count from start(00:00 Sun) of the week in order to use it in further calculations
// !!! run convertStringDateToMinutes.spec.ts test when you edit this funciton !!! use - 'yarn test' or 'npm run test'
export function convertStringDateToMinutes(date: string): number {
  const daysInMinutes = Number(date.slice(0, 1)) * 24 * 60;
  const hoursInMinutes = Number(date.slice(2, 4)) * 60;
  const minutes = Number(date.slice(5, 7));
  return daysInMinutes + hoursInMinutes + minutes;
}

//This function takes in Date
//and converts it into minutes count from start(00:00 Sun) of the week in order to use it in further calculations
function convertDateToMinutes(date: Date): number {
  const daysInMinutes = date.getDay() * 24 * 60;
  const hoursInMinutes = date.getHours() * 60;
  const minutes = date.getMinutes();
  return daysInMinutes + hoursInMinutes + minutes;
}
