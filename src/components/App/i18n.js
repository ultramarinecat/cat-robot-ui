//
// i18n
// Configures i18n, adds en and es translations
//

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/common.json';
import es from './locales/es/common.json';

i18n
  .use(LanguageDetector) // detect language
  .use(initReactI18next)
  .init({
    resources: { cat: 'meow' }, // (needs to initialize with a resource)
    fallbackLng: 'en', // default lang
    keySeparator: false,
    interpolation: {
      escapeValue: false
    }
  });

// add english and spanish translations
i18n.addResources('en', 'translation', en);
i18n.addResources('es', 'translation', es);

export default i18n;
