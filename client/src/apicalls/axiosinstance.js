import axios from "axios";
export const axiosInstance = axios.create({
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
  baseURL: "http://localhost:5000", // Adjust if your backend is running on a different port or server
});
