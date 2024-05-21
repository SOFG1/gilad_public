import { createReducer } from "@reduxjs/toolkit";
import { userLogout } from "../user";
import {
  birthdaysSetTodayBDays,
  birthdaysSetAllBDays,
  birthdaysSetIsFetching,
  birthdaysSetErrorMes,
  birthdaysAppendBirthday,
  birthdaysRemoveBirthday,
  birthdaysUpdateBirthday,
} from "./actions";
import { IBirthDay, IBirthdaysState } from "./types";

const initialState: IBirthdaysState = {
  allBirthdays: [],
  todayBirthdays: [],
  isFetching: false,
  errorMessage: null,
};

const birthdays = createReducer(initialState, {
  [birthdaysSetAllBDays.type]: (state, action: { payload: IBirthDay[] }) => {
    return {
      ...state,
      allBirthdays: action.payload,
    };
  },
  [birthdaysSetTodayBDays.type]: (state, action: { payload: IBirthDay[] }) => {
    return {
      ...state,
      todayBirthdays: action.payload,
    };
  },
  [birthdaysSetIsFetching.type]: (state, action: { payload: boolean }) => {
    return {
      ...state,
      isFetching: action.payload,
    };
  },
  [birthdaysSetErrorMes.type]: (state, action: { payload: string | null }) => {
    return {
      ...state,
      errorMessage: action.payload,
    };
  },
  [birthdaysAppendBirthday.type]: (state, action: { payload: IBirthDay }) => {
    return {
      ...state,
      allBirthdays: [action.payload, ...state.allBirthdays],
    };
  },
  [birthdaysRemoveBirthday.type]: (state, action: { payload: number }) => {
    const filtered = state.allBirthdays.filter(bd => bd.id !== action.payload)
    return {
      ...state,
      allBirthdays: filtered
    };
  },
  [birthdaysUpdateBirthday.type]: (state, action: { payload: IBirthDay }) => {
    const birthdaysCopy = [...state.allBirthdays]
    const index = birthdaysCopy.findIndex(bd => bd.id === action.payload.id)
    birthdaysCopy.splice(index, 1, action.payload)
    return {
      ...state,
      allBirthdays: birthdaysCopy
    };
  },
  [userLogout.type]: () => {
    return initialState;
  },
});

export default birthdays;
