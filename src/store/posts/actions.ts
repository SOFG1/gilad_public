import { createAction } from "@reduxjs/toolkit";
import { IEmail, ISinglePost, IDeletePost, node, FilterClient, FilterPosts, IHistoryEmail, IDeletePostKeyword, IMultiPost, MarkAsSentPayload } from "./types";

//Editor
export const postsSetEditor = createAction<ISinglePost | IMultiPost | null>('posts/setEditor')

//Clients FIlter
export const postsSetClientsFilter = createAction<FilterClient | null>('posts/clientsFilter')

//Posts Filter 
export const postsSetFilter = createAction<FilterPosts>('posts/filterPosts')

//Fetch All Posts
export const postsGetAllPosts = createAction('posts/getAllPosts')

// Posts
export const postsAddPosts = createAction<ISinglePost[]>('posts/addPosts')
export const postsClearPosts = createAction('posts/clearPosts')
export const postsAddSparePosts = createAction<ISinglePost[]>('posts/addSparePosts')
export const postsAddWsPost = createAction<ISinglePost>('posts/addWsPost')
export const postsMarkAsSent = createAction<MarkAsSentPayload>('posts/markAsSent')



//Send modified
export const postsSendEmail = createAction<IEmail>('posts/sendEmail')

//Delete post
export const postsPostDelete = createAction<IDeletePost>("posts/deleteActions")
export const postsRemovePost = createAction<IDeletePost>('posts/removePost')

//Delete post keyword
export const postsDeleteKeyword = createAction<IDeletePostKeyword>('posts/deleteKeyword')
export const postsRemoveKeyword = createAction<IDeletePostKeyword>('posts/removeKeyword')



//add new posts from websocket
export const postsUpdateNewPost = createAction<ISinglePost>("posts/updateNewPost")
export const postsUpdateNewPosts = createAction('posts/updateNewPosts')
export const postsMarkAsViewed = createAction<{sender: node, id: number}>('posts/markAsViewed')

//Set is fetching
export const postsSetIsFetching = createAction<boolean>("posts/setIsFetching")


//History
export const postsGetHistory = createAction('posts/getHistory');
export const postsAddHistory = createAction<IHistoryEmail[]>('posts/addHistory');
export const postsSetHistory = createAction<IHistoryEmail[]>('posts/setHistory')
export const postsSetHistoryFetching = createAction<boolean>('posts/setHistoryFetching');
export const postsSetHistoryFetchedAll = createAction<boolean>('posts/setHistoryFetchedAll')
export const postsClearHistory = createAction('posts/clearHistory')
export const postsHistorySetSearchQuery = createAction<string>('posts/historySetSearchQuery')

//Draft
export const postsGetDrafts = createAction('posts/getDrafts')
export const postsSetDrafts = createAction<IHistoryEmail[]>('posts/setDrafts')
export const postsSaveDraft = createAction<IEmail>('posts/saveDraft')
export const postsSetCurrentDraft = createAction<IHistoryEmail | null>('posts/setCurrentDraft')
export const postsDeleteDraft = createAction<number>('posts/deleteDraft')
export const postsRemoveDrafts = createAction<number>('posts/removeDraft')