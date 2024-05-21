export interface ITextInput {
    onChange: (value: string)=> void
    value: string
    placeholder?: string
    label?: string
    className?: string
    searchBtn?: boolean
    required?: boolean
    isPassword?: boolean
}