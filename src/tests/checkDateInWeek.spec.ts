import { checkDateInWeek } from "../utilites/checkDateInWeek"

describe('checkDateInWeek utility test', () => {

    test('test case #1', () => {
        const filterStart = "0 00:00"
        const filterEnd = "6 23:59"
        const correctDate = new Date(2023, 0, 16, 15, 59)
        const correctResult = checkDateInWeek(correctDate, filterStart, filterEnd)
        expect(correctResult).toBe(true)
    })

    test('test case #2', () => {
        const filterStart = "6 23:00"
        const filterEnd = "6 23:59"
        const correctDate = new Date(2023, 0, 14, 23, 30)
        const correctResult = checkDateInWeek(correctDate, filterStart, filterEnd)
        expect(correctResult).toBe(true)
        const wrongDate1 = new Date(2023, 0, 12, 23, 30)
        const wrongResult1 = checkDateInWeek(wrongDate1, filterStart, filterEnd)
        expect(wrongResult1).toBe(false)
        const wrongDate2 = new Date(2023, 0, 15, 0, 0)
        const wrongResult2 = checkDateInWeek(wrongDate2, filterStart, filterEnd)
        expect(wrongResult2).toBe(false)
    })


    test('test case #3', () => {
        const filterStart = "5 00:00"
        const filterEnd = "2 23:59"
        const correctDate1 = new Date(2023, 0, 14, 15, 59)
        const correctResult1 = checkDateInWeek(correctDate1, filterStart, filterEnd)
        expect(correctResult1).toBe(true)
        const correctDate2 = new Date(2023, 0, 17, 15, 59)
        const correctResult2 = checkDateInWeek(correctDate2, filterStart, filterEnd)
        expect(correctResult2).toBe(true)
        const wrongDate = new Date(2023, 0, 11, 15, 59)
        const wrongResult = checkDateInWeek(wrongDate, filterStart, filterEnd)
        expect(wrongResult).toBe(false)
    })


})

export {}