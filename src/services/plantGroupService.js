import api from "./api";

export const plantGroupService = {
  // Create a new plant group for a project
  createPlantGroup: async (projectId, data) => {
    const response = await api.post(
      `/plant-groups/projects/${projectId}/groups`,
      data
    );
    return response.data;
  },

  // Add planted plants to a group
  addPlantedPlants: async (groupId, coordinates) => {
    const response = await api.post(`/plant-groups/groups/${groupId}/plants`, {
      coordinates,
    });
    return response.data;
  },

  // Get all plant groups for a project
  getProjectPlantGroups: async (projectId) => {
    const response = await api.get(
      `/plant-groups/projects/${projectId}/groups`
    );
    return response.data;
  },

  // Delete a plant group
  deletePlantGroup: async (groupId) => {
    const response = await api.delete(`/plant-groups/groups/${groupId}`);
    return response.data;
  },
};

export default plantGroupService;
