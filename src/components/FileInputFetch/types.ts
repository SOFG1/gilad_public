export interface IProps {
    filesList: {name: string, id: number}[]
    onChange: (files: {name: string, id: number}[]) => void
    className?: string
}