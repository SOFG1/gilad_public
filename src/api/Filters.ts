import { axiosInstance } from ".";
import { FilterPosts } from "../store/posts";

export const Filters = {
  getFilters: async (token: string) => {
    return await axiosInstance.get("filters/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  setFilters: async (params: FilterPosts, token: string) => {
    return await axiosInstance.post("filters/", {filters: params}, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
};
