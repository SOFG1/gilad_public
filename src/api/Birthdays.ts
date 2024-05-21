import { axiosInstance } from ".";
import { IAddBirthday } from "../store/birthdays";

export const Birthdays = {
  getAllBirthdays: async (token: string) => {
    return await axiosInstance.get("all_birth_dates/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  getTodayBirthdays: async (token: string) => {
    return await axiosInstance.get("birth_dates/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  addBirthday: async (token: string, params: IAddBirthday) => {
    return await axiosInstance.post("all_birth_dates/",params ,{
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  deleteBirthday: async (token: string, id: number) => {
    return await axiosInstance.delete(`all_birth_dates/${id}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  editBirthday: async (token: string,id: number, params: IAddBirthday) => {
    return await axiosInstance.post(`all_birth_dates/${id}/`,params ,{
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
};
