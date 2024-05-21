import { IClient, IPostCardClient } from "../clients";

export interface IEmail {
  subject: string;
  html: string;
  recipients_ids: Array<string | number>;
  attachments?: number[];
  items: {
    [key in  node]: number[];
  };
  draft_id?: number;
}

export interface IDeletePost {
  node: node;
  postId: number;
}

export interface IDeletePostKeyword {
  sender: node;
  postId: number;
  keywordId: number;
}

export type node =
  | "news"
  | "govil"
  | "agendas"
  | "google_news"
  | "committee_session"
  | "plenum_session"
  | "person_to_position"
  | "query"
  | "bill"
  | "press_release"
  | "gov_statisctics"
  | "govil_data"
  | "govil_pdf"
  | "antique"
  | "antique_trends"
  | "news_11"
  | "news_with_login"
  | "iplan"
  | "mavat"
  | "kns_parser_commity_t"
  | "kns_parser_fr_commity_sessions"
  | "kns_parser_fr_news"
  | "kns_parser_fr_commity_protocols"
  | "kns_parser_fr_commity_conclutions"
  | "kns_parser_kns_app_query"
  | "kns_parser_kns_app_agenda"
  | "kns_parser_kns_plenumal"
  | "kns_parser_kns_plenum_weekly_agenda"
  | "dynamic_collector_first"
  | "dynamic_collector_second"
  | "dynamic_collector_third"
  | "isa"
  | "sg_presidium"
  | "boi"
  | "cs_documents"



export type PostFileType = { date: string, file: string }


export interface ISinglePost {
  id: number
  title?: string
  title_sufix?: string
  sended: boolean
  files: {
    [key: string]: PostFileType[]
  }
  cmt_session_items?: {id: number, last_updated_date: string, name: string}[]
  _sender: node;
  _viewed?: boolean;
  [key: string]: any | null;
}

export interface IMultiPost {
  title: string
  clients: IPostCardClient[]
  last_updated_date: string
  lastUpdatedInWeeks: number, //last_updated_date in weeks
  posts: ISinglePost[]
  date_for_sorting: number,
  _type: 'multipost'
}

export type FilterClient = { id: number; client: string };

export type FilterPosts = {
  free_search: string | null;
  tag: string | null;
  cat: string | null;
};

export interface IHistoryAttachment {
  file: string;
  file_name: string;
  id: number;
  uri: string;
}
export interface IHistoryEmail {
  id: number;
  subject: string;
  datetime?: string;
  user_name?: string;
  items?: { [key: string]: number[] };
  text: string;
  clients: IClient[];
  attachments: IHistoryAttachment[];
}

export type MarkAsSentPayload = {
  [key in node]: number[] 
}

export interface IPostsState {
  editorPost: ISinglePost | IMultiPost | null;
  clientsFilter: FilterClient | null;
  posts: ISinglePost[];
  newPosts: ISinglePost[];
  isFetching: boolean;
  isFetchingHistory: boolean;
  historyEmails: IHistoryEmail[];
  historySearchQuery: string;
  historyFetchedAll: boolean;
  currentDraft: IHistoryEmail | null;
  mailDrafts: IHistoryEmail[];
}
