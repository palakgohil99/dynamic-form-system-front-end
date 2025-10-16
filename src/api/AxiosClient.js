import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/", // ✅ replace with your Node.js backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
