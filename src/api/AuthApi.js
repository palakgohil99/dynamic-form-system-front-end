import axiosClient from "./AxiosClient";

export const loginUser = async (data) => {
  console.log('data: ' + data)
  const response = await axiosClient.post("auth/login", data);
  return response.data;
};

export const registerUser = async (data) => {
  console.log('data: ' + data)
  const response = await axiosClient.post("auth/signup", data);
  return response.data;
};

export const sendOtp = async (data) => {
  console.log('data: ' + data)
  const response = await axiosClient.post("auth/send-otp", data);
  return response.data;
};

export const verifyOtp = async (data) => {
  console.log('data: ' + data)
  const response = await axiosClient.post("auth/verify-otp", data);
  return response.data;
};

export const updatePassword = async (data) => {
  console.log('data: ' + JSON.stringify(data))
  const response = await axiosClient.post("auth/reset-password", data);
  return response.data;
};
