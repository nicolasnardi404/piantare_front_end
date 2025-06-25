import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
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
  // Get basic map markers data
  getMapMarkers: () => api.get("/planted-plants/map-markers"),

  // Get farmer's plants with relevant data
  getFarmerPlants: () => api.get("/planted-plants/farmer/plants"),

  // Get company's plants with relevant data
  getCompanyPlants: () => api.get("/planted-plants/company/plants"),

  // Get detailed plant information
  getPlantDetails: (id) => api.get(`/planted-plants/details/${id}`),

  // Create new planted plant
  create: (data) =>
    api.post("/planted-plants", {
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      speciesId: parseInt(data.plantId), // Changed from speciesId to match frontend
      description: data.description,
      projectId: parseInt(data.projectId),
      imageUrl: data.imageUrl,
      height: parseFloat(data.height),
      diameter: parseFloat(data.width), // Using width as diameter
    }),

  // Delete planted plant
  delete: (id) => api.delete(`/planted-plants/${id}`),
};

export const plants = {
  getAll: () => api.get("/plants"),
  getList: () => api.get("/plants/list"), // New endpoint for getting all plants without pagination
  getOne: (id) => api.get(`/plants/${id}`),
  create: (plantData) => api.post("/plants", plantData),
  update: (id, plantData) => api.put(`/plants/${id}`, plantData),
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
  create: (updateData) => {
    // Create a regular object instead of FormData since we already have the imageUrl
    const data = {
      plantLocationId: updateData.plantLocationId,
      healthStatus: updateData.healthStatus,
      notes: updateData.notes || "",
      imageUrl: updateData.imageUrl,
      height: parseFloat(updateData.height),
      width: parseFloat(updateData.width),
    };

    console.log("Sending update data:", data);
    return api.post("/plant-updates", data);
  },
  getByPlantId: (plantLocationId) =>
    api.get(`/plant-updates/plant/${plantLocationId}`),
  delete: (id) => api.delete(`/plant-updates/${id}`),
};

export const geoGpt = {
  analyze: (plants) => api.post("/geogpt/analyze", { plants }),
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
  // Get complete dashboard data including projects, plants and stats
  getDashboardComplete: () =>
    api.get("/planted-plants/farmer/dashboard-complete"),

  // Get dashboard data including plants and stats
  getDashboardData: () => api.get("/planted-plants/farmer/dashboard"),

  // Get projects list with plant counts
  getProjects: () => api.get("/planted-plants/farmer/projects"),

  // Get plants table data
  getPlantsTable: () => api.get("/planted-plants/farmer/plants-table"),
};

// Export both named exports and default export
export { api };
export default api;
