/**
 * Species Data Utility
 * Parses apeforest_species_references.json and transforms it for TreeCard component
 */

import speciesReferences from '../../apeforest_species_references.json';

/**
 * Maps species reference data to TreeCard component props
 * @param {Object} speciesRef - Species reference from JSON
 * @returns {Object} TreeCard props
 */
export const mapSpeciesToTreeCard = (speciesRef) => {
  const scoreData = speciesRef.score_sources || {};

  // Extract ecological scores
  const ecologicalScores = [];

  if (scoreData.biodiversity) {
    ecologicalScores.push({
      label: 'Biodiversity',
      score: extractScore(scoreData.biodiversity.note),
      description: scoreData.biodiversity.note || 'Supports diverse wildlife'
    });
  }

  if (scoreData.food) {
    ecologicalScores.push({
      label: 'Food Security',
      score: extractScore(scoreData.food.note),
      description: scoreData.food.note || 'Provides edible resources'
    });
  }

  if (scoreData.climate) {
    ecologicalScores.push({
      label: 'Climate Resilience',
      score: extractScore(scoreData.climate.note),
      description: scoreData.climate.note || 'Adapts to climate conditions'
    });
  }

  if (scoreData.ecological) {
    ecologicalScores.push({
      label: 'Ecological Role',
      score: extractScore(scoreData.ecological.note),
      description: scoreData.ecological.note || 'Important ecosystem function'
    });
  }

  return {
    commonName: speciesRef.name || '',
    scientificName: speciesRef.scientific_name || '',
    description: generateDescription(speciesRef),
    imageUrl: `/images/species/${speciesRef.scientific_name?.replace(/ /g, '_')}.jpg`,
    characteristics: {
      height: '5-15m', // Default range, could be extracted from sources
      lifespan: '30-100yr',
      co2: '2800 kg CO₂',
      origin: 'Atlantic Forest, RS'
    },
    keyFeatures: extractKeyFeatures(speciesRef),
    ecologicalScores: ecologicalScores.slice(0, 3), // Limit to 3 for display
    availability: {
      needed: 0,
      available: 0
    },
    pricing: {
      pricePerTree: 0
    }
  };
};

/**
 * Extract score value from note text (looks for "Score: X" or "/10" patterns)
 */
const extractScore = (note) => {
  if (!note) return 7; // Default score

  // Look for explicit "Score: X" pattern
  const scoreMatch = note.match(/Score:\s*(\d+)/i);
  if (scoreMatch) return parseInt(scoreMatch[1]);

  // Look for "X/10" pattern
  const ratingMatch = note.match(/(\d+)\/10/);
  if (ratingMatch) return parseInt(ratingMatch[1]);

  // Default to 7 if no score found
  return 7;
};

/**
 * Generate a description from species reference data
 */
const generateDescription = (speciesRef) => {
  const parts = [];

  if (speciesRef.score_sources?.biodiversity?.note) {
    parts.push(speciesRef.score_sources.biodiversity.note.split('.')[0]);
  }

  if (speciesRef.score_sources?.ecological?.note) {
    parts.push(speciesRef.score_sources.ecological.note.split('.')[0]);
  }

  return parts.join('. ') + '.' || 'Native Atlantic Forest species from Rio Grande do Sul.';
};

/**
 * Extract key features from species data
 */
const extractKeyFeatures = (speciesRef) => {
  const features = [];

  // Check for N-fixation mention
  if (speciesRef.score_sources?.ecological?.note?.toLowerCase().includes('n-fix')) {
    features.push('Nitrogen-fixing');
  }

  // Check for food use
  if (speciesRef.score_sources?.food?.note?.toLowerCase().includes('panc') ||
      speciesRef.score_sources?.food?.note?.toLowerCase().includes('edible')) {
    features.push('Edible fruit');
  }

  // Check for medicinal use
  if (speciesRef.score_sources?.community?.note?.toLowerCase().includes('medicin')) {
    features.push('Medicinal properties');
  }

  // Check for drought tolerance
  if (speciesRef.score_sources?.climate?.note?.toLowerCase().includes('drought')) {
    features.push('Drought tolerant');
  }

  // Check for flood tolerance
  if (speciesRef.score_sources?.climate?.note?.toLowerCase().includes('flood') ||
      speciesRef.score_sources?.climate?.note?.toLowerCase().includes('inundation')) {
    features.push('Flood resistant');
  }

  // Always add some generic features if we don't have enough
  if (features.length < 2) {
    features.push('Native to RS', 'Supports biodiversity');
  }

  return features.slice(0, 4); // Limit to 4 features
};

/**
 * Get all species for ConceptoArte project
 * @returns {Array} Array of TreeCard props for all species
 */
export const getAllSpecies = () => {
  const speciesRefs = speciesReferences.species_references || [];
  return speciesRefs.map(mapSpeciesToTreeCard);
};

/**
 * Get a single species by name
 * @param {String} name - Common or scientific name
 * @returns {Object|null} TreeCard props or null if not found
 */
export const getSpeciesByName = (name) => {
  const speciesRefs = speciesReferences.species_references || [];
  const found = speciesRefs.find(
    s => s.name === name || s.scientific_name === name
  );
  return found ? mapSpeciesToTreeCard(found) : null;
};

export default {
  getAllSpecies,
  getSpeciesByName,
  mapSpeciesToTreeCard
};
