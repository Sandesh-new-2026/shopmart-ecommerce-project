import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const requestPath = config.url || "";
  const isPublicRequest =
    requestPath === "/products" ||
    requestPath.startsWith("/products/");

  if (token && !isPublicRequest) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
