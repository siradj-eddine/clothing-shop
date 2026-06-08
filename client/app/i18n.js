import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../public/locales/en/common.json';
import ar from '../public/locales/ar/common.json';
import fr from '../public/locales/fr/common.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
  fr: { translation: fr },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;