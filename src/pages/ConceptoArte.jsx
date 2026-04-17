import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ConceptoArte.css';
import TreeCard from '../components/TreeCard';
import { getAllSpecies } from '../utils/speciesData';

/**
 * ConceptoArte Page
 *
 * Showcases the ConceptoArte pilot project - a Miyawaki micro-forest
 * in Sarandi, Porto Alegre, RS, Brazil. Features project stats, timeline,
 * methodology, and all 33 planted species with detailed information.
 */
const ConceptoArte = () => {
  const { t } = useTranslation('conceitoArte');
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allSpecies = getAllSpecies();

  const handleSpeciesClick = (species) => {
    setSelectedSpecies(species);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scroll when modal is open
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSpecies(null);
    document.body.style.overflow = 'auto'; // Restore scroll
  };

  // Handle ESC key to close modal
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isModalOpen) {
      handleCloseModal();
    }
  };

  // Add event listener for ESC key
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }

  return (
    <div className="conceito-arte">
      {/* Hero Section */}
      <section className="conceito-arte__hero">
        <div className="conceito-arte__hero-image-container">
          <img
            src="/images/hero_conceito_arte.png"
            alt="ConceptoArte forest"
            className="conceito-arte__hero-image"
          />
          <div className="conceito-arte__hero-overlay" />
        </div>
        <div className="conceito-arte__hero-content">
          <h1 className="conceito-arte__hero-title">conceitoArte</h1>
          <p className="conceito-arte__hero-subtitle">{t('hero.subtitle')}</p>
          <p className="conceito-arte__hero-location">{t('hero.location')}</p>
        </div>
      </section>

      {/* Project Description Section */}
      <section className="conceito-arte__description">
        <div className="conceito-arte__description-container">
          <div className="conceito-arte__description-image">
            <img
              src="/images/generalview_planting_day.png"
              alt="ConceptoArte planting day"
            />
          </div>
          <div className="conceito-arte__description-content">
            <h2 className="conceito-arte__description-title">ConceitoArte</h2>
            <p className="conceito-arte__description-text">{t('description.text')}</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="conceito-arte__stats">
        <div className="conceito-arte__stats-container">
          <div className="conceito-arte__stat">
            <div className="conceito-arte__stat-circle conceito-arte__stat-circle--primary">
              <span className="conceito-arte__stat-number">300</span>
            </div>
            <p className="conceito-arte__stat-label">{t('stats.plantedTrees')}</p>
          </div>

          <div className="conceito-arte__stat">
            <div className="conceito-arte__stat-circle">
              <span className="conceito-arte__stat-number">35</span>
            </div>
            <p className="conceito-arte__stat-label">{t('stats.species')}</p>
          </div>

          <div className="conceito-arte__stat">
            <div className="conceito-arte__stat-circle">
              <span className="conceito-arte__stat-number">2000</span>
            </div>
            <p className="conceito-arte__stat-label">{t('stats.co2')}</p>
          </div>

          <div className="conceito-arte__stat">
            <div className="conceito-arte__stat-circle">
              <span className="conceito-arte__stat-number">100</span>
            </div>
            <p className="conceito-arte__stat-label">{t('stats.meters')}</p>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="conceito-arte__methodology">
        <div className="conceito-arte__methodology-container">
          <h2 className="conceito-arte__methodology-title">{t('methodology.title')}</h2>
          <p className="conceito-arte__methodology-text">{t('methodology.text')}</p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="conceito-arte__timeline">
        <div className="conceito-arte__timeline-container">
          <img
            src="/images/planting_day.png"
            alt="Planting day December 2025"
            className="conceito-arte__timeline-image"
          />
          <img
            src="/images/4months_reforestation.png"
            alt="Forest after 4 months April 2026"
            className="conceito-arte__timeline-image conceito-arte__timeline-image--large"
          />
        </div>
      </section>

      {/* Resilience Section */}
      <section className="conceito-arte__resilience">
        <div className="conceito-arte__resilience-container">
          <h2 className="conceito-arte__resilience-title">{t('resilience.title')}</h2>
          <p className="conceito-arte__resilience-text">{t('resilience.text1')}</p>
          <p className="conceito-arte__resilience-text">{t('resilience.text2')}</p>
        </div>
      </section>

      {/* Soil Preparation Section */}
      <section className="conceito-arte__soil">
        <div className="conceito-arte__soil-container">
          <h2 className="conceito-arte__soil-title">{t('soil.title')}</h2>
          <p className="conceito-arte__soil-text">{t('soil.text')}</p>
        </div>
      </section>

      {/* Partners Section */}
      <section className="conceito-arte__partners">
        <div className="conceito-arte__partners-container">
          <h2 className="conceito-arte__partners-title">{t('partners.title')}</h2>
          <div className="conceito-arte__partners-logos">
            <img
              src="/images/retomada_br.png"
              alt="Retomada BR"
              className="conceito-arte__partners-logo"
            />
            <img
              src="/images/todavida_ong.png"
              alt="Toda Vida ONG"
              className="conceito-arte__partners-logo"
            />
          </div>
        </div>
      </section>

      {/* Species Section */}
      <section className="conceito-arte__species">
        <div className="conceito-arte__species-container">
          <h2 className="conceito-arte__species-title">{t('species.title')}</h2>
          <div className="conceito-arte__species-grid">
            {allSpecies.map((species, index) => (
              <div
                key={index}
                className="conceito-arte__species-card"
                onClick={() => handleSpeciesClick(species)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSpeciesClick(species);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${species.commonName}`}
              >
                <div className="conceito-arte__species-image-wrapper">
                  <img
                    src={species.imageUrl}
                    alt={species.commonName}
                    className="conceito-arte__species-image"
                    onError={(e) => {
                      // Fallback to a placeholder if image doesn't exist
                      e.target.src = '/images/species/placeholder.jpg';
                    }}
                  />
                  <div className="conceito-arte__species-overlay">
                    <button
                      className="conceito-arte__species-info-btn"
                      aria-label="More information"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="conceito-arte__species-info">
                  <h3 className="conceito-arte__species-name">{species.commonName}</h3>
                  <p className="conceito-arte__species-scientific">{species.scientificName}</p>
                  <p className="conceito-arte__species-co2">{species.characteristics?.co2}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-screen Modal for TreeCard */}
      {isModalOpen && selectedSpecies && (
        <div
          className="conceito-arte__modal"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="species-modal-title"
        >
          <div
            className="conceito-arte__modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="conceito-arte__modal-close"
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <TreeCard
              {...selectedSpecies}
              onAddToCart={() => {
                console.log('Add to cart:', selectedSpecies.commonName);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConceptoArte;
