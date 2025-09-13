import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import i18n from '../i18n/lang'; 

export type Lang = 'pt' | 'en';

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<Ctx | null>(null);

const STORAGE_KEY = '@lang';


let AsyncStorage: any = null;
try {

  AsyncStorage = require('@react-native-async-storage/async-storage');
} catch {
  AsyncStorage = null;
}

function normalize(l: string | undefined): Lang {
  return (l && l.toLowerCase().startsWith('en')) ? 'en' : 'pt';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(normalize(i18n.language));


  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage?.getItem?.(STORAGE_KEY);
        const initial = (saved === 'pt' || saved === 'en') ? (saved as Lang) : normalize(i18n.language);
        if (initial !== normalize(i18n.language)) {
          await i18n.changeLanguage(initial);
        }
        setLangState(initial);
      } catch {

        setLangState(normalize(i18n.language));
      }
    })();
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    i18n.changeLanguage(l);
    AsyncStorage?.setItem?.(STORAGE_KEY, l).catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === 'pt' ? 'en' : 'pt');
  }, [lang, setLang]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      i18n.t(key, { ...vars }),
    []
  );

  const value = useMemo(() => ({ lang, setLang, toggle, t }), [lang, setLang, toggle, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n deve ser usado dentro de <I18nProvider>');
  return ctx;
}
