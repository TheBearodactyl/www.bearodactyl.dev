/* eslint-disable @typescript-eslint/no-explicit-any */
import { browser } from "$app/environment";
import { init, locale as $locale, addMessages, dictionary } from "svelte-i18n";
import { SvelteSet } from "svelte/reactivity";
import { get } from "svelte/store";

const defaultLocale = "en";

const getAvailableLocales = () => {
    const modules = import.meta.glob("../../messages/**/*.json");
    const locales = new SvelteSet<string>();

    Object.keys(modules).forEach((path) => {
        const match = path.match(/messages\/([^/]+)/);
        if (match) {
            locales.add(match[1]);
        }
    });

    return Array.from(locales);
};

const availableLocales = getAvailableLocales();

const findBestLocale = (preferredLocale: string, availableLocales: string[]): string => {
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

    return availableLocales.includes(defaultLocale) ? defaultLocale : availableLocales[0];
};

let initialLocale = defaultLocale;

if (browser) {
    const storedLocale = localStorage.getItem("selected-locale");
    if (storedLocale && availableLocales.includes(storedLocale)) {
        initialLocale = storedLocale;
    } else {
        const browserLocale = window.navigator.language;
        initialLocale = findBestLocale(browserLocale, availableLocales);
    }
}

init({
    fallbackLocale: defaultLocale,
    initialLocale,
});

export const debugMessages = (locale?: string) => {
    const dict = get(dictionary);
    const current_locale = locale || Object.keys(dict)[0];

    if (!dict[current_locale]) {
        console.warn(`No messages found for locale: ${current_locale}`);
        console.log("Available locales:", Object.keys(dict));
        return;
    }

    console.group(`Available messages for locale: ${current_locale}`);

    const messages = dict[current_locale];
    const print_msgs = (obj: any, prefix = "") => {
        Object.entries(obj).forEach(([key, value]) => {
            const full_key = prefix ? `${prefix}.${key}` : key;
            if (typeof value === "object" && value !== null) {
                console.group(`${full_key}`);
                print_msgs(value, full_key);
                console.groupEnd();
            } else {
                console.log(`${full_key}:`, value);
            }
        });
    };

    print_msgs(messages);
    console.groupEnd();
};

const buildNestedObject = (path: string, value: any): any => {
    const parts = path.split("/").filter(Boolean);
    const result: any = {};

    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
        current[parts[i]] = {};
        current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
    return result;
};

const mergeDeep = (target: any, source: any): any => {
    const output = { ...target };

    if (source && typeof source === "object" && !Array.isArray(source)) {
        Object.keys(source).forEach((key) => {
            if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
                if (!(key in target)) {
                    output[key] = source[key];
                } else {
                    output[key] = mergeDeep(target[key], source[key]);
                }
            } else {
                output[key] = source[key];
            }
        });
    }

    return output;
};

export const loadLocale = async (lang: string) => {
    const modules = import.meta.glob<Record<string, any>>(`../../messages/**/*.json`);
    const localeMessages: any = {};
    const imports = Object.entries(modules).map(async ([path, resolver]) => {
        const localeMatch = path.match(/messages\/([^/]+)/);
        if (!localeMatch || localeMatch[1] !== lang) return;

        const relativePath = path.replace(`../../messages/${lang}/`, "");
        const pathWithoutExtension = relativePath.replace(".json", "");

        try {
            const module = await resolver();
            const msgs = module.default || module;
            const nestedStructure = buildNestedObject(pathWithoutExtension, msgs);

            // Merge into locale messages
            Object.keys(nestedStructure).forEach((key) => {
                if (localeMessages[key]) {
                    localeMessages[key] = mergeDeep(localeMessages[key], nestedStructure[key]);
                } else {
                    localeMessages[key] = nestedStructure[key];
                }
            });
        } catch (error) {
            console.warn(`Failed to load locale file: ${path}`, error);
        }
    });

    await Promise.all(imports.filter(Boolean));

    if (Object.keys(localeMessages).length > 0) {
        addMessages(lang, localeMessages);
    }

    $locale.set(lang);
};

export const locale = $locale;
export { availableLocales };
