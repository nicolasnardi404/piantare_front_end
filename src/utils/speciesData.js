/**
 * Species Data Utility
 *
 * DEPRECATED: This file is maintained for backwards compatibility.
 * New code should import directly from '../data/conceptoArteSpecies.js'
 *
 * Provides species data for TreeCard component
 */

import {
  getAllSpecies as getAll,
  getSpeciesByName as getByName,
  getSpeciesByRole as getByRole,
  getProjectStats as getStats
} from '../data/conceptoArteSpecies.js';

/**
 * Get all species for ConceptoArte project
 * @returns {Array} Array of TreeCard props for all species
 */
export const getAllSpecies = () => {
  return getAll();
};

/**
 * Get a single species by name
 * @param {String} name - Common or scientific name
 * @returns {Object|null} TreeCard props or null if not found
 */
export const getSpeciesByName = (name) => {
  return getByName(name);
};

/**
 * Get species by role (pioneer, secondary, climax)
 * @param {String} role - Ecological role
 * @returns {Array} Filtered species array
 */
export const getSpeciesByRole = (role) => {
  return getByRole(role);
};

/**
 * Get project statistics
 * @returns {Object} Project stats
 */
export const getProjectStats = () => {
  return getStats();
};

export default {
  getAllSpecies,
  getSpeciesByName,
  getSpeciesByRole,
  getProjectStats
};
