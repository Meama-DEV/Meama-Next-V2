import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import ka from '~/locales/ka.json';
import en from '~/locales/en.json';
import ru from '~/locales/ru.json';

type LocaleKey = 'ka' | 'en' | 'ru';

const dictionaries: Record<LocaleKey, unknown> = {
  ka,
  en,
  ru,
};

type I18nContextValue = {
  locale: LocaleKey;
  setLocale: (locale: LocaleKey) => void;
  t: (path: string, fallback?: string) => string;
  get: <T = unknown>(path: string, fallback: T) => T;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function resolvePath<T = unknown>(
  obj: unknown,
  path: string,
  fallback: T,
): T {
  if (!obj) return fallback;
  const parts = path.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return fallback;
    }
  }
  return (current as T) ?? fallback;
}

function detectInitialLocale(): LocaleKey {
  if (typeof window === 'undefined') return 'ka';
  const saved = window.localStorage.getItem('locale') as LocaleKey | null;
  if (saved && saved in dictionaries) return saved;

  const navigatorLang = window.navigator.language.toLowerCase();
  if (navigatorLang.startsWith('ka')) return 'ka';
  if (navigatorLang.startsWith('ru')) return 'ru';
  return 'en';
}

export function I18nProvider({children}: {children: React.ReactNode}) {
  const [locale, setLocaleState] = useState<LocaleKey>(() => detectInitialLocale());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('locale', locale);
  }, [locale]);

  const setLocale = useCallback((value: LocaleKey) => {
    setLocaleState(value);
  }, []);

  const get = useCallback(
    <T,>(path: string, fallback: T): T => {
      return resolvePath<T>(dictionaries[locale], path, fallback);
    },
    [locale],
  );

  const t = useCallback(
    (path: string, fallback = path) => {
      const value = resolvePath<string>(dictionaries[locale], path, fallback);
      return typeof value === 'string' ? value : fallback;
    },
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      get,
    }),
    [get, locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}


