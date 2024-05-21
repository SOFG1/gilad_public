import { createReducer } from "@reduxjs/toolkit";
import { userLogout } from "../user";
import {
  postsSetEditor,
  postsUpdateNewPost,
  postsSetIsFetching,
  postsSetClientsFilter,
  postsAddHistory,
  postsSetHistoryFetching,
  postsSetHistoryFetchedAll,
  postsClearHistory,
  postsAddPosts,
  postsClearPosts,
  postsUpdateNewPosts,
  postsMarkAsViewed,
  postsRemovePost,
  postsSetCurrentDraft,
  postsSetDrafts,
  postsRemoveDrafts,
  postsAddSparePosts,
  postsHistorySetSearchQuery,
  postsSetHistory,
  postsRemoveKeyword,
  postsAddWsPost,
  postsMarkAsSent,
} from "./actions";
import {
  IPostsState,
  ISinglePost,
  FilterClient,
  IHistoryEmail,
  node,
  IDeletePost,
  IDeletePostKeyword,
  IMultiPost,
  MarkAsSentPayload,
} from "./types";
import { markPostsAsSent } from "../../utilites/markPostsAsSent";

const initialState: IPostsState = {
  editorPost: null,
  clientsFilter: null,
  newPosts: [],
  isFetching: false,
  posts: [],
  isFetchingHistory: false,
  historyEmails: [],
  historyFetchedAll: false,
  historySearchQuery: "",
  currentDraft: null,
  mailDrafts: [],
};

const posts = createReducer(initialState, {
  [postsSetEditor.type]: (state, action: { payload: ISinglePost | IMultiPost }) => {
    return {
      ...state,
      editorPost: action.payload,
    };
  },
  [postsSetClientsFilter.type]: (state, action: { payload: FilterClient }) => {
    return {
      ...state,
      clientsFilter: action.payload,
    };
  },
  [postsAddPosts.type]: (state, action: { payload: ISinglePost[] }) => {
    return {
      ...state,
      posts: [...state.posts, ...action.payload],
    };
  },
  [postsAddSparePosts.type]: (state, action: { payload: ISinglePost[] }) => {
    const filtered = action.payload.filter((newPost) => {
      return state.posts.every((oldPost) => oldPost?.title !== newPost?.title);
    });
    return {
      ...state,
      posts: [...state.posts, ...action.payload],
    };
  },
  [postsClearPosts.type]: (state) => {
    return {
      ...state,
      posts: [],
      newPosts: [],
    };
  },
  [postsAddWsPost.type]: (state, { payload }: { payload: ISinglePost }) => {
    const copy = [...state.posts]
    const alreadyExists = copy.find(p => p._sender === payload._sender && p.id === payload.id)
    if (!alreadyExists) {
      copy.unshift(payload)
    }
    return {
      ...state,
      posts: copy,
      newPosts: [],
    };
  },
  [postsUpdateNewPost.type]: (state, { payload }: { payload: ISinglePost }) => {
    const inPostsList = state.posts.find(p => p.id === payload.id && p._sender === payload._sender)
    //Update in all posts if exists
    const newAllPosts = state.posts.filter(p => {
      return p.id !== payload.id && p._sender !== payload._sender
    })
    if (inPostsList) {
      newAllPosts.unshift(payload)
    }
    //Add to newPostsList
    const inNewPosts = state.newPosts.find(p => p.id === payload.id && p._sender === payload._sender)
    const newPosts = state.newPosts.filter((p) => {
      return p.id !== payload.id && p._sender !== payload._sender
    })
    if (!inNewPosts && !inPostsList) {
      newPosts.push(payload)
    }
    console.log("inPostsList", inPostsList)
    console.log("inNewPosts", inNewPosts)

    //Return
    return {
      ...state,
      newPosts,
      posts: newAllPosts,
    };
  },
  [postsUpdateNewPosts.type]: (state) => {
    return {
      ...state,
      posts: [...state.posts, ...state.newPosts],
      newPosts: [],
    };
  },
  [postsSetIsFetching.type]: (state, action: { payload: boolean }) => {
    return {
      ...state,
      isFetching: action.payload,
    };
  },
  [postsAddHistory.type]: (state, action: { payload: IHistoryEmail[] }) => {
    return {
      ...state,
      historyEmails: [...state.historyEmails, ...action.payload],
    };
  },
  [postsSetHistory.type]: (state, action: { payload: IHistoryEmail[] }) => {
    return {
      ...state,
      historyEmails: action.payload,
    };
  },
  [postsSetHistoryFetching.type]: (state, action: { payload: boolean }) => {
    return {
      ...state,
      isFetchingHistory: action.payload,
    };
  },
  [postsSetHistoryFetchedAll.type]: (state, action: { payload: boolean }) => {
    return {
      ...state,
      historyFetchedAll: action.payload,
    };
  },
  [postsHistorySetSearchQuery.type]: (state, action: { payload: string }) => {
    const copy = { ...state };
    copy.historySearchQuery = action.payload;
    copy.historyFetchedAll = false;
    if (action.payload === "") copy.historyEmails = [];
    return copy;
  },
  [postsClearHistory.type]: (state) => {
    return {
      ...state,
      historyEmails: [],
      historyFetchedAll: false,
      isFetchingHistory: false,
    };
  },

  [postsMarkAsViewed.type]: (
    state,
    { payload }: { payload: { sender: node; id: number } }
  ) => {
    const copy: ISinglePost[] = [...state.posts];
    const postIndex = copy.findIndex(
      (post) => post._sender === payload.sender && post.id === payload.id
    );
    if (postIndex) copy[postIndex] = { ...copy[postIndex], _viewed: true };
    return {
      ...state,
      posts: copy,
    };
  },
  [postsRemovePost.type]: (state, { payload }: { payload: IDeletePost }) => {
    const filteredPosts = state.posts.filter(
      (post) => post._sender !== payload.node || post.id !== payload.postId
    );
    return {
      ...state,
      posts: filteredPosts,
    };
  },
  [postsRemoveKeyword.type]: (state, { payload }: { payload: IDeletePostKeyword }) => {
    const postsCopy = [...state.posts]
    const postIndex = state.posts.findIndex(p => p._sender === payload.sender && p.id === payload.postId)
    const post = state.posts.find(p => p._sender === payload.sender && p.id === payload.postId)
    const keywordsFiltered = post?.keywords.filter((k: any) => k.id !== payload.keywordId)
    const postModified = { ...post, keywords: keywordsFiltered }
    postsCopy.splice(postIndex, 1, postModified as ISinglePost)

    return {
      ...state,
      posts: postsCopy
    };
  },
  [postsSetCurrentDraft.type]: (
    state,
    { payload }: { payload: IHistoryEmail | null }
  ) => {
    return {
      ...state,
      currentDraft: payload,
    };
  },
  [postsSetDrafts.type]: (state, { payload }: { payload: IHistoryEmail[] }) => {
    return {
      ...state,
      mailDrafts: payload,
    };
  },
  [postsRemoveDrafts.type]: (state, { payload }: { payload: number }) => {
    const filtered = state.mailDrafts.filter((d) => d.id !== payload);
    return {
      ...state,
      mailDrafts: filtered,
    };
  },
  [postsMarkAsSent.type]: (state, { payload }: { payload: MarkAsSentPayload }) => {
    const newPosts = markPostsAsSent(state.newPosts, payload)//Update "sended" in newPosts
    const posts = markPostsAsSent(state.posts, payload) //Update "sended" in posts
    let editorPost = state.editorPost
    const isMultiPost = !!editorPost?.posts
    if(isMultiPost) { //If multipost update sended in multipost
      editorPost = {
        ...editorPost,
        posts: markPostsAsSent(editorPost?.posts || [], payload)
      } as IMultiPost
    }
    if(!isMultiPost) { //If single post update sended in singlepost
      if(payload[(editorPost as ISinglePost)._sender]?.includes((editorPost as ISinglePost).id)) {
        editorPost = {
          ...editorPost,
          sended: true,
        } as ISinglePost
      }
    }
    return {
      ...state,
      newPosts,
      posts,
      editorPost
    };
  },
  [userLogout.type]: (state) => {
    return initialState;
  },
});

export default posts;
