import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* -----------------------------
   Axios Instance
----------------------------- */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* -----------------------------
   Route Guards
----------------------------- */
const PUBLIC_PATHS = ["/auth/login/", "/auth/signup/", "/auth/refresh/"];

let authRedirected = false;

/* -----------------------------
   Central auth failure handler
----------------------------- */
function handleAuthFailure() {
  if (authRedirected) return;

  authRedirected = true;
  alert("Session expired. Please login again.");
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
}

/* -----------------------------
   Request Interceptor
----------------------------- */
api.interceptors.request.use((config) => {
  const url = config.url || "";
  const isPublicRequest = PUBLIC_PATHS.some((path) => url.startsWith(path));
  const token = localStorage.getItem("token");

  if (!isPublicRequest && !token) {
    throw new axios.Cancel("Missing auth token");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* -----------------------------
   Response Interceptor
----------------------------- */
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const url = error.config?.url || "";
    const isPublicRequest = PUBLIC_PATHS.some((path) =>
      url.startsWith(path)
    );

    if (error.response?.status === 401 && !isPublicRequest) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        handleAuthFailure();
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await api.post("/auth/refresh/", {
          refresh: refreshToken,
        });

        const newAccess = refreshResponse.access;
        localStorage.setItem("token", newAccess);

        const retryConfig = { ...error.config };
        retryConfig.headers = {
          ...(retryConfig.headers || {}),
          Authorization: `Bearer ${newAccess}`,
        };

        return api.request(retryConfig);
      } catch (refreshError) {
        handleAuthFailure();
        return Promise.reject(refreshError);
      }
    }

    const message =
      error.response?.data?.error ||
      error.response?.data?.detail ||
      "Request failed";

    return Promise.reject(new Error(message));
  }
);

/* -----------------------------
   API Methods
----------------------------- */

export const signup = (email, password) =>
  api.post("/auth/signup/", { email, password });

export const login = (email, password) =>
  api.post("/auth/login/", { email, password });

export const refreshToken = (refresh) =>
  api.post("/auth/refresh/", { refresh });

export const uploadPDF = (file, expiresAt) => {
  const formData = new FormData();
  formData.append("file_path", file);
  formData.append("expires_at", expiresAt);

  return api.post("/teacher/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const accessPDF = (code) =>
  api.post("/student/access/", { code });

export const getTeacherPDFs = () =>
  api.get("/teacher/pdf-sessions/");

export const deleteTeacherPDF = (id) =>
  api.delete(`/teacher/pdf-sessions/${id}/`);

export default api;
