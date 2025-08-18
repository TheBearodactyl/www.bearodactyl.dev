import { browser } from "$app/environment";
import type { GameFilters } from "libbearo";

export function create_game_filters_store() {
    const defaults: GameFilters = {
        title: "",
        developer: "",
        genres: [],
        tags: [],
        rating: null,
        status: "",
    };

    let filters = $state<GameFilters>({ ...defaults });

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
            localStorage.setItem("game-filters", JSON.stringify(filters));
        });
    }

    return {
        get filters() {
            return filters;
        },
        set filters(new_filters: GameFilters) {
            filters = new_filters;
        },
        get defaults() {
            return defaults;
        },
        update_filter<K extends keyof GameFilters>(key: K, value: GameFilters[K]) {
            filters[key] = value;
        },
    };
}
