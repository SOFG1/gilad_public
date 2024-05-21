import { convertDateToWeeks } from "../utilites/convertDateToWeeks"
import { getMondayFromWeek } from "../utilites/getMondayFromWeek"


describe('getMondayFromWeek utility test', () => {

    test("test case #1", () => {
        const date = new Date(2023, 0, 5, 21, 10)
        const weeksCount = convertDateToWeeks(date)
        //We converted dates to strings to make comparison more easy
        const result = getMondayFromWeek(weeksCount).toLocaleDateString()
        const mondayDate = new Date(2023, 0, 2, 0, 0).toLocaleDateString()
        expect(result).toBe(mondayDate)
    })


    test("test case #2", () => {
        const date = new Date(2023, 0, 1, 21, 10)
        const weeksCount = convertDateToWeeks(date)
        //We converted dates to strings to make comparison more easy
        const result = getMondayFromWeek(weeksCount).toLocaleDateString()
        const mondayDate = new Date(2023, 0, 2, 0, 0).toLocaleDateString()
        expect(result).toBe(mondayDate)
    })

    test("test case #3", () => {
        const date = new Date(2023, 0, 7, 21, 10)
        const weeksCount = convertDateToWeeks(date)
        //We converted dates to strings to make comparison more easy
        const result = getMondayFromWeek(weeksCount).toLocaleDateString()
        const mondayDate = new Date(2023, 0, 2, 0, 0).toLocaleDateString()
        expect(result).toBe(mondayDate)
    })

    test("test case #4 (Wrong test case)", () => {
        const date = new Date(2023, 0, 8, 21, 10)
        const weeksCount = convertDateToWeeks(date)
        //We converted dates to strings to make comparison more easy
        const result = getMondayFromWeek(weeksCount).toLocaleDateString()
        const mondayDate = new Date(2023, 0, 2, 0, 0).toLocaleDateString()
        expect(result).not.toBe(mondayDate)
    })


})

export {}