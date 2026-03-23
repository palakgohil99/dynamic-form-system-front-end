import axiosClient from "./AxiosClient";

export const userDetails = async (data) => {
    console.log('userId: ' + JSON.stringify(data));
    const response = await axiosClient.get("user/user-details", {
        params: {
            id: data.id
        }
    });
    return response.data;
};

export const updateUserProfile = async (data) => {
    const response = await axiosClient.post("user/update-user-profile", data);
    return response.data;
}

export const imageUpload = async (data) => {
    const response = await axiosClient.post("user/image-upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data.fileUrl);
    return response.data;
} 

export const deleteAccount = async (data) => {
    const response = await axiosClient.post("user/delete-account", data);
    return response.data;
}