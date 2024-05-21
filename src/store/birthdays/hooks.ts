import { useDispatch, useSelector } from "react-redux";
import { rootReducerType } from "..";
import { birthdaysAddBirthday, birthdaysDeleteBirthday, birthdaysEditBirthday, birthdaysGetAllBDays, birthdaysGetTodayBDays, birthdaysSetErrorMes } from "./actions";
import { IAddBirthday } from "./types";

export const birthdaysSelector = (state: rootReducerType) => state.birthdays

export const useBirthdaysState = () => useSelector(birthdaysSelector)

export const useBirthdaysActions = () => {
    const dispatch = useDispatch()

    const onGetAllBDays = () => {
        dispatch(birthdaysGetAllBDays())
    }

    const onGetTodayBDays = () => {
        dispatch(birthdaysGetTodayBDays())
    }

    const onAddBirthday = (params: IAddBirthday) => {
        dispatch(birthdaysAddBirthday(params))
    }

    const onDeleteBirthday = (id: number) => {
        dispatch(birthdaysDeleteBirthday(id))
    }

    const onEditBirthday = (id: number, params: IAddBirthday) => {
        dispatch(birthdaysEditBirthday({id, params}))
    }

    const onSetErrorMessage = (message: string | null) => {
        dispatch(birthdaysSetErrorMes(message))
    }
    
    return {
        onGetTodayBDays,
        onGetAllBDays,
        onAddBirthday,
        onSetErrorMessage,
        onDeleteBirthday,
        onEditBirthday
    }
}