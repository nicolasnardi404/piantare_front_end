import { useTranslation } from 'react-i18next'
import WorkCard from '../components/WorkCard'
import './HowItWorks.css'

/**
 * How It Works Page
 *
 * Displays the process of how ApeForest works with three main sections:
 * - Hero section with background image
 * - Transparency and Connection section
 * - For Farmers section (3 cards)
 * - For Companies section (3 cards)
 */

const HowItWorks = () => {
  const { t } = useTranslation('howItWorks');

  // Data for "For Farmers" section with translations
  const farmersCards = [
    {
      id: 1,
      icon: '/icons/location.png',
      title: t('forFarmers.cards.mapAreas.title'),
      description: t('forFarmers.cards.mapAreas.description'),
      colorClass: 'card-sage'
    },
    {
      id: 2,
      icon: '/icons/document.png',
      title: t('forFarmers.cards.documentBiodiversity.title'),
      description: t('forFarmers.cards.documentBiodiversity.description'),
      colorClass: 'card-sage-light'
    },
    {
      id: 3,
      icon: '/icons/plant_money.png',
      title: t('forFarmers.cards.receiveSupport.title'),
      description: t('forFarmers.cards.receiveSupport.description'),
      colorClass: 'card-sage'
    }
  ];

  // Data for "For Companies" section with translations
  const companiesCards = [
    {
      id: 1,
      icon: '/icons/person.png',
      title: t('forCompanies.cards.findPartners.title'),
      description: t('forCompanies.cards.findPartners.description'),
      colorClass: 'card-sage-light'
    },
    {
      id: 2,
      icon: '/icons/head_brain.png',
      title: t('forCompanies.cards.evaluateProjects.title'),
      description: t('forCompanies.cards.evaluateProjects.description'),
      colorClass: 'card-sage'
    },
    {
      id: 3,
      icon: '/icons/heart.png',
      title: t('forCompanies.cards.makeDifference.title'),
      description: t('forCompanies.cards.makeDifference.description'),
      colorClass: 'card-sage-light'
    }
  ];

  return (
    <section className="how-it-works-page">
      {/* Hero Section */}
      <div className="how-it-works-page__hero">
        <picture>
          <source srcSet="/images/how_it_work_hero.webp" type="image/webp" />
          <img
            src="/images/how_it_work_hero.png"
            alt={t('hero.altText')}
            className="how-it-works-page__hero-image"
          />
        </picture>
        <div className="how-it-works-page__hero-content">
          <h1 className="how-it-works-page__hero-title">{t('hero.title')}</h1>
        </div>
      </div>

      {/* Transparency and Connection Section */}
      <div className="transparency-section">
        <div className="transparency-section__container">
          <div className="transparency-section__content">
            <h2>{t('transparency.title')}</h2>
            <p>
              {t('transparency.paragraph1')}
            </p>
            <p>
              {t('transparency.paragraph2')}
            </p>
          </div>
          <div className="transparency-section__illustration">
            <img src="/icons/globe_roots.png" alt="Globe with roots illustration" />
          </div>
        </div>
      </div>

      {/* For Farmers Section */}
      <div className="for-farmers-section">
        <h2 className="for-farmers-section__title">{t('forFarmers.title')}</h2>
        <p className="for-farmers-section__subtitle">
          {t('forFarmers.subtitle')}
        </p>
        <div className="work-cards">
          {farmersCards.map(card => (
            <WorkCard key={card.id} {...card} />
          ))}
        </div>
      </div>

      {/* For Companies Section */}
      <div className="for-companies-section">
        <h2 className="for-companies-section__title">{t('forCompanies.title')}</h2>
        <p className="for-companies-section__subtitle">
          {t('forCompanies.subtitle')}
        </p>
        <div className="work-cards">
          {companiesCards.map(card => (
            <WorkCard key={card.id} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
