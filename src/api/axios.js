import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: {
    "Content-Type": "application/json"
  }
});

/* Attach JWT */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* Handle Expired / Invalid Token - MODIFIED */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't auto-redirect on 401 errors
    // Let each component handle 401 errors individually
    return Promise.reject(error);
  }
);

export default api;