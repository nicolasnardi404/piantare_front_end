/**
 * Translated Species Data Utility
 *
 * Merges base species data with i18n translations
 */

import { conceptoArteSpecies } from '../data/conceptoArteSpecies.js';

/**
 * Get all species with translations applied
 * @param {Function} t - i18n translation function
 * @returns {Array} Array of translated species objects
 */
export const getAllTranslatedSpecies = (t) => {
  return conceptoArteSpecies.map(species => ({
    ...species,
    commonName: t(`species.${species.id}.commonName`, species.commonName),
    description: t(`species.${species.id}.description`, species.description),
    keyFeatures: species.keyFeatures.map((feature, idx) =>
      t(`species.${species.id}.keyFeatures.${idx}`, feature)
    ),
    ecologicalScores: species.ecologicalScores.map((score, idx) => ({
      label: t(`species.${species.id}.ecologicalScores.${idx}.label`, score.label),
      score: score.score, // Score numbers don't need translation
      description: t(`species.${species.id}.ecologicalScores.${idx}.description`, score.description)
    }))
  }));
};

/**
 * Get a single translated species by name
 * @param {Function} t - i18n translation function
 * @param {String} name - Common or scientific name
 * @returns {Object|null} Translated species object or null
 */
export const getTranslatedSpeciesByName = (t, name) => {
  const allSpecies = getAllTranslatedSpecies(t);
  return allSpecies.find(
    s => s.commonName === name || s.scientificName === name
  ) || null;
};

/**
 * Get translated species by role
 * @param {Function} t - i18n translation function
 * @param {String} role - Ecological role (pioneer, secondary, climax)
 * @returns {Array} Filtered translated species array
 */
export const getTranslatedSpeciesByRole = (t, role) => {
  const allSpecies = getAllTranslatedSpecies(t);
  return allSpecies.filter(s => s.role === role);
};

/**
 * Get project statistics (numbers don't need translation)
 * @returns {Object} Project stats
 */
export const getProjectStats = () => {
  return {
    totalSpecies: conceptoArteSpecies.length,
    totalTrees: conceptoArteSpecies.reduce((sum, s) => sum + s.availability.needed, 0),
    byRole: {
      pioneer: conceptoArteSpecies.filter(s => s.role === 'pioneer').length,
      secondary: conceptoArteSpecies.filter(s => s.role === 'secondary').length,
      climax: conceptoArteSpecies.filter(s => s.role === 'climax').length
    }
  };
};

export default {
  getAllTranslatedSpecies,
  getTranslatedSpeciesByName,
  getTranslatedSpeciesByRole,
  getProjectStats
};
