import { rootReducerType, } from "..";
import {IMultiPost, ISinglePost, FilterClient, IHistoryEmail} from './types'


export const postsEditorPostSelector = (state: rootReducerType): ISinglePost | IMultiPost | null => state.posts.editorPost;
export const postsClientsFilterSelector = (state: rootReducerType): FilterClient | null => state.posts.clientsFilter;
export const postsNewPostsSelector = (state: rootReducerType): ISinglePost[] => state.posts.newPosts;
export const postsPostsSelector = (state: rootReducerType): ISinglePost[] => state.posts.posts;
export const postsIsFetchingSelector = (state: rootReducerType):boolean => state.posts.isFetching;
export const postsIsFetchingHistorySelector = (state: rootReducerType):boolean => state.posts.isFetchingHistory;
export const postsHistoryEmailsSelector = (state: rootReducerType):IHistoryEmail[] => state.posts.historyEmails;
export const postsHistoryFetchedAllSelector = (state: rootReducerType):boolean => state.posts.historyFetchedAll;
export const postsHistorySearchQuerySelector = (state: rootReducerType):string => state.posts.historySearchQuery;
export const postsCurrentDraftSelector = (state: rootReducerType):IHistoryEmail | null => state.posts.currentDraft;
export const postsMailDraftsSelector = (state: rootReducerType):IHistoryEmail[] => state.posts.mailDrafts;








