import { useTranslation } from 'react-i18next';

/**
 * MarketplaceCard Component
 *
 * Displays a single marketplace product card with metrics
 */
const MarketplaceCard = ({
  title,
  scientificName,
  available,
  co2Total,
  co2PerTree,
}) => {
  const { t } = useTranslation('marketplace');

  return (
    <div className="marketplace-card">
      <div className="marketplace-card__body">
        <h3 className="marketplace-card__title">{title}</h3>
        <p className="marketplace-card__scientific">{scientificName}</p>

        <div className="marketplace-card__stats">
          <div className="marketplace-card__stat">
            <img src="/icons/TreeEver_green.png" alt="Trees" className="marketplace-card__stat-icon" />
            <span className="marketplace-card__stat-value">{available} {t('productCard.available')}</span>
          </div>
          <div className="marketplace-card__stat">
            <img src="/icons/plant_green.png" alt="CO2" className="marketplace-card__stat-icon" />
            <span className="marketplace-card__stat-value">{t('productCard.co2PerTree')}: {co2Total} total</span>
          </div>
          <div className="marketplace-card__stat">
            <img src="/icons/Flower.png" alt="Per tree" className="marketplace-card__stat-icon" />
            <span className="marketplace-card__stat-value">{co2PerTree} per tree</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceCard;
