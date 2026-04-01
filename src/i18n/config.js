import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import commonEN from './locales/en/common.json';
import homeEN from './locales/en/home.json';
import aboutEN from './locales/en/about.json';
import howItWorksEN from './locales/en/howItWorks.json';
import marketplaceEN from './locales/en/marketplace.json';

import commonPT from './locales/pt/common.json';
import homePT from './locales/pt/home.json';
import aboutPT from './locales/pt/about.json';
import howItWorksPT from './locales/pt/howItWorks.json';
import marketplacePT from './locales/pt/marketplace.json';

import commonIT from './locales/it/common.json';
import homeIT from './locales/it/home.json';
import aboutIT from './locales/it/about.json';
import howItWorksIT from './locales/it/howItWorks.json';
import marketplaceIT from './locales/it/marketplace.json';

const resources = {
  en: {
    common: commonEN,
    home: homeEN,
    about: aboutEN,
    howItWorks: howItWorksEN,
    marketplace: marketplaceEN,
  },
  pt: {
    common: commonPT,
    home: homePT,
    about: aboutPT,
    howItWorks: howItWorksPT,
    marketplace: marketplacePT,
  },
  it: {
    common: commonIT,
    home: homeIT,
    about: aboutIT,
    howItWorks: howItWorksIT,
    marketplace: marketplaceIT,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS: 'common',
    fallbackLng: 'en',
    lng: 'en',
    supportedLngs: ['en', 'pt', 'it'],

    detection: {
      order: ['path', 'localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupFromPathIndex: 0,
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
