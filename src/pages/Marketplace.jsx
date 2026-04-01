import { useTranslation } from 'react-i18next';
import './Marketplace.css';
import MarketplaceCard from '../components/MarketplaceCard';

/**
 * Marketplace Page
 *
 * Displays featured pilot project and available forest species
 */
const Marketplace = () => {
  const { t } = useTranslation('marketplace');

  const products = [
    // Pioneer Species
    {
      id: 1,
      title: 'Aroeira-vermelha',
      scientificName: 'Schinus terebinthifolius',
      available: 10,
      co2Total: '11000 kg',
      co2PerTree: '1100 kg CO2',
    },
    {
      id: 2,
      title: 'Chal-chal',
      scientificName: 'Allophylus edulis',
      available: 10,
      co2Total: '6000 kg',
      co2PerTree: '600 kg CO2',
    },
    {
      id: 3,
      title: 'Cambará',
      scientificName: 'Gochnatia polymorpha',
      available: 8,
      co2Total: '9600 kg',
      co2PerTree: '1200 kg CO2',
    },
    {
      id: 4,
      title: 'Farinha-seca',
      scientificName: 'Albizia niopoides',
      available: 8,
      co2Total: '9600 kg',
      co2PerTree: '1200 kg CO2',
    },
    {
      id: 5,
      title: 'Capororoca',
      scientificName: 'Myrsine spp.',
      available: 7,
      co2Total: '3100 kg',
      co2PerTree: '443 kg CO2',
    },
    {
      id: 6,
      title: 'Branquilho',
      scientificName: 'Sebastiania brasiliensis',
      available: 7,
      co2Total: '2400 kg',
      co2PerTree: '343 kg CO2',
    },
    // Secondary Species
    {
      id: 7,
      title: 'Guajuvira',
      scientificName: 'Patagonula americana',
      available: 6,
      co2Total: '8600 kg',
      co2PerTree: '1433 kg CO2',
    },
    {
      id: 8,
      title: 'Canjerana',
      scientificName: 'Cabralea canjerana',
      available: 6,
      co2Total: '12500 kg',
      co2PerTree: '2083 kg CO2',
    },
    {
      id: 9,
      title: 'Pitanga',
      scientificName: 'Eugenia uniflora',
      available: 6,
      co2Total: '2400 kg',
      co2PerTree: '400 kg CO2',
    },
    {
      id: 10,
      title: 'Guabiroba',
      scientificName: 'Campomanesia xanthocarpa',
      available: 4,
      co2Total: '3600 kg',
      co2PerTree: '900 kg CO2',
    },
    {
      id: 11,
      title: 'Uvaia',
      scientificName: 'Eugenia pyriformis',
      available: 4,
      co2Total: '2400 kg',
      co2PerTree: '600 kg CO2',
    },
    {
      id: 12,
      title: 'Araçá-amarelo',
      scientificName: 'Psidium cattleyanum',
      available: 4,
      co2Total: '1000 kg',
      co2PerTree: '250 kg CO2',
    },
    // Climax Species
    {
      id: 13,
      title: 'Imbuia',
      scientificName: 'Ocotea porosa',
      available: 4,
      co2Total: '11200 kg',
      co2PerTree: '2800 kg CO2',
    },
    {
      id: 14,
      title: 'Pau-ferro',
      scientificName: 'Libidibia ferrea',
      available: 4,
      co2Total: '8800 kg',
      co2PerTree: '2200 kg CO2',
    },
    {
      id: 15,
      title: 'Cedro',
      scientificName: 'Cedrela fissilis',
      available: 4,
      co2Total: '6600 kg',
      co2PerTree: '1650 kg CO2',
    },
    {
      id: 16,
      title: 'Angico-vermelho',
      scientificName: 'Parapiptadenia rigida',
      available: 3,
      co2Total: '4800 kg',
      co2PerTree: '1600 kg CO2',
    },
    {
      id: 17,
      title: 'Tarumã',
      scientificName: 'Vitex megapotamica',
      available: 2,
      co2Total: '2800 kg',
      co2PerTree: '1400 kg CO2',
    },
    {
      id: 18,
      title: 'Louro-pardo',
      scientificName: 'Cordia trichotoma',
      available: 1,
      co2Total: '1300 kg',
      co2PerTree: '1300 kg CO2',
    },
  ];

  return (
    <>
      {/* Hero Section - Similar to How It Works page */}
      <section className="marketplace-hero">
        <picture>
          <source srcSet="/images/marketplace_hero.webp" type="image/webp" />
          <img
            src="/images/marketplace_hero.png"
            alt={t('hero.altText')}
            className="marketplace-hero__image"
          />
        </picture>
        <div className="marketplace-hero__content">
          <h1 className="marketplace-hero__title">{t('hero.title')}</h1>
        </div>
      </section>

      {/* Featured Project Section */}
      <section className="featured-section">
        <div className="featured-section__container">
          {/* Featured Project Card */}
          <div className="featured-project">
            <div className="featured-project__icon">
              <img src="/icons/sunny.png" alt="Sun icon" />
            </div>

            <div className="featured-project__content">
              <h2 className="featured-project__title">
                {t('featuredProject.title')}
              </h2>
              <p className="featured-project__description">
                {t('featuredProject.description')}
              </p>

              <div className="featured-project__badges">
                <div className="featured-project__badge">
                  <img src="/icons/TreeEver_lightgreen.png" alt="Trees" className="featured-project__badge-icon" />
                  <span className="featured-project__badge-text">98 {t('featuredProject.badges.trees')}</span>
                </div>
                <div className="featured-project__badge">
                  <img src="/icons/plant_light_green.png" alt="Species" className="featured-project__badge-icon" />
                  <span className="featured-project__badge-text">18 {t('featuredProject.badges.species')}</span>
                </div>
                <span className="featured-project__badge featured-project__badge-status">
                  {t('featuredProject.badges.status')}
                </span>
              </div>
            </div>

            {/* Location Card */}
            <div className="featured-project__location">
              <div className="featured-project__location-icon">
                <img src="/icons/location.png" alt="Location" />
              </div>
              <div className="featured-project__location-text">
                <p className="featured-project__location-title">{t('featuredProject.location.name')}</p>
                <p className="featured-project__location-address">{t('featuredProject.location.address')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="marketplace-products">
        <div className="marketplace-products__container">
          <div className="marketplace-products__grid">
            {products.map((product) => (
              <MarketplaceCard
                key={product.id}
                title={product.title}
                scientificName={product.scientificName}
                available={product.available}
                co2Total={product.co2Total}
                co2PerTree={product.co2PerTree}
              />
            ))}

            {/* Contact/Sponsor Card */}
            <div className="marketplace-contact-card">
              <div className="marketplace-contact-card__content">
                <h3 className="marketplace-contact-card__title">
                  {t('contactCard.title')}
                </h3>
                <p className="marketplace-contact-card__description">
                  {t('contactCard.description')}
                </p>
                <a href={`mailto:${t('contactCard.email')}`} className="marketplace-contact-card__email">
                  {t('contactCard.email')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Marketplace;
