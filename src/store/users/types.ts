import { IClient } from "../clients";

export interface IUser {
  id: number;
  login: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  is_keyword_editor: boolean
  is_client_editor: boolean
  clients: IClient[];
  available_sources: {id: number, name: string}[];
  full_name: string | null ;
  full_name_en: string | null ;
  mobile_phone: string | null;
  office_phone: string | null;
  title: string | null;
}

export interface IAddUser {
  login: string;
  password: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  clients: number[];
}

export interface IEditUser {
  login: string;
  password?: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  is_keyword_editor: boolean
  is_client_editor: boolean
  available_sources?: string
  full_name?: string
  full_name_en?: string
  mobile_phone?: string
  office_phone?: string
  title?: string
  logo?: File
}

export interface IUsersState {
  users: IUser[];
  selectedUserId: number | null;
  isFetching: boolean;
}
