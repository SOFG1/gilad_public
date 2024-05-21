import { axiosInstance } from ".";
import { IEmail, IDeletePost, node, IDeletePostKeyword } from "../store/posts";

export const Posts = {
  getPosts: async (token: string, node: node) => {
    return await axiosInstance.get(`gilad/${node}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  sendEmail: async (params: any, token: string) => {
    return await axiosInstance.post("send_email/", params, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  sendAttachment: async (data: FormData, token: string) => {
    return await axiosInstance.post("email_attachments/", data, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  deleteAttachment: async (fileId: number, token: string) => {
    return await axiosInstance.delete(`email_attachments/${fileId}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  deletePost: async (payload: IDeletePost, token: string) => {
    return await axiosInstance.delete(
      `gilad/${payload.node}/${payload.postId}/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
  },
  deletePostKeyword: async (token: string, payload: IDeletePostKeyword) => {
    return await axiosInstance.delete(
      `post_keywords/${payload.sender}/${payload.postId}/`,
      {
        data: { keyword_id: payload.keywordId },
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
  },
  getHistory: async (payload: number, token: string) => {
    return await axiosInstance.get(`email_history/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: {
        offset: payload,
      },
    });
  },
  searchHistory: async (token: string, keyword: string) => {
    return await axiosInstance.get(`email_history_search/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: {
        keyword,
      },
    });
  },
  markAsViewed: async (token: string, sender: node, id: number) => {
    return await axiosInstance.put(
      `gilad/${sender}/${id}/`,
      {},
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
  },
  createDraft: async (draft: IEmail, token: string) => {
    return await axiosInstance.post("mail_draft/", draft, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  editDraft: async (draft: IEmail, draftId: number, token: string) => {
    return await axiosInstance.post(`mail_draft/${draftId}/`, draft, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  getDrafts: async (token: string) => {
    return await axiosInstance.get("mail_draft/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  deleteDraft: async (token: string, id: number) => {
    return await axiosInstance.delete(`mail_draft/${id}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
};
