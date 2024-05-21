import { convertStringDateToMinutes } from "../utilites/checkDateInWeek"

describe('convertStringDateToMinutes utility test', () => {

    it("test case for 0 00:59", () => {
        const result = convertStringDateToMinutes('0 00:59')
        expect(result).toBe(59)
    })


    it("test case for 0 06:59", () => {
        const result = convertStringDateToMinutes('0 06:59')
        expect(result).toBe(419)
    })

    it("test case for 6 23:59", () => {
        const result = convertStringDateToMinutes('6 23:59')
        expect(result).toBe(10079)
    })


})

export {}