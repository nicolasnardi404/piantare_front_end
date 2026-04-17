import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import './ConceptoArte.css';
import TreeCard from '../components/TreeCard';
import { getAllTranslatedSpecies } from '../utils/translatedSpeciesData';

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
  const [currentIndex, setCurrentIndex] = useState(0);

  const allSpecies = getAllTranslatedSpecies(t);

  const handleSpeciesClick = (species) => {
    const index = allSpecies.findIndex(s => s.id === species.id);
    setCurrentIndex(index);
    setSelectedSpecies(species);
  };

  const handleCloseCard = () => {
    setSelectedSpecies(null);
  };

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : allSpecies.length - 1;
    setCurrentIndex(newIndex);
    setSelectedSpecies(allSpecies[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentIndex < allSpecies.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedSpecies(allSpecies[newIndex]);
  };

  // Handle keyboard navigation and prevent body scroll
  useEffect(() => {
    if (selectedSpecies) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';

      // Scroll modal to top when opening or changing species
      const modalOverlay = document.querySelector('.conceito-arte__modal-overlay');
      if (modalOverlay) {
        modalOverlay.scrollTop = 0;
      }

      // Handle keyboard navigation
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setSelectedSpecies(null);
        } else if (e.key === 'ArrowLeft') {
          handlePrevious();
        } else if (e.key === 'ArrowRight') {
          handleNext();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedSpecies, currentIndex]);

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
          <h2 className="conceito-arte__species-title">{t('speciesSection.title')}</h2>
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

      {/* Modal rendered via Portal to document.body */}
      {selectedSpecies && createPortal(
        <div
          className="conceito-arte__modal-overlay"
          onClick={handleCloseCard}
        >
          <div
            className="conceito-arte__modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="conceito-arte__modal-close"
              onClick={handleCloseCard}
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Previous Arrow */}
            <button
              className="conceito-arte__modal-nav-btn conceito-arte__modal-nav-btn--prev"
              onClick={handlePrevious}
              aria-label="Previous species"
            >
              ‹
            </button>

            {/* Next Arrow */}
            <button
              className="conceito-arte__modal-nav-btn conceito-arte__modal-nav-btn--next"
              onClick={handleNext}
              aria-label="Next species"
            >
              ›
            </button>

            <TreeCard
              {...selectedSpecies}
              onAddToCart={() => {
                console.log('Add to cart:', selectedSpecies.commonName);
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ConceptoArte;
