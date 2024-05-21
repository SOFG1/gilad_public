import { convertDateToWeeks } from "../utilites/convertDateToWeeks";

describe("convertDateToWeeks utility test", () => {
  it("test case #1", () => {
    const date = new Date(2023, 0, 16, 15, 59);
    const result = convertDateToWeeks(date);
    expect(result).toBe(2768);
  });

  it("test case #2", () => {
    const date = new Date(2015, 11, 7, 21, 10);
    const result = convertDateToWeeks(date);
    expect(result).toBe(2397);
  });

  it("test case #2", () => {
    const date = new Date(2000, 7, 4, 5, 10);
    const result = convertDateToWeeks(date);
    expect(result).toBe(1596);
  });
});

export {};
