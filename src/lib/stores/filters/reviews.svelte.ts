import { browser } from "$app/environment";
import type { ReviewFilters } from "libbearo";

export function create_review_filters_store() {
    const defaults: ReviewFilters = {
        search: "",
        minRating: undefined,
        maxRating: undefined,
    };

    let filters = $state<ReviewFilters>({ ...defaults });

    if (browser) {
        const stored = localStorage.getItem("review-filters");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                filters = { ...defaults, ...parsed };
            } catch {
                filters = { ...defaults };
            }
        }

        $effect(() => {
            localStorage.setItem("review-filters", JSON.stringify(filters));
        });
    }

    return {
        get filters() {
            return filters;
        },
        set filters(new_filters: ReviewFilters) {
            filters = new_filters;
        },
        update_filter<K extends keyof ReviewFilters>(key: K, value: ReviewFilters[K]) {
            filters[key] = value;
        },
    };
}
