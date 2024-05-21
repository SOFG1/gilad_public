import { useDispatch, useSelector } from "react-redux";
import { rootReducerType } from "..";
import {
  clientsGetClients,
  clientsAddClient,
  clientsEditClient,
  clientsDeleteClient,
  clientsSetErrorMessage,
  cleintsSetSelected,
  clientsSetSuccessMessage,
} from "./actions";
import { IClient, IClientsState } from "./types";

export const clientsSelector = (state: rootReducerType) => state.clients;

export const useClientsState = (): IClientsState =>
  useSelector(clientsSelector);

export const useClientsActions = () => {
  const dispatch = useDispatch();

  const onGetClients = () => {
    dispatch(clientsGetClients());
  };

  const onAddClient = (client: Omit<IClient, 'id'>) => {
      dispatch(clientsAddClient(client));
  };

  const onEditClient = (client: any) => {
    dispatch(clientsSetErrorMessage(null))
    dispatch(clientsEditClient(client));
  };

  const onDeleteClient = (id: number) => {
    dispatch(clientsDeleteClient(id));
  };

  const onSetErrorMessage = (message: null | string) => {
    dispatch(clientsSetErrorMessage(message))
  }

  const onSetSuccessMessage = (message: null | string) => {
    dispatch(clientsSetSuccessMessage(message))
  }


  const onSetSelectedClient = (info: IClient | null) => {
    dispatch(cleintsSetSelected(info))
  }

  return {
    onGetClients,
    onEditClient,
    onAddClient,
    onDeleteClient,
    onSetErrorMessage,
    onSetSuccessMessage,
    onSetSelectedClient,
  };
};
