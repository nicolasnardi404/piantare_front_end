import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
};

export const companies = {
  getAll: () => api.get("/companies"),
  create: (companyData) => api.post("/companies", companyData),
  update: (id, companyData) => api.put(`/companies/${id}`, companyData),
  delete: (id) => api.delete(`/companies/${id}`),
  getProfile: () => api.get("/companies/profile"),
  updateProfile: (data) => api.put("/companies/profile", data),
};

export const users = {
  getAll: () => api.get("/users"),
  create: (userData) => api.post("/users", userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

export const plantLocations = {
  getAll: () => api.get("/plant-locations"),
  create: (locationData) => api.post("/plant-locations", locationData),
  getOne: (id) => api.get(`/plant-locations/${id}`),
  assignCompany: (id, data) =>
    api.put(`/plant-locations/${id}/assign-company`, data),
};

export const uploads = {
  uploadFile: (formData) =>
    api.post("/uploads/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default api;
