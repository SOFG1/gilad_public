import { ISinglePost } from "../store/posts"


export type TemplateType = (post: ISinglePost) => string

export interface SignatureParams {
    full_name: string  | null
    title: string | null
    office_phone: string | null
    mobile_phone: string | null
    email: string | null
    logo: string | null
}