export interface ICheckbox {
    setIsCheckedCreate: (val: boolean) => void
    checked: boolean
    disabled?: boolean
    className?: string
    id?: any
}