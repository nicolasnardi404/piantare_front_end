import './Header.css';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * Header Component
 *
 * Main navigation header with logo, nav links, and language selector
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation('common');
  const { locale } = useParams();
  const currentLocale = locale || 'en';

  const navLinks = [
    { label: t('header.nav.aboutUs'), href: `/${currentLocale}/about-us`, isHash: false },
    { label: t('header.nav.marketplace'), href: `/${currentLocale}/marketplace`, isHash: false },
    { label: t('header.nav.howItWorks'), href: `/${currentLocale}/how-it-works`, isHash: false },
    // { label: 'impacto', href: '#impacto', isHash: true },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      {isMenuOpen && (
        <div className="header__overlay" onClick={closeMenu}></div>
      )}
      <div className="header__container">
        <div className="header__logo">
          <Link to={`/${currentLocale}`} className="header__logo-link">
            {t('header.logo')}
          </Link>
        </div>

        <nav className={`header__nav ${isMenuOpen ? 'header__nav--open' : ''}`}>
          {navLinks.map((link) => (
            link.isHash ? (
              <a
                key={link.label}
                href={link.href}
                className="header__nav-link"
                onClick={closeMenu}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="header__nav-link"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            )
          ))}
          <LanguageSwitcher className="header__lang-button--mobile" />
        </nav>

        <div className="header__actions">
          <LanguageSwitcher className="header__lang-button--desktop" />
          <button
            className="header__menu-toggle"
            onClick={toggleMenu}
            aria-label={t('header.menuToggle')}
          >
            <span className={`header__menu-icon ${isMenuOpen ? 'header__menu-icon--open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
