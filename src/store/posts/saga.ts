import {
  call,
  all,
  put,
  select,
  takeLatest,
  takeLeading,
  takeEvery,
  throttle,
} from "redux-saga/effects";
import { handle } from "../../api";
import { Posts } from "../../api/Posts";
import { userSelector } from "../user/hooks";
import {
  postsSendEmail,
  postsPostDelete,
  postsGetAllPosts,
  postsSetIsFetching,
  postsSetFilter,
  postsGetHistory,
  postsAddHistory,
  postsSetHistoryFetching,
  postsSetHistoryFetchedAll,
  postsAddPosts,
  postsClearPosts,
  postsMarkAsViewed,
  postsRemovePost,
  postsSaveDraft,
  postsSetCurrentDraft,
  postsGetDrafts,
  postsSetDrafts,
  postsDeleteDraft,
  postsRemoveDrafts,
  postsAddSparePosts,
  postsSetHistory,
  postsDeleteKeyword,
  postsRemoveKeyword,
  postsMarkAsSent,
} from "./actions";

import {
  IEmail,
  ISinglePost,
  IDeletePost,
  node,
  FilterPosts,
  IHistoryEmail,
  IDeletePostKeyword,
} from "./types";
import { Filters } from "../../api/Filters";
import { userSetInfo } from "../user";
import { appSetAlert, setModal } from "../app";
import { mainNodes, spareNodes } from "./constants";
import { useSelector } from "react-redux";
import {
  postsCurrentDraftSelector,
  postsHistoryEmailsSelector,
  postsHistoryFetchedAllSelector,
  postsHistorySearchQuerySelector,
  postsIsFetchingHistorySelector,
} from "./selectors";
import { personToPositionTitle } from "../../utilites/personToPositionTitle";
import { commiteeSessionValidator } from "../../utilites/commiteeSessionValidator";

export function* postsWatcher() {
  yield takeLeading(postsGetAllPosts, getAllPosts);
  yield takeLatest(postsSetFilter, setFilter);
  yield takeLeading(postsSendEmail, sendEmail);
  yield takeLeading(postsPostDelete, deletePost);
  yield throttle(1000, postsGetHistory, getHistory);
  yield takeEvery(postsMarkAsViewed, markAsViewed);
  yield takeEvery(postsSaveDraft, saveDraft);
  yield takeLatest(postsGetDrafts, getDrafts);
  yield takeLatest(postsDeleteDraft, deleteDraft);
  yield takeLeading(postsDeleteKeyword, deletePostKeyword);
}

function* getAllPosts(): any {
  yield put(postsSetIsFetching(true));
  yield put(postsClearPosts());
  yield all(
    mainNodes.map((source: node) => {
      return call(getPosts, source);
    })
  );
  yield all(
    spareNodes.map((source: node) => {
      return call(getSparePosts, source);
    })
  );
  yield put(postsSetIsFetching(false));
}

function* getPosts(node: node): any {
  const { token } = yield select(userSelector);
  if (token) {
    const [dataRes, dataErr]: [undefined | ISinglePost[], any] = yield call(
      handle,
      Posts.getPosts(token, node)
    );
    if (dataRes) {
      let posts = dataRes.map((post) => ({ ...post, _sender: node }))
      //Custom titles for "press_release" source
      if(node === "press_release") {
        posts = posts.map(p => ({...p, title: `חדשות הכנסת- ${p.title}`}))
      }  
      //Custom titles for "person_to_position" source
      if(node === "person_to_position") {
        posts = posts.map(p => personToPositionTitle(p))
      }
      if(node === "committee_session") {
        posts = posts.filter(commiteeSessionValidator)
      }
      yield put(
        postsAddPosts(posts)
      );
    }
    if (dataErr) {
      console.log(dataErr);
    }
  }
}

//This function is different from 'getPosts' because this dispatches 'postsAddSparePosts'
function* getSparePosts(node: node): any {
  const { token } = yield select(userSelector);
  if (token) {
    const [dataRes, dataErr]: [undefined | ISinglePost[], any] = yield call(
      handle,
      Posts.getPosts(token, node)
    );
    if (dataRes) {
      let posts = dataRes.map((post) => ({ ...post, _sender: node }))
      yield put(
        postsAddSparePosts(posts)
      );
    }
    if (dataErr) {
      console.log(dataErr);
    }
  }
}

function* setFilter({ payload }: { payload: FilterPosts }): any {
  const { token } = yield select(userSelector);
  if (token) {
    yield put(postsClearPosts());
    const [dataRes, dataErr] = yield call(
      handle,
      Filters.setFilters(payload, token)
    );
    if (dataRes) {
      yield put(userSetInfo(dataRes));
      yield call(getAllPosts);
    }
    if (dataErr) {
      console.log(dataErr);
    }
  }
}

function* sendEmail({ payload }: { payload: IEmail }) {
  const { token } = yield select(userSelector);
  if (token) {
    yield put(postsSetIsFetching(true));
    const [dataRes, dataErr]: [any, any] = yield call(
      handle,
      Posts.sendEmail(payload, token)
    );
    yield put(postsSetIsFetching(false));
    if (!dataErr) {
      yield put(setModal(null))
      yield put(appSetAlert({ success: true, text: "emails_send-success" }));
      yield put(postsSetCurrentDraft(null));
      yield put(postsMarkAsSent(payload.items))
    }
    if (dataErr) {
      console.log(dataErr);
      yield put(appSetAlert({ success: false, text: dataErr.error }));
    }
  }
}

function* deletePost({ payload }: { payload: IDeletePost }) {
  const { token } = yield select(userSelector);
  if (token) {
    const [dataRes, dataErr]: [any, any] = yield call(
      handle,
      Posts.deletePost(payload, token)
    );
    if (!dataErr) {
      yield put(postsRemovePost(payload));
    }
    if (dataErr) {
      console.log(dataErr);
    }
  }
}

function* deletePostKeyword({ payload }: { payload: IDeletePostKeyword }): any {
  const { token } = yield select(userSelector);
  const [dataRes, dataErr] = yield call(
    handle,
    Posts.deletePostKeyword(token, payload)
  );
  if (!dataErr) {
    yield put(postsRemoveKeyword(payload));
  }
  if (dataErr) {
    console.log(dataErr);
  }
}

function* getHistory(): any {
  const { token } = yield select(userSelector);
  const historyEmails = yield select(postsHistoryEmailsSelector);
  const historyFetchedAll = yield select(postsHistoryFetchedAllSelector);
  const isFetchingHistory = yield select(postsIsFetchingHistorySelector);
  const historySearchQuery = yield select(postsHistorySearchQuerySelector);
  if (
    token &&
    !historyFetchedAll &&
    !isFetchingHistory &&
    !historySearchQuery
  ) {
    const offset = Math.floor(historyEmails.length / 10) * 10;
    yield put(postsSetHistoryFetching(true));
    const [dataRes, dataErr]: [IHistoryEmail[], any] = yield call(
      handle,
      Posts.getHistory(offset, token)
    );
    yield put(postsSetHistoryFetching(false));
    if (dataRes) {
      if (dataRes.length < 10) yield put(postsSetHistoryFetchedAll(true));
      yield put(postsAddHistory(dataRes));
    }
    if (dataErr) {
      console.log(dataErr);
    }
  }

  if (token && historySearchQuery) {
    yield put(postsSetHistoryFetching(true));
    const [dataRes, dataErr]: [IHistoryEmail[], any] = yield call(
      handle,
      Posts.searchHistory(token, historySearchQuery)
    );
    yield put(postsSetHistoryFetching(false));
    if (dataRes) {
      yield put(postsSetHistory(dataRes));
    }
    if (dataErr) {
      console.log(dataErr);
    }
  }
}

function* markAsViewed({
  payload,
}: {
  payload: { sender: node; id: number };
}): any {
  const { token } = yield select(userSelector);
  if (token) {
    const [dataRes, dataErr] = yield call(
      handle,
      Posts.markAsViewed(token, payload.sender, payload.id)
    );
    if (dataRes) console.log(dataRes);
    if (dataErr) console.log(dataErr);
  }
}

function* saveDraft({ payload }: { payload: IEmail }): any {
  const { token } = yield select(userSelector);
  const currentDraft = yield select(postsCurrentDraftSelector)
  //create new draft
  if (token && !currentDraft) {
    yield put(postsSetIsFetching(true));
    const [dataRes, dataErr] = yield call(
      handle,
      Posts.createDraft(payload, token)
    );
    yield put(postsSetIsFetching(false));
    if (dataRes) {
      yield put(postsSetCurrentDraft(dataRes));
      yield put(appSetAlert({ success: true, text: "drafts_save-success" }));
    }
    if (dataErr) {
      yield put(appSetAlert({ success: false, text: dataErr.error }));
    }
  }
  //edit existing
  if (token && currentDraft) {
    yield put(postsSetIsFetching(true));
    const [dataRes, dataErr] = yield call(
      handle,
      Posts.editDraft(payload, currentDraft.id, token)
    );
    yield put(postsSetIsFetching(false));
    if (dataRes) {
      yield put(postsSetCurrentDraft(dataRes));
      yield put(appSetAlert({ success: true, text: "drafts_save-success" }));
    }
    if (dataErr) {
      yield put(appSetAlert({ success: false, text: dataErr.error }));
    }
  }
}

function* getDrafts(): any {
  const { token } = yield select(userSelector);
  if (token) {
    yield put(postsSetIsFetching(true));
    const [dataRes, dataErr] = yield call(handle, Posts.getDrafts(token));
    yield put(postsSetIsFetching(false));
    if (dataRes) {
      yield put(postsSetDrafts(dataRes));
    }
    if (dataErr) {
      console.log(dataErr);
    }
  }
}

function* deleteDraft({ payload }: { payload: number }): any {
  const { token } = yield select(userSelector);
  if (token) {
    const [dataRes, dataErr] = yield call(
      handle,
      Posts.deleteDraft(token, payload)
    );
    if (!dataErr) {
      yield put(postsRemoveDrafts(payload));
    }
    if (dataErr) {
      console.log(dataErr);
    }
  }
}
