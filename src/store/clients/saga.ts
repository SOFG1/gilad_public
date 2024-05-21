import { call, put, select, takeLatest } from "redux-saga/effects";
import { handle } from "../../api";
import { Clients } from "../../api/Clients";
import { userSelector } from "../user/hooks";
import {
  clientsGetClients,
  clientsSetClients,
  clientsAddClient,
  clientsSetLoading,
  clientsAppendClient,
  clientsEditClient,
  clientsUpdateClient,
  clientsDeleteClient,
  clientsRemoveClient,
  cleintsSetSelected,
  clientsSetErrorMessage,
  clientsSetSuccessMessage,
} from "./actions";
import { appSetAlert } from "../app";
import { IClient } from "./types";

export function* clientsWatcher() {
  yield takeLatest(clientsGetClients, getClients);
  yield takeLatest(clientsAddClient, addClient);
  yield takeLatest(clientsEditClient, editClient);
  yield takeLatest(clientsDeleteClient, deleteClient);
}

function* getClients(): any {
  const { token } = yield select(userSelector);
  if (token) {
    yield put(clientsSetLoading(true));
    const [dataRes, dataErr] = yield call(handle, Clients.getClients(token));
    yield put(clientsSetLoading(false));
    if (dataRes) {
      yield put(clientsSetClients(dataRes));
    }
    if (dataErr) {
      console.log(dataErr);
    }
  }
}


function* addClient({ payload }: { payload: Omit<IClient, 'id'> }): any {
  const { token } = yield select(userSelector);
  if (token) {
    yield put(clientsSetLoading(true));
    const [dataRes, dataErr] = yield call(
      handle,
      Clients.addClient(payload, token)
    );
    yield put(clientsSetLoading(false));
    if (dataRes) {
      const {client, not_valid_mails, status} = dataRes
      yield put(clientsAppendClient(client));
      yield put(clientsSetSuccessMessage(status))
      if(not_valid_mails.length > 0) {
        yield put(clientsSetErrorMessage(`Not valid emails: ${not_valid_mails.join(', ')}`))
      }
    }
    if (dataErr) {
      yield put(clientsSetErrorMessage(dataErr.error))
    }
  }
}

function* editClient({ payload }: { payload: IClient }): any {
  const { token } = yield select(userSelector);
  if (token) {
    yield put(clientsSetLoading(true));
    const [dataRes, dataErr] = yield call(
      handle,
      Clients.editClient(payload, token)
    );
    yield put(clientsSetLoading(false));
    if (dataRes) {
      const {client, not_valid_mails, status} = dataRes
      yield put(clientsUpdateClient(client));
      yield put(clientsSetSuccessMessage(status))
      if(not_valid_mails.length > 0) {
        yield put(clientsSetErrorMessage(`Not valid emails: ${not_valid_mails.join(', ')}`))
      }
    }
    if (dataErr) {
      yield put(clientsSetErrorMessage(dataErr.error))
    }
  }
}


function* deleteClient({payload}: {payload: number}): any {
  const { token, is_staff } = yield select(userSelector);
  if (!is_staff) yield put(appSetAlert({success: false, text: 'client_delete_error'}))
  if (token && is_staff) {
    yield put(clientsSetLoading(true));
    const [dataRes, dataErr] = yield call(
      handle,
      Clients.deleteClient(payload, token)
    );
    yield put(clientsSetLoading(false));
    if (!dataErr) {
      yield put(clientsRemoveClient(payload))
    }
    if (dataErr) {
      console.log(dataErr);
    }
  }
}

