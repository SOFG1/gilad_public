import { createAction } from "@reduxjs/toolkit";
import { ModalType } from "./types";

export const setModal = createAction<ModalType>('app/setIsModalOpen')

export const appSetAlert = createAction<{success: boolean, text: string}>('app/setAlert')
export const appClearAlert = createAction('app/clearAlert')
