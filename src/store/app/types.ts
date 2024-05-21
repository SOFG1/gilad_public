export type ModalType =
  | null
  | "emails-history"
  | "email-editor"
  | "client-editor"
  | "keyword-editor"
  | "add-user"
  | "birthdays-editor"
  | "drafts"
  | "bug_report"


  export type AlertType = {
    success: boolean
    text: string
  }

export interface IAppState {
  modal: ModalType;
  alert: AlertType | null
}
