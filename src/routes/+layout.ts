import { SvelteSet } from "svelte/reactivity";
import { loadLocale } from "$lib/i18n";
import { waitLocale } from "svelte-i18n";
import { browser } from "$app/environment";
import type { LayoutLoad } from "./$types";

const getAvailableLocales = () => {
    const modules = import.meta.glob(
        "/src/messages/**/*.json",
    );
    const locales = new SvelteSet<string>();

    Object.keys(modules).forEach((path) => {
        const match = path.match(/messages\/([^/]+)/);
        if (match) {
            locales.add(match[1]);
        }
    });

    return Array.from(locales);
};

const findBestLocale = (
    preferredLocale: string,
    availableLocales: string[],
): string => {
    if (availableLocales.includes(preferredLocale)) {
        return preferredLocale;
    }

    const languageOnly = preferredLocale.split("-")[0];
    if (availableLocales.includes(languageOnly)) {
        return languageOnly;
    }

    const localeMap: Record<string, string> = {
        ja: "jp",
        "ja-JP": "jp",
        japanese: "jp",
    };

    const mapped = localeMap[preferredLocale.toLowerCase()];
    if (mapped && availableLocales.includes(mapped)) {
        return mapped;
    }

    return availableLocales.includes("en")
        ? "en"
        : availableLocales[0];
};

export const load: LayoutLoad = async () => {
    const available_locales = getAvailableLocales();

    let user_locale = "en";

    if (browser) {
        const storedLocale = localStorage.getItem(
            "selected-locale",
        );
        if (
            storedLocale &&
            available_locales.includes(storedLocale)
        ) {
            user_locale = storedLocale;
        } else {
            const browserLocale = window.navigator.language;
            user_locale = findBestLocale(
                browserLocale,
                available_locales,
            );
        }
    }

    const locale_to_load = findBestLocale(
        user_locale,
        available_locales,
    );

    await loadLocale(locale_to_load);
    await waitLocale();

    return {
        available_locales,
        currentLocale: locale_to_load,
    };
};

export const prerender = true;