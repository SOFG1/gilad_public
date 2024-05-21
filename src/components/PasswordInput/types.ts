export interface IProps {
    onChange: (value: string)=> void
    value: string
    placeholder?: string
    label?: string
    className?: string
    required?: boolean
}