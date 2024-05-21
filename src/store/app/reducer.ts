import { createReducer } from "@reduxjs/toolkit";
import { userLogout } from "../user";
import { appClearAlert, appSetAlert, setModal } from "./actions";
import { AlertType, IAppState, ModalType } from "./types";


const initialState: IAppState = {
    modal: null,
    alert: null
}

const app = createReducer(initialState, {
    [setModal.type]: (state, action: {payload: ModalType}) => {
        return {
            ...state,
            modal: action.payload
        }
    },
    [appSetAlert.type]: (state, action: {payload: AlertType}) => {
        return {
            ...state,
            alert: action.payload
        }
    },
    [appClearAlert.type]: (state) => {
        return {
            ...state,
            alert: null
        }
    },
    [userLogout.type]: (state) => {
        return initialState
    }
})

export default app