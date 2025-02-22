import { call, put, select, takeLatest } from "redux-saga/effects";
import { handle } from "../../api";
import { Keywords } from "../../api/Keywords";
import { clientsGetClients } from "../clients";
import { userSelector } from "../user/hooks";
import {
  keywordsGetKeywords,
  keywordsSetKeywords,
  keywordsSetLoading,
  keywordsAddKeyword,
  keywordsAppendKeyword,
  keywordsSelectKeyword,
  keywordsSetSelected,
  keywordsEditKeyword,
  keywordsUpdateKeyword,
  keywordsDeleteKeyword,
  keywordsRemoveKeyword,
  keywordsSetErrorMessage,
} from "./actions";
import { IAddKeyword, IEditKeyword, IKeyword, ISelectedKeyword } from "./types";

export function* keywordsWatcher() {
  yield takeLatest(keywordsGetKeywords, getKeywords);
  yield takeLatest(keywordsAddKeyword, addKeyword);
  yield takeLatest(keywordsSelectKeyword, selectKeyword);
  yield takeLatest(keywordsEditKeyword, editKeyword);
  yield takeLatest(keywordsDeleteKeyword, deleteKeyword);
}

function* getKeywords(): any {
  const { token } = yield select(userSelector);
  if (token) {
    yield put(keywordsSetLoading(true));
    const [dataRes, dataErr] = yield call(handle, Keywords.getKeywords(token));
    yield put(keywordsSetLoading(false));
    if (dataRes) {
      yield put(keywordsSetKeywords(dataRes));
    }
    if (dataErr) {
      console.log(dataErr);
    }
  }
}

function* addKeyword({ payload }: { type: string; payload: IAddKeyword }): any {
  const { token } = yield select(userSelector);
  if (token) {
    yield put(keywordsSetLoading(true));
    const [dataRes, dataErr] = yield call(
      handle,
      Keywords.addKeyword(payload, token)
    );
    yield put(keywordsSetLoading(false));
    if (dataRes) {
      const { id, keyword }: IKeyword = dataRes;
      yield put(keywordsAppendKeyword({ id, keyword }));
      //Update clients with changed keywords
      yield put(clientsGetClients());
    }
    if (dataErr) {
      console.log(dataErr);
      yield put(keywordsSetErrorMessage(dataErr.error))
    }
  }
}

function* selectKeyword({ payload }: { type: string; payload: number }): any {
  const { token } = yield select(userSelector);
  if (token) {
    yield put(keywordsSetLoading(true));
    const [dataRes, dataErr]: [ISelectedKeyword | undefined, any] = yield call(
      handle,
      Keywords.getKeyword(payload, token)
    );
    yield put(keywordsSetLoading(false));
    if (dataRes) {
      yield put(keywordsSetSelected(dataRes));
    }
    if (dataErr) {
      console.log(dataErr);
    }
  }
}

function* editKeyword({ payload }: { type: string; payload: IEditKeyword }) {
  const { token } = yield select(userSelector);
  if (token) {
    yield put(keywordsSetLoading(true));
    const [dataRes, dataErr]: [ISelectedKeyword | undefined, any] = yield call(
      handle,
      Keywords.editKeyword(payload, token)
    );
    yield put(keywordsSetLoading(false));
    if (dataRes) {
      yield put(keywordsUpdateKeyword(dataRes));
      //Update clients with changed keywords
      yield put(clientsGetClients());
    }
    if (dataErr) {
      yield put(keywordsSetErrorMessage(dataErr.error))
    }
  }
}

function* deleteKeyword({ payload }: { payload: number }) {
  const { token } = yield select(userSelector);
  if (token) {
    yield put(keywordsSetLoading(true));
    const [dataRes, dataErr]: [ISelectedKeyword | undefined, any] = yield call(
      handle,
      Keywords.deleteKeyword(payload, token)
    );
    yield put(keywordsSetLoading(false));
    if (!dataErr) {
      yield put(keywordsRemoveKeyword(payload));
      //Update clients with changed keywords
      yield put(clientsGetClients());
    }
    if (dataErr) {
      console.log(dataErr);
    }
  }
}
