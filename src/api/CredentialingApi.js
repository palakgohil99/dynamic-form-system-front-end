import axiosClient from "./AxiosClient";

export const addCredentialing = async (data) => {
    const response = await axiosClient.post("/credentialing/add-credentialing", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    return response.data;
};

export const addCurrentHospitalPrivileges = async (data) => {
  const response = await axiosClient.post("/credentialing/add-current-hospital-privileges", data);
  return response.data;
};

export const addPrevHospitalPrivileges = async (data) => {
  const response = await axiosClient.post("/credentialing/add-prev-hospital-privileges", data);
  return response.data;
};

export const addBillingCompany = async (data) => {
  const response = await axiosClient.post("/credentialing/add-billing-company", data);
  return response.data;
};

export const getDetails = async (data) => {
  const response = await axiosClient.post("/credentialing/get-details", data);
  return response.data;
};

export const addPostGraduateEdu = async (data) => {
  const response = await axiosClient.post("/credentialing/add-post-graduate-edu", data);
  return response.data;
};

export const deletePostGraduate = async (data) => {
  const response = await axiosClient.post("/credentialing/delete-post-graduate", data);
  return response.data;
};

export const deleteCurrentHospitalPrivileges = async (data) => {
  const response = await axiosClient.post("/credentialing/delete-current-hospital-privileges", data);
  return response.data;
};

export const deletePrevHospitalPrivileges = async (data) => {
  const response = await axiosClient.post("/credentialing/delete-prev-hospital-privileges", data);
  return response.data;
};

export const deleteBillingCompanyDetail = async (data) => {
  const response = await axiosClient.post("/credentialing/delete-billing-company-detail", data);
  return response.data;
};

export const viewCurrentHospitalPrivileges = async (data) => {
  const response = await axiosClient.post("/credentialing/fetch-current-hospital-privileges", data);
  return response.data;
};

export const viewPrevHospitalPrivileges = async (data) => {
  const response = await axiosClient.post("/credentialing/fetch-prev-hospital-privileges", data);
  return response.data;
};

export const viewCompanyBillingDetails = async (data) => {
  const response = await axiosClient.post("/credentialing/fetch-billing-company-detail", data);
  return response.data;
};

export const addCurrentMalpractice = async (data) => {
  const response = await axiosClient.post("/credentialing/add-current-malpractice", data);
  return response.data;
};

export const deleteCurrentMalpractice = async (data) => {
  const response = await axiosClient.post("/credentialing/delete-current-malpractice", data);
  return response.data;
};

export const viewCurrentMalpractice = async (data) => {
  const response = await axiosClient.post("/credentialing/fetch-current-malpractice", data);
  return response.data;
};

export const addPrevMalpractice = async (data) => {
  const response = await axiosClient.post("/credentialing/add-prev-malpractice", data);
  return response.data;
};

export const deletePrevMalpractice = async (data) => {
  const response = await axiosClient.post("/credentialing/delete-prev-malpractice", data);
  return response.data;
};

export const fetchPrevMalpractice = async (data) => {
  const response = await axiosClient.post("/credentialing/fetch-prev-malpractice", data);
  return response.data;
};

export const addColleagueNames = async (data) => {
  const response = await axiosClient.post("/credentialing/add-colleague-names", data);
  return response.data;
};

export const deleteColleagueName = async (data) => {
  const response = await axiosClient.post("/credentialing/delete-colleague-name", data);
  return response.data;
};

export const fetchColleagueName = async (data) => {
  const response = await axiosClient.post("/credentialing/fetch-colleague-name", data);
  return response.data;
};

export const addOtherGraduat = async (data) => {
  const response = await axiosClient.post("/credentialing/add-other-graduate-edu", data);
  return response.data;
};

export const deleteOtherGraduat = async (data) => {
  const response = await axiosClient.post("/credentialing/delete-other-graduate-edu", data);
  return response.data;
};

export const addLicense = async (data) => {
  const response = await axiosClient.post("/credentialing/add-license", data);
  return response.data;
};

export const deleteLicense = async (data) => {
  const response = await axiosClient.post("/credentialing/delete-license", data);
  return response.data;
};