import axiosClient from "./AxiosClient";

export const loginUser = async (data) => {
    console.log('data: ' + data)
  const response = await axiosClient.post("/login", data);
  return response.data;
};