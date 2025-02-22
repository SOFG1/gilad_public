import { createReducer } from "@reduxjs/toolkit";
import { IKeyword, IKeywordsState, ISelectedKeyword } from "./types";
import {
  keywordsSetKeywords,
  keywordsSetLoading,
  keywordsAppendKeyword,
  keywordsSetSelected,
  keywordsUpdateKeyword,
  keywordsRemoveKeyword,
  keywordsSetErrorMessage
} from "./actions";
import { userLogout } from "../user";

const initialState: IKeywordsState = {
  keywords: [],
  isLoading: false,
  selectedKeyword: null,
  errorMessage: null
};

const keywords = createReducer(initialState, {
  [keywordsSetKeywords.type]: (state, action: { payload: IKeyword[] }) => {
    return {
      ...state,
      keywords: action.payload,
    };
  },
  [keywordsSetLoading.type]: (state, action: { payload: boolean }) => {
    return {
      ...state,
      isLoading: action.payload,
    };
  },
  [keywordsAppendKeyword.type]: (state, action: { payload: IKeyword }) => {
    return {
      ...state,
      keywords: [...state.keywords, action.payload],
    };
  },
  [keywordsSetSelected.type]: (state, action: { payload: ISelectedKeyword }) => {
    return {
      ...state,
      selectedKeyword: action.payload
    };
  },
  [keywordsUpdateKeyword.type]: (state, action: { payload: ISelectedKeyword }) => {
    // case when updateable keyword is not the selected keyword
    if (action.payload.id !== state.selectedKeyword?.id) {
      let newKeywords = [...state.keywords]
      const index = newKeywords.findIndex(k => k.id === action.payload.id)
      newKeywords.splice(index, 1, action.payload)
      return {
        ...state,
        keywords: newKeywords
      }
    }
    // Cases when we update selected keyword
    if (action.payload.id === state.selectedKeyword?.id) {
      let newKeywords = [...state.keywords]
      const index = newKeywords.findIndex(k => k.id === action.payload.id)
      newKeywords.splice(index, 1, action.payload)
      return {
        ...state,
        selectedKeyword: action.payload,
        keywords: newKeywords
      }
    }
  },
  [keywordsRemoveKeyword.type]: (state, action: { payload: number }) => {
    const withoutRemoved = state.keywords.filter(k => k.id !== action.payload)
    return {
      ...state,
      keywords: withoutRemoved
    };
  },
  [keywordsSetErrorMessage.type]: (state, action: { payload: string | null }) => {
    return {
      ...state,
      errorMessage: action.payload
    };
  },
  [userLogout.type]: (state) => {
    return initialState
}
});

export default keywords;
