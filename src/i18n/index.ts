import type { AstroCookies } from 'astro';
import { translations, type Lang } from './translations';

export type { Lang };

/**
 * Read the preferred language from the `lang` cookie.
 * Falls back to 'es' if not set or invalid.
 */
export function getLang(cookies: AstroCookies): Lang {
  const value = cookies.get('lang')?.value;
  return value === 'en' || value === 'es' ? value : 'es';
}

/**
 * Return the full translation object for the given language.
 */
export function useTranslations(lang: Lang) {
  return translations[lang];
}
