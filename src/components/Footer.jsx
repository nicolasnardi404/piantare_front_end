import './Footer.css'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

function Footer() {
  const { t } = useTranslation('common')
  const { locale } = useParams()
  const currentLocale = locale || 'en'

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">
          <h3 className="footer__logo">{t('footer.logo')}</h3>
          <p className="footer__tagline">
            {t('footer.tagline')}
          </p>
        </div>

        <div className="footer__links-container">
          <div className="footer__section">
            <h4 className="footer__heading">{t('footer.quickLinks.title')}</h4>
            <ul className="footer__links">
              <li><a href={`/${currentLocale}/about-us`}>{t('footer.quickLinks.aboutUs')}</a></li>
              {/* <li><a href="#impacto">{t('footer.quickLinks.impact')}</a></li> */}
              <li><a href={`/${currentLocale}/marketplace`}>{t('footer.quickLinks.marketplace')}</a></li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__heading">{t('footer.contact.title')}</h4>
            <a href={`mailto:${t('footer.contact.email')}`} className="footer__email">
              {t('footer.contact.email')}
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  )
}

export default Footer
