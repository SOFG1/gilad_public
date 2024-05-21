//This function takes a string in this format: DD-MM-YYYY HH:MM and converts it to a Date object
export const convertStringToDate = (date: string): Date => {
  const day = date.slice(0, 2);
  const month = date.slice(3, 5);
  const year = date.slice(6, 10);
  const time = date.slice(11, 16);
  return new Date(`${year}-${month}-${day} ${time}:00`);
};

export const getDaysCount = (date: Date) => {
  return Math.floor(date.getTime() / 1000 / 60 / 60 / 24);
};

export const addZeroForward = (string: string, needLength: number = 2) => {
  return `${"0".repeat(needLength - string.length)}${string}`;
};

export const getFormatDateTime = (date: Date) => {
  const days = date.getDate().toString();
  const month = (date.getMonth() + 1).toString();
  const years = date.getFullYear();
  const hours = date.getHours().toString();
  const minutes = date.getMinutes().toString();
  return `${addZeroForward(days)}.${addZeroForward(
    month
  )}.${years} ${addZeroForward(hours)}:${addZeroForward(minutes)}`;
};

export const getFormatDate = (date: Date) => {
  const days = date.getDate().toString();
  const month = (date.getMonth() + 1).toString();
  const years = date.getFullYear();
  return `${addZeroForward(days)}.${addZeroForward(month)}.${years}`;
};

//Format Date
function padTo2Digits(num: number) {
  return num.toString().padStart(2, "0");
}

export function formatDate(date: Date) {
  return (
    [padTo2Digits(date.getHours()), padTo2Digits(date.getMinutes())].join(":") +
    " " +
    [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join("-")
  );
}

//This function takes in 2 arrays with numbers and returns true if they contain the same values
export const compareNumArrays = (first: number[], second: number[]) => {
  first.sort();
  second.sort();
  return first + "" == second + "";
};
