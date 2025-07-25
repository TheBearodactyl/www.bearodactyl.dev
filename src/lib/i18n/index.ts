import { browser } from '$app/environment';
import { init, register, locale as $locale, locales as $availableLocales } from 'svelte-i18n';

const defaultLocale = 'en';

register('en', () => import('../../messages/en.json'));
register('jp', () => import('../../messages/jp.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale
});

export const locale = $locale;
export const availableLocales = $availableLocales;
