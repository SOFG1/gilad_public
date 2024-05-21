export interface IProps {
    suggestedClients: {id: number, name: string}[]
    selectedClients: number[]
    onChange: (selectedClients: number[]) => void
}