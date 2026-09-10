import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "https://shopmart-ecommerce-backend-5rw1i4nr7-sandesh-react-projects.vercel.app/"}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
