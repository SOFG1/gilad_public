import { IKeyword } from "../keywords";

export interface IClient {
  id: number;
  name: string;
  team: string;
  email: string[] | null;
  keywords?: IKeyword[];
  birth_date?: string | null;
}

export interface IPostCardClient extends IClient {
  sended: boolean;
}

export interface IClientsState {
  clients: IClient[];
  selectedClient: IClient | null;
  isLoading: boolean;
  errorMessage: string | null;
  successMessage: string | null
}
