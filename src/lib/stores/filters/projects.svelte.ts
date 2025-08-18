import { browser } from "$app/environment";
import type { ProjectFilters } from "libbearo";

export function create_project_filters_store() {
    const defaults: ProjectFilters = {
        name: "",
        tags: [],
    };

    let filters = $state<ProjectFilters>({ ...defaults });

    if (browser) {
        const stored = localStorage.getItem("project-filters");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                filters = { ...defaults, ...parsed };
            } catch {
                filters = { ...defaults };
            }
        }

        $effect(() => {
            localStorage.setItem("project-filters", JSON.stringify(filters));
        });
    }

    return {
        get filters() {
            return filters;
        },
        set filters(new_filters: ProjectFilters) {
            filters = new_filters;
        },
        update_filter<K extends keyof ProjectFilters>(key: K, value: ProjectFilters[K]) {
            filters[key] = value;
        },
    };
}
