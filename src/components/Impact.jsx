import './Impact.css'
import Button from './Button'
import CountUp from './CountUp'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Impact() {
  const { t } = useTranslation('home')
  const { locale } = useParams()
  const currentLocale = locale || 'en'

  return (
    <section className="impact">
      <div className="impact-hero">
        <div className="tree-counter">
          <div className="tree-icon">
            <img src="/images/tree-icon.png" alt="Tree icon" />
          </div>
          <div className="tree-count">
            <CountUp to={98} duration={2} />
          </div>
          <div className="tree-label">{t('impact.treeCounter.label')}</div>
        </div>

        <div className="impact-hero-content">
          <h2>{t('impact.heading')}</h2>
          <p>
            {t('impact.description')}
          </p>
          <Link to={`/${currentLocale}/marketplace`}>
            <Button variant="sage-terra">
              {t('impact.exploreProjects')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="why-invest">
        <h3>{t('impact.whyInvest.title')}</h3>
        <p>
          {t('impact.whyInvest.description')}
        </p>
      </div>

      <div className="feature-cards">
        <div className="feature-card">
          <h4>{t('impact.features.biodiversity.title')}</h4>
          <p>
            {t('impact.features.biodiversity.description')}
          </p>
        </div>

        <div className="feature-card">
          <h4>{t('impact.features.partnership.title')}</h4>
          <p>
            {t('impact.features.partnership.description')}
          </p>
        </div>

        <div className="feature-card">
          <h4>{t('impact.features.tracking.title')}</h4>
          <p>
            {t('impact.features.tracking.description')}
          </p>
        </div>
      </div>
    </section>
  )
}

export default Impact
