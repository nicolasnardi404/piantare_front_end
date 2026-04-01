import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './AboutUs.css'
import HeroImageLoader from './HeroImageLoader'

/**
 * AboutUs Component
 *
 * Displays who ApeForest is and how we work with hero image and three main pillars
 */

// Reusable Card Component
const WorkCard = ({ icon, title, description, colorClass }) => (
  <div className={`work-card ${colorClass}`}>
    <div className="work-card__icon">
      <img src={icon} alt={title} />
    </div>
    <h3 className="work-card__title">{title}</h3>
    <p className="work-card__description">{description}</p>
  </div>
)

const AboutUs = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { t } = useTranslation('about');

  // Card data with translations
  const workCards = [
    {
      id: 1,
      icon: '/icons/star.png',
      title: t('howWeWork.cards.empowerFarmers.title'),
      description: t('howWeWork.cards.empowerFarmers.description'),
      colorClass: 'card-sage'
    },
    {
      id: 2,
      icon: '/icons/connecting.png',
      title: t('howWeWork.cards.connectCompanies.title'),
      description: t('howWeWork.cards.connectCompanies.description'),
      colorClass: 'card-terracotta'
    },
    {
      id: 3,
      icon: '/icons/sun.png',
      title: t('howWeWork.cards.restoreNature.title'),
      description: t('howWeWork.cards.restoreNature.description'),
      colorClass: 'card-sage'
    }
  ];

  return (
    <section className="how-it-works">
      {/* Hero Section */}
      <div className="how-it-works__hero">
        <HeroImageLoader isLoading={!imageLoaded} />
        <picture>
          <source srcSet="/images/about_us.webp" type="image/webp" />
          <img
            src="/images/about_us.png"
            alt="Nature background"
            className="how-it-works__hero-image"
            onLoad={() => setImageLoaded(true)}
          />
        </picture>
        <div className="how-it-works__hero-content">
          <h1 className="how-it-works__hero-title">
            {t('hero.title')}
          </h1>
        </div>
      </div>

      {/* What is ApeForest Section */}
      <div className="what-is-apeforest">
        <div className="what-is-apeforest__container">
          <div className="what-is-apeforest__illustration">
            <img src="/icons/tree_branch.png" alt="Tree illustration" />
          </div>

          <div className="what-is-apeforest__content">
            <h2>{t('whatIs.title')}</h2>

            <p>
              {t('whatIs.paragraph1')}
            </p>

            <p>
              {t('whatIs.paragraph2')}
            </p>

            <p>
              {t('whatIs.paragraph3')}
            </p>
          </div>
        </div>
      </div>

      {/* How We Work Section */}
      <div className="how-it-works__content">
        <h2 className="how-it-works__section-title">{t('howWeWork.title')}</h2>

        <div className="work-cards">
          {workCards.map(card => (
            <WorkCard key={card.id} {...card} />
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <div className="contact-card">
          <h2 className="contact-card__title">{t('contact.title')}</h2>
          <p className="contact-card__description">
            {t('contact.description')}
          </p>
          <a href={`mailto:${t('contact.email')}`} className="contact-card__email">
            {t('contact.email')}
          </a>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
