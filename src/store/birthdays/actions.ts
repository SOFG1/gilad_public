import { createAction } from "@reduxjs/toolkit";
import { IAddBirthday, IBirthDay } from "./types";

export const birthdaysGetAllBDays = createAction('birthdays/getAllBDays')
export const birthdaysSetAllBDays = createAction<IBirthDay[]>('birthdays/setAllBDays')

export const birthdaysGetTodayBDays = createAction('birthdays/getTodayBDays')
export const birthdaysSetTodayBDays = createAction<IBirthDay[]>('birthdays/setTodayBDays')

export const birthdaysSetIsFetching = createAction<boolean>('birthdays/setIsFetching')
export const birthdaysSetErrorMes = createAction<string | null>('birthdays/setErrorMes')


export const birthdaysAddBirthday = createAction<IAddBirthday>('birthdays/addBirthday')
export const birthdaysAppendBirthday = createAction<IBirthDay>('birthdays/appendBirthday')

export const birthdaysDeleteBirthday = createAction<number>('birthdays/deleteBirthday')
export const birthdaysRemoveBirthday = createAction<number>('birthdays/removeBirthday')

export const birthdaysEditBirthday = createAction<{id: number, params: IAddBirthday}>('birthdays/editBirthday')
export const birthdaysUpdateBirthday = createAction<IBirthDay>('birthdays/updateBirthday')
