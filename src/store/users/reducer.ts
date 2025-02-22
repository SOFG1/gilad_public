import { createReducer } from "@reduxjs/toolkit";
import { userLogout } from "../user/actions";
import {
  usersSetIsFetching,
  usersSetUsers,
  usersAppendUser,
  usersDetachUser,
  usersSelectUser,
  usersUpdateUser
} from "./actions";
import { IEditUser, IUser, IUsersState } from "./types";

const initialState: IUsersState = {
  users: [],
  selectedUserId: null,
  isFetching: false,
};

const users = createReducer(initialState, {
  [usersSetIsFetching.type]: (state, action: { payload: boolean }) => {
    return {
      ...state,
      isFetching: action.payload,
    };
  },
  [usersSetUsers.type]: (state, action: { payload: IUser[] }) => {
    return {
      ...state,
      users: action.payload,
    };
  },
  [usersAppendUser.type]: (state, action: { payload: IUser }) => {
    return {
      ...state,
      users: [...state.users, action.payload],
    };
  },
  [usersDetachUser.type]: (state, action: { payload: number }) => {
    const withoutRemoved = state.users.filter(u => u.id !== action.payload)
    return {
      ...state,
      users: withoutRemoved,
      selectedUserId: state.selectedUserId === action.payload ? null : state.selectedUserId
    };
  },
  [usersSelectUser.type]: (state, action: { payload: number | null }) => {
    return {
      ...state,
      selectedUserId: action.payload
    };
  },
  [usersUpdateUser.type]: (state, action: { payload: IUser }) => {
    let newUsers = [...state.users]
    const index = newUsers.findIndex(u => u.id === action.payload.id)
    newUsers.splice(index, 1, action.payload)
    return {
      ...state,
      users: newUsers
    };
  },
  [userLogout.type]: (state) => {
    return initialState
}
});

export default users;
