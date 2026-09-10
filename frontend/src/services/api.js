import axios from "axios";

const configuredApiUrl =
  import.meta.env.VITE_API_URL ||
  "https://shopmart-backend-ifz0dzxny-sandesh-react-projects.vercel.app";
const apiRoot = configuredApiUrl.replace(/\/+$/, "").replace(/\/api$/, "");
const api = axios.create({
  baseURL: `${apiRoot}/api`,
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
