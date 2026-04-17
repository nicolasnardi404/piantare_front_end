import './TreeCard.css';
import { useTranslation } from 'react-i18next';

/**
 * TreeCard Component
 *
 * Reusable card component for displaying tree information
 * Based on the Figma design system and project photo reference
 *
 * @param {Object} props
 * @param {string} props.commonName - Common name of the tree (e.g., "Jaboticaba")
 * @param {string} props.scientificName - Scientific name (e.g., "Plinia cauliflora")
 * @param {string} props.description - Brief description of the tree
 * @param {string} props.imageUrl - URL to tree image
 * @param {Object} props.characteristics - Tree characteristics
 * @param {string} props.characteristics.height - Height range (e.g., "5-10m")
 * @param {string} props.characteristics.lifespan - Lifespan (e.g., "20-30yr")
 * @param {string} props.characteristics.co2 - CO2 absorption (e.g., "0.14t CO₂")
 * @param {string} props.characteristics.origin - Geographic origin
 * @param {Array} props.keyFeatures - Array of key feature strings
 * @param {Array} props.ecologicalScores - Array of ecological score objects
 * @param {string} props.ecologicalScores[].label - Score label (e.g., "Biodiversity")
 * @param {number} props.ecologicalScores[].score - Score out of 10
 * @param {string} props.ecologicalScores[].description - Score description
 * @param {Object} props.availability - Availability information
 * @param {number} props.availability.needed - Trees needed for project
 * @param {number} props.availability.available - Trees available to buy
 * @param {Object} props.pricing - Pricing information
 * @param {number} props.pricing.pricePerTree - Price per tree in euros
 * @param {function} props.onAddToCart - Callback when Add to Cart is clicked
 */
const TreeCard = ({
  commonName,
  scientificName,
  description,
  imageUrl,
  characteristics = {},
  keyFeatures = [],
  ecologicalScores = [],
  availability = {},
  pricing = {},
  onAddToCart,
}) => {
  const { t } = useTranslation('marketplace');

  return (
    <div className="tree-card">
      {/* Main Card Container */}
      <div className="tree-card__container">

        {/* Left Column - Image */}
        <div className="tree-card__image-section">
          <img
            src={imageUrl}
            alt={commonName}
            className="tree-card__image"
          />
        </div>

        {/* Right Column - Content */}
        <div className="tree-card__content">

          {/* Header */}
          <div className="tree-card__header">
            <h2 className="tree-card__title">{commonName}</h2>
            <p className="tree-card__scientific-name">{scientificName}</p>
          </div>

          {/* Characteristics Badges */}
          {characteristics && Object.keys(characteristics).length > 0 && (
            <div className="tree-card__characteristics">
              {characteristics.height && (
                <span className="tree-card__badge tree-card__badge--characteristic">
                  {characteristics.height}
                </span>
              )}
              {characteristics.co2 && (
                <span className="tree-card__badge tree-card__badge--characteristic">
                  {characteristics.co2}
                </span>
              )}
              {characteristics.lifespan && (
                <span className="tree-card__badge tree-card__badge--characteristic">
                  {characteristics.lifespan}
                </span>
              )}
              {characteristics.origin && (
                <span className="tree-card__badge tree-card__badge--characteristic">
                  {characteristics.origin}
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="tree-card__description">{description}</p>
          )}

          {/* Key Features */}
          {keyFeatures.length > 0 && (
            <div className="tree-card__section">
              <h3 className="tree-card__section-title">Key characteristics</h3>
              <div className="tree-card__features">
                {keyFeatures.map((feature, index) => (
                  <span key={index} className="tree-card__badge tree-card__badge--feature">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ecological Scores */}
          {ecologicalScores.length > 0 && (
            <div className="tree-card__section">
              <h3 className="tree-card__section-title">Ecological scores</h3>
              <div className="tree-card__scores">
                {ecologicalScores.map((score, index) => (
                  <div key={index} className="tree-card__score-card">
                    <div className="tree-card__score-header">
                      <span className="tree-card__score-label">{score.label}</span>
                      <span className="tree-card__score-value">{score.score}/10</span>
                    </div>
                    <p className="tree-card__score-description">{score.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Availability & Purchase Section */}
          {(availability.needed || availability.available || pricing.pricePerTree) && (
            <div className="tree-card__purchase-section">

              {/* Availability Info */}
              <div className="tree-card__availability">
                {availability.needed !== undefined && (
                  <div className="tree-card__availability-item">
                    <div className="tree-card__availability-circle">
                      <span className="tree-card__availability-number">{availability.needed}</span>
                    </div>
                    <p className="tree-card__availability-label">
                      {commonName} needed for this project:
                    </p>
                  </div>
                )}
                {availability.available !== undefined && (
                  <div className="tree-card__availability-item">
                    <div className="tree-card__availability-circle">
                      <span className="tree-card__availability-number">{availability.available}</span>
                    </div>
                    <p className="tree-card__availability-label">Available to buy</p>
                  </div>
                )}
              </div>

              {/* Purchase Box */}
              {pricing.pricePerTree && (
                <div className="tree-card__purchase-box">
                  <div className="tree-card__purchase-info">
                    <p className="tree-card__purchase-quantity">1 x {commonName}</p>
                    <p className="tree-card__purchase-price">{pricing.pricePerTree} euros</p>
                  </div>
                  <button
                    className="tree-card__add-to-cart"
                    onClick={onAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TreeCard;
