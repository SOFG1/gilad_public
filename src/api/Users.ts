import { axiosInstance } from ".";
import { IAddUser, IEditUser } from "../store/users";

export const Users = {
  getUsers: async (token: string) => {
    return await axiosInstance.get("users/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  addUser: async (user: IAddUser, token: string) => {
    const reqData = new FormData()
    Object.keys(user).forEach(key => {
      //@ts-ignore
      reqData.append(key, user[key])
    })
    return await axiosInstance.post("users/", reqData, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  deleteUser: async (id: number, token: string) => {
    return await axiosInstance.delete(`users/${id}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  editUser: async (user: IEditUser, id: number, token: string) => {
    const reqData = new FormData()
    Object.keys(user).forEach(key => {
      //@ts-ignore
      reqData.append(key, user[key])
    })
    return await axiosInstance.post(`users/${id}/`, reqData, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
};
