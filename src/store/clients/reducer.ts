import { createReducer } from "@reduxjs/toolkit";
import { userLogout } from "../user";
import {
  clientsSetClients,
  clientsSetLoading,
  clientsAppendClient,
  clientsUpdateClient,
  clientsRemoveClient,
  clientsSetErrorMessage,
  cleintsSetSelected,
  clientsSetSuccessMessage,
} from "./actions";
import { IClient, IClientsState } from "./types";

const initialState: IClientsState = {
  clients: [],
  selectedClient: null,
  isLoading: false,
  errorMessage: null,
  successMessage: null,
};

const clients = createReducer(initialState, {
  [clientsSetClients.type]: (state, action: { payload: IClient[] }) => {
    return {
      ...state,
      clients: action.payload,
    };
  },
  [clientsSetLoading.type]: (state, action: { payload: boolean }) => {
    return {
      ...state,
      isLoading: action.payload,
    };
  },
  [clientsAppendClient.type]: (state, action: { payload: IClient }) => {
    return {
      ...state,
      clients: [...state.clients, action.payload],
    };
  },
  [clientsUpdateClient.type]: (state, action: { payload: IClient }) => {
    const index = state.clients.findIndex((c) => c.id === action.payload.id);
    let allClients = [...state.clients];
    allClients.splice(index, 1, action.payload);
    //Update if selected
    const selected = action.payload.id === state.selectedClient?.id ? action.payload : state?.selectedClient
    return {
      ...state,
      selectedClient: selected ,
      clients: allClients,
    };
  },
  [cleintsSetSelected.type]: (state, action: { payload: IClient | null }) => {
    return {
      ...state,
      selectedClient: action.payload
    };
  },
  [clientsRemoveClient.type]: (state, action: { payload: number }) => {
    const withoutDeleted = state.clients.filter(c => c.id !== action.payload)
    return {
      ...state,
      clients: withoutDeleted
    };
  },
  [clientsSetErrorMessage.type]: (state, action: { payload: string | null }) => {
    return {
      ...state,
      errorMessage: action.payload
    };
  },
  [clientsSetSuccessMessage.type]: (state, action: { payload: string | null }) => {
    return {
      ...state,
      successMessage: action.payload
    };
  },
  [userLogout.type]: (state) => {
    return initialState
}
});

export default clients;
