import axiosClient from "./AxiosClient";

export const uploadDocuments = async (data) => {
    const response = await axiosClient.post("vault/document-upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    //   console.log(response.data.fileUrl);
    return response.data;
}  

export const getDocuments = async (data) => {
    const response = await axiosClient.post("vault/get-documents", data);
    return response.data;
}

export const deleteDocuments = async (data) => {
    const response = await axiosClient.post("vault/delete-documents", data);
    return response.data;
}

export const downloadDocuments = async (id, isPreview = false) => {
    const token = localStorage.getItem("token");
    var url = `vault/download-document/${id}`;
    if(isPreview != "") {
      var url = `vault/download-document/${id}/${isPreview}`; 
    }
    const response = await axiosClient.get(`vault/download-document/${id}/${isPreview}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response.data;
}

export const downloadZip = async (ids) => {
  const token = localStorage.getItem("token");
  const response = await axiosClient.post("vault/download-multiple/", ids, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  return response.data;
}