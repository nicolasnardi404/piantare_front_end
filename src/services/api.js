import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login page if unauthorized
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

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
  getMapMarkers: () => api.get("/plant-locations"),
  getCompanyPlantsDetailed: () => api.get("/plant-locations/company"),
  getFarmerPlants: () => api.get("/plant-locations/farmer"),
  getPlantDetails: (id) => api.get(`/plant-locations/${id}`),
  create: (data) => api.post("/plant-locations", data),
  update: (id, data) => api.put(`/plant-locations/${id}`, data),
  delete: (id) => api.delete(`/plant-locations/${id}`),
};

export const plants = {
  getList: () => api.get("/plants"),
  getDetails: (id) => api.get(`/plants/${id}`),
  create: (data) => api.post("/plants", data),
  update: (id, data) => api.put(`/plants/${id}`, data),
  delete: (id) => api.delete(`/plants/${id}`),
};

export const uploads = {
  uploadFile: (formData) =>
    api.post("/uploads/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export const plantUpdates = {
  create: (data) => api.post("/plant-updates", data),
  getForPlant: (plantId) => api.get(`/plant-updates/plant/${plantId}`),
};

export const geoGpt = {
  analyze: (data) => api.post("/geo-gpt/analyze", data),
};

export const geocoding = {
  getLocationDetails: async (latitude, longitude) => {
    const response = await api.get(
      `/geogpt/location?latitude=${latitude}&longitude=${longitude}`
    );
    return response.data;
  },
};

export const projects = {
  getList: () => api.get("/projects"),
  getById: (id) => api.get(`/projects/${id}`),
  getMapDetails: (id) => api.get(`/projects/${id}/map`),
  create: (projectData) => api.post("/projects", projectData),
  update: (id, projectData) => api.put(`/projects/${id}`, projectData),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const farmer = {
  getProjects: () => api.get("/projects/farmer"),
  createProject: (data) => api.post("/projects", data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  getDashboardComplete: () =>
    api.get("/planted-plants/farmer/dashboard-complete"),
};

// Export both named exports and default export
export { api };
export default api;
