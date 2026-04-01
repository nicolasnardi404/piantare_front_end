import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

/**
 * LanguageSwitcher Component
 *
 * Dropdown menu for switching between languages (EN, PT, IT)
 * Updates the URL locale and i18next language
 */
const LanguageSwitcher = ({ className = '' }) => {
  const { i18n, t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'EN', fullLabel: t('languages.en') },
    { code: 'pt', label: 'PT', fullLabel: t('languages.pt') },
    { code: 'it', label: 'IT', fullLabel: t('languages.it') },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (langCode) => {
    // Update i18next language
    i18n.changeLanguage(langCode);

    // Save to localStorage
    localStorage.setItem('apeforest-language', langCode);

    // Update URL
    const pathSegments = location.pathname.split('/').filter(Boolean);

    // Check if first segment is a language code
    const firstSegment = pathSegments[0];
    const isLocaleInPath = ['en', 'pt', 'it'].includes(firstSegment);

    let newPath;
    if (isLocaleInPath) {
      // Replace existing locale
      pathSegments[0] = langCode;
      newPath = '/' + pathSegments.join('/');
    } else {
      // Add locale to beginning
      newPath = '/' + langCode + location.pathname;
    }

    navigate(newPath);
    setIsOpen(false);
  };

  return (
    <div className={`language-switcher ${className}`} ref={dropdownRef}>
      <button
        className="language-switcher__button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="language-switcher__current">{currentLanguage.label}</span>
        <svg
          className={`language-switcher__arrow ${isOpen ? 'language-switcher__arrow--open' : ''}`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="language-switcher__dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-switcher__option ${
                lang.code === currentLanguage.code ? 'language-switcher__option--active' : ''
              }`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="language-switcher__option-code">{lang.label}</span>
              <span className="language-switcher__option-label">{lang.fullLabel}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
