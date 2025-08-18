import { create_project_filters_store } from "$lib/stores/filters/projects.svelte";
import Fuse from "fuse.js";
import type { Project, ProjectFilters } from "libbearo";
import { SvelteMap, SvelteSet } from "svelte/reactivity";

export function filters(allProjects: () => Project[]) {
    const storage = create_project_filters_store();
    const dropdowns = $state({ tags: false });
    const hasSearch = $derived(storage.filters.name.trim().length > 0);

    const fuse = $derived(() => {
        return new Fuse(allProjects(), {
            keys: ["name", "description", "tags"],
            threshold: 0.3,
        });
    });

    const allTags = $derived(() => {
        const tags = new SvelteSet<string>();
        for (const project of allProjects()) {
            for (const tag of project.tags || []) tags.add(tag);
        }
        return [...tags].sort();
    });

    const filteredProjects = $derived(() => {
        let result = allProjects();

        if (hasSearch) {
            const query = storage.filters.name.trim();
            result = fuse()
                .search(query)
                .map(({ item }) => item);
        }

        return result.filter((project) => {
            const tagMatch =
                storage.filters.tags.length === 0 ||
                (project.tags && storage.filters.tags.every((tag) => project.tags?.includes(tag)));
            return tagMatch;
        });
    });

    const filteredTagCounts = $derived(() => {
        const tagCountMap = new SvelteMap<string, number>();
        const selectedTags = new SvelteSet(storage.filters.tags);

        const projectsBeforeCurrentTagFilter = allProjects().filter((project) => {
            if (!hasSearch) return true;
            const query = storage.filters.name.trim();
            return fuse()
                .search(query)
                .some((result) => result.item.name === project.name);
        });

        for (const project of projectsBeforeCurrentTagFilter) {
            for (const tag of project.tags || []) {
                if (!selectedTags.has(tag)) {
                    tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1);
                }
            }
        }

        return [...tagCountMap.entries()].sort((a, b) => b[1] - a[1]);
    });

    function toggleDropdown(type: keyof typeof dropdowns) {
        dropdowns[type] = !dropdowns[type];
    }

    function closeDropdown(type: keyof typeof dropdowns) {
        dropdowns[type] = false;
    }

    function openDropdown(type: keyof typeof dropdowns) {
        dropdowns[type] = true;
    }

    function toggleFilterTag(tag: string) {
        const arr = storage.filters.tags;
        const idx = arr.indexOf(tag);
        if (idx === -1) {
            arr.push(tag);
        } else {
            arr.splice(idx, 1);
        }
        storage.filters = { ...storage.filters };
    }

    function delayedCloseDropdown(type: keyof typeof dropdowns) {
        setTimeout(() => {
            closeDropdown(type);
        }, 150);
    }

    return {
        get searchFilters() {
            return storage.filters;
        },
        set searchFilters(value: ProjectFilters) {
            storage.filters = value;
        },
        get allTags() {
            return allTags;
        },
        get filteredProjects() {
            return filteredProjects;
        },
        get dropdowns() {
            return dropdowns;
        },
        get filteredTagCounts() {
            return filteredTagCounts;
        },
        toggleDropdown,
        closeDropdown,
        openDropdown,
        toggleFilterTag,
        delayedCloseDropdown,
        updateFilter: storage.update_filter,
    };
}
