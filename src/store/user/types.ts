export interface IUserInfo {
    login: null | string
    email: null | string
    is_active: boolean
    is_staff: boolean
    logo?: string | null
}

export type IUserState  = any

export interface ILoginType {
    username: string
    password: string
}