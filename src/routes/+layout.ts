import { browser } from "$app/environment";
import { SvelteSet } from "svelte/reactivity";
import type { LayoutLoad } from "./$types";
import { loadLocale } from "$lib/i18n";
import { waitLocale } from "svelte-i18n";

const getAvailableLocales = () => {
    const modules = import.meta.glob("../messages/*/*.json");
    const locales = new SvelteSet<string>();

    Object.keys(modules).forEach((path) => {
        const parts = path.split("/");
        const locale = parts[parts.length - 2];
        locales.add(locale);
    });

    return Array.from(locales);
};

const getUserPreferredLocale = (available_locales: string[]) => {
    if (browser) {
        const browserLang = window.navigator.language.split("-")[0]; // e.g., "en-US" -> "en"
        if (available_locales.includes(browserLang)) {
            return browserLang;
        }
    }

    return available_locales.includes("en") ? "en" : available_locales[0];
};

export const load: LayoutLoad = async () => {
    const available_locales = getAvailableLocales();
    const user_locale = getUserPreferredLocale(available_locales);

    await loadLocale(user_locale);
    await waitLocale();

    return {
        available_locales,
        currentLocale: user_locale,
    };
};

export const prerender = true;
