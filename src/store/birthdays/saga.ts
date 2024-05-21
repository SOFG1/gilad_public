import { call, put, select, takeLatest } from "redux-saga/effects";
import { handle } from "../../api";
import { Birthdays } from "../../api/Birthdays";
import { userSelector } from "../user/hooks";
import {
  birthdaysGetTodayBDays,
  birthdaysSetTodayBDays,
  birthdaysGetAllBDays,
  birthdaysSetAllBDays,
  birthdaysSetIsFetching,
  birthdaysAddBirthday,
  birthdaysSetErrorMes,
  birthdaysAppendBirthday,
  birthdaysDeleteBirthday,
  birthdaysRemoveBirthday,
  birthdaysEditBirthday,
  birthdaysUpdateBirthday,
} from "./actions";
import { IAddBirthday } from "./types";

export function* birthdaysWatcher() {
  yield takeLatest(birthdaysGetAllBDays, getAllBirthdays);
  yield takeLatest(birthdaysGetTodayBDays, getTodayBirthdays);
  yield takeLatest(birthdaysAddBirthday, addBirthday);
  yield takeLatest(birthdaysDeleteBirthday, deleteBirthday);
  yield takeLatest(birthdaysEditBirthday, editBirthday);
}

function* getTodayBirthdays(): any {
  const { token } = yield select(userSelector);
  if (token) {
    yield put(birthdaysSetIsFetching(true));
    const [dataRes, dataErr] = yield call(
      handle,
      Birthdays.getTodayBirthdays(token)
    );
    yield put(birthdaysSetIsFetching(false));
    if (dataRes) {
      yield put(birthdaysSetTodayBDays(dataRes));
    }
    if (dataErr) {
      console.log(dataErr);
    }
  }
}

function* getAllBirthdays(): any {
  const { token } = yield select(userSelector);
  if (token) {
    yield put(birthdaysSetIsFetching(true));
    const [dataRes, dataErr] = yield call(
      handle,
      Birthdays.getAllBirthdays(token)
    );
    yield put(birthdaysSetIsFetching(false));
    if (dataRes) {
      yield put(birthdaysSetAllBDays(dataRes));
    }
    if (dataErr) {
      console.log(dataErr);
    }
  }
}

function* addBirthday({ payload }: { payload: IAddBirthday }): any {
  const { token } = yield select(userSelector);
  if (token) {
    yield put(birthdaysSetIsFetching(true));
    const [dataRes, dataErr] = yield call(
      handle,
      Birthdays.addBirthday(token, payload)
    );
    yield put(birthdaysSetIsFetching(false));
    if (dataRes) {
      yield put(birthdaysAppendBirthday(dataRes));
      yield call(getTodayBirthdays);
    }
    if (dataErr) {
      yield put(birthdaysSetErrorMes(dataErr.error));
    }
  }
}

function* deleteBirthday({ payload }: { payload: number }): any {
  const { token } = yield select(userSelector);
  if (token) {
    yield put(birthdaysSetIsFetching(true));
    const [dataRes, dataErr] = yield call(
      handle,
      Birthdays.deleteBirthday(token, payload)
    );
    yield put(birthdaysSetIsFetching(false));
    if (!dataErr) {
      yield put(birthdaysRemoveBirthday(payload));
      yield call(getTodayBirthdays);
    }
    if (dataErr) console.log(dataErr);
  }
}

function* editBirthday({
  payload,
}: {
  payload: { id: number; params: IAddBirthday };
}): any {
  const { token } = yield select(userSelector);
  if (token) {
    const [dataRes, dataErr] = yield call(
      handle,
      Birthdays.editBirthday(token, payload.id, payload.params)
    );
    if (dataRes) {
      yield put(birthdaysUpdateBirthday(dataRes))
      yield call(getTodayBirthdays)
    }
    if (dataErr) {
      console.log(dataErr);
    }
  }
}
