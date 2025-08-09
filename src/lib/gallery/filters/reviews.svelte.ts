import { create_review_filters_store } from "$lib/stores/filters/reviews.svelte";
import type { Review, ReviewFilters } from "$lib/types";
import Fuse from "fuse.js";
import { SvelteMap } from "svelte/reactivity";

export function filters(all_reviews: () => Review[]) {
    const storage = create_review_filters_store();
    const dropdowns = $state({ rating: false });

    const has_search = $derived(storage.filters.search.trim().length > 0);

    const fuse = $derived(() => {
        return new Fuse(all_reviews(), {
            keys: ["chapter", "description", "thoughts"],
            threshold: 0.3,
        });
    });

    const filtered_reviews = $derived(() => {
        let result = all_reviews();

        if (has_search) {
            const query = storage.filters.search.trim();
            result = fuse()
                .search(query)
                .map(({ item }) => item);
        }

        if (storage.filters.minRating !== undefined) {
            result = result.filter((r) => r.rating >= storage.filters.minRating!);
        }

        if (storage.filters.maxRating !== undefined) {
            result = result.filter((r) => r.rating <= storage.filters.maxRating!);
        }

        return result;
    });

    const rating_counts = $derived(() => {
        const count_map = new SvelteMap<number, number>();

        for (const review of all_reviews()) {
            const rating = review.rating;
            count_map.set(rating, (count_map.get(rating) || 0) + 1);
        }

        return [...count_map.entries()].sort((a, b) => b[0] - a[0]);
    });

    function toggle_dropdown(type: keyof typeof dropdowns) {
        dropdowns[type] = !dropdowns[type];
    }

    function close_dropdown(type: keyof typeof dropdowns) {
        dropdowns[type] = false;
    }

    function open_dropdown(type: keyof typeof dropdowns) {
        dropdowns[type] = true;
    }

    function delayed_close_dropdown(type: keyof typeof dropdowns) {
        setTimeout(() => {
            close_dropdown(type);
        }, 150);
    }

    return {
        get search_filters() {
            return storage.filters;
        },
        set search_filters(value: ReviewFilters) {
            storage.filters = value;
        },
        get filtered_reviews() {
            return filtered_reviews;
        },
        get dropdowns() {
            return dropdowns;
        },
        get rating_counts() {
            return rating_counts;
        },
        toggle_dropdown,
        close_dropdown,
        open_dropdown,
        delayed_close_dropdown,
        update_filter: storage.update_filter,
    };
}
