import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import './Hero.css';
import Button from './Button';

/**
 * Hero Component
 *
 * Full-width hero section with background image and centered content
 */
const Hero = () => {
  const { t } = useTranslation('home');
  const { locale } = useParams();
  const currentLocale = locale || 'en';

  return (
    <section className="hero">
      <div className="hero__content">
        <h1 className="hero__title">
          Plant Today
          <br />
          Forest Tomorrow
        </h1>
        <div className="hero__actions">
          <Button variant="sage-terra" to={`/${currentLocale}/marketplace`}>{t('hero.exploreMarketplace')}</Button>
          <Button variant="light-dark" to={`/${currentLocale}/how-it-works`}>{t('hero.learnMore')}</Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
