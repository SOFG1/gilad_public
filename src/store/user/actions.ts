import { createAction } from "@reduxjs/toolkit";
import { ILoginType, IUserInfo } from "./types";

export const userLogin = createAction<ILoginType>('user/login')
export const userSetError = createAction<null | string>('user/setError')
export const userSetLogin = createAction<string>('user/setLogin')
export const userGetInfo = createAction('user/getInfo')
export const userSetInfo = createAction<IUserInfo>('user/setInfo')
export const userLogout = createAction('user/logout')

