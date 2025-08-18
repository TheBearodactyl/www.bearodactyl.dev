import { browser } from "$app/environment";
import type { BookFilters } from "libbearo";

export function create_book_filters_store() {
    const defaults: BookFilters = {
        title: "",
        author: "",
        genres: [],
        tags: [],
        rating: null,
        status: "",
    };

    let filters = $state<BookFilters>({ ...defaults });

    if (browser) {
        const stored = localStorage.getItem("book-filters");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                filters = { ...defaults, ...parsed };
            } catch {
                filters = { ...defaults };
            }
        }

        $effect(() => {
            localStorage.setItem("book-filters", JSON.stringify(filters));
        });
    }

    return {
        get filters() {
            return filters;
        },
        set filters(new_filters: BookFilters) {
            filters = new_filters;
        },
        get defaults() {
            return defaults
        },
        update_filter<K extends keyof BookFilters>(key: K, value: BookFilters[K]) {
            filters[key] = value;
        },
    };
}
