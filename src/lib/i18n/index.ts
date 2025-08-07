/* eslint-disable @typescript-eslint/no-explicit-any */
import { browser } from "$app/environment";
import { init, locale as $locale, addMessages, dictionary } from "svelte-i18n";
import { SvelteSet } from "svelte/reactivity";
import { get } from "svelte/store";

const defaultLocale = "en";

const getAvailableLocales = () => {
    const modules = import.meta.glob("../../messages/*/*.json");
    const locales = new SvelteSet<string>();

    Object.keys(modules).forEach((path) => {
        const parts = path.split("/");
        const locale = parts[parts.length - 2];
        locales.add(locale);
    });

    return Array.from(locales);
};

const availableLocales = getAvailableLocales();

init({
    fallbackLocale: defaultLocale,
    initialLocale: browser ? window.navigator.language : defaultLocale,
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

export const loadLocale = async (lang: string) => {
    const modules = import.meta.glob<Record<string, any>>(`../../messages/**/*.json`);

    const imports = Object.entries(modules).map(async ([path, resolver]) => {
        const path_parts = path.split("/");
        const filename = path_parts.pop() || "";
        const path_lang = path_parts.pop() || "";

        if (path_lang !== lang) return;

        const namespace = filename.replace(".json", "");
        const module = await resolver();
        const msgs = module.default || module;

        addMessages(lang, { [namespace]: msgs });
    });

    await Promise.all(imports.filter(Boolean));
    $locale.set(lang);
};

export const locale = $locale;
export { availableLocales };
