import { createAction } from "@reduxjs/toolkit";
import { IAddKeyword, IEditKeyword, IKeyword, ISelectedKeyword } from "./types";

export const keywordsGetKeywords = createAction('keywords/getKeywords')
export const keywordsSetKeywords = createAction<IKeyword[]>('keywords/setKeywords')

export const keywordsSetLoading = createAction<boolean>('keywords/setLoading')

export const keywordsAddKeyword = createAction<IAddKeyword>('keywords/addKeyword')

export const keywordsAppendKeyword = createAction<IKeyword>('keywords/appendKeyword')

export const keywordsSelectKeyword = createAction<number>('keywords/selectKeyword')

export const keywordsSetSelected = createAction<ISelectedKeyword | null>('keywords/setSelected')

export const keywordsEditKeyword = createAction<IEditKeyword>('keywords/editKeyword')

export const keywordsUpdateKeyword = createAction<ISelectedKeyword>('keywords/updateKeyword')

export const keywordsDeleteKeyword = createAction<number>('keywords/deleteKeyword')
export const keywordsRemoveKeyword = createAction<number>('keywords/removeKeyword')

export const keywordsSetErrorMessage = createAction<string | null>('keywords/setErrorMessage')