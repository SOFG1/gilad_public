import { IKeyword } from "../../store/keywords"

export interface IProps {
    keywordsOptions: {label: string, value: string}[]
    addKeyword: (word: any) => void
    selectedKeywords: IKeyword[]
    setSelectedKeywords: (params: any) => void
    isLoading: boolean
}