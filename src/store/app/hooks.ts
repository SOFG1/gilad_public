import { useDispatch, useSelector } from "react-redux";
import { rootReducerType } from "..";
import { appClearAlert, appSetAlert, setModal } from "./actions";
import { ModalType } from "./types";

export const appSelector = (state: rootReducerType) => state.app

export const useAppState = () => useSelector(appSelector)

export const useAppActions = () => {
    const dispatch = useDispatch()

    const onSetModal = (modal: ModalType) => {
        dispatch(setModal(modal))
    }

    const onSetAlert = (success: boolean, text: string) => {
        dispatch(appSetAlert({success, text}))
    }

    const onHideAlert = () => {
        dispatch(appClearAlert())
    }

    return {
        onSetModal,
        onSetAlert,
        onHideAlert
    }
}