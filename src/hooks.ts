import type { Handle, Reroute, Transport } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';

export const handleLocale: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get('accept-language')?.split(',')[0];

	if (lang) {
		locale.set(lang);
	}

	return resolve(event);
};

export const reroute: Reroute = ({ url }) => {
	if (url.pathname) {
		return url.pathname;
	}
};

export const transport: Transport = {};