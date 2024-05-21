import { IClient } from "../../store/clients"

export interface IProps {
    searchClient: string
    setSearchClient: (value: string) => void
    clientElements: IClient[]
    isLoading: boolean
    onDeleteClient: (clientId: number) => void
    onSetSelectedClient: (client: IClient) => void
}