import { axiosInstance } from "."
import { ILoginType } from "../store/user/types"

export type CriticalityValueType = "10024" | "10025" | "10026" | "10027"

export interface IReportBugParams {
    description: string
    steps: string
    criticality_id: CriticalityValueType
    files: FileList
}

export const User = {
    login: async(params: ILoginType) => {
        return await axiosInstance.post('login/', params)
    },
    getInfo: async(token: string) => {
        return await axiosInstance.get('user_info/', {
            headers: {
                "Authorization": `Token ${token}`
            },
        })
    },
    reportJiraBug: async (token: string, params: IReportBugParams) => {
        const formData = new FormData()
        formData.append("description", params.description)
        formData.append("steps", params.steps)
        formData.append("criticality_id", params.criticality_id)
        const list = Array.from(params.files)
        list.forEach(f => formData.append("files", f))
        return await axiosInstance.post('jira/issue/', formData, {
            headers: {
                "Authorization": `Token ${token}`
            },
        })
    }
}