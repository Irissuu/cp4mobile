import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import pt from '../locales/pt.json';
import en from '../locales/en.json';

const STORAGE_KEY = '@lang';

async function getSavedLang(): Promise<'pt' | 'en'> {
  try {
    const v = await AsyncStorage.getItem(STORAGE_KEY);
    if (v === 'pt' || v === 'en') return v;
  } catch {}
  return 'pt';
}


export async function changeLanguage(lng: 'pt' | 'en') {
  await i18n.changeLanguage(lng);
  await AsyncStorage.setItem(STORAGE_KEY, lng);
}


export async function ensureI18n() {
  const saved = await getSavedLang();

  if (!i18n.isInitialized) {
    await i18n
      .use(initReactI18next)
      .init({
        compatibilityJSON: 'v4',
        lng: saved,
        fallbackLng: 'pt',
        resources: {
          pt: { translation: pt },
          en: { translation: en },
        },
        interpolation: { escapeValue: false },
      });
  } else if (i18n.language !== saved) {
  
    await i18n.changeLanguage(saved);
  }

  return i18n;
}

export default i18n;
