<script lang="ts">
    import FilterPill from "../gallery/FilterPill.svelte";
    import MultiSelectDropdown from "../gallery/MultiSelectDropdown.svelte";
    import { _ } from "svelte-i18n";
    import { fade, slide } from "svelte/transition";

    export interface Filters {
        title: string;
        developer: string;
        status: string;
        rating: number | null;
        genres: string[];
        tags: string[];
    }

    interface Props {
        searchFilters: Filters;
        allGenres: string[];
        allTags: string[];
        dropdowns: Record<string, boolean>;
        isFilterCollapsed: boolean;
        filteredTagCounts: [string, number][];
        filteredGenreCounts: [string, number][];
        expandedInputRef?: HTMLElement | null;
        onToggleDropdown: (type: "genres" | "tags") => void;
        onCloseDropdown: (type: "genres" | "tags") => void;
        onToggleFilterItem: (type: "genres" | "tags", item: string) => void;
        onClearAllFilters: () => void;
        onToggleSearchMode: () => void;
        onUpdateFilters: (filters: Filters) => void;
    }

    let {
        searchFilters,
        allGenres,
        allTags,
        dropdowns,
        isFilterCollapsed,
        filteredTagCounts,
        filteredGenreCounts,
        expandedInputRef = $bindable(),
        onToggleDropdown,
        onCloseDropdown,
        onToggleFilterItem,
        onClearAllFilters,
        onToggleSearchMode,
        onUpdateFilters
    }: Props = $props();

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "ArrowLeft") {
            onToggleSearchMode();
        }
    }

    function updateTitle(value: string) {
        onUpdateFilters({ ...searchFilters, title: value });
    }

    function updateAuthor(value: string) {
        onUpdateFilters({ ...searchFilters, developer: value });
    }

    function updateStatus(value: string) {
        onUpdateFilters({ ...searchFilters, status: value });
    }

    function updateRating(value: number | null) {
        onUpdateFilters({ ...searchFilters, rating: value });
    }
</script>

{#if isFilterCollapsed}
    <div in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
        <!-- svelte-ignore attribute_illegal_colon -->
        <FilterPill
            modelValue={searchFilters.title}
            onupdate:modelValue={updateTitle}
            ontoggle-search-mode={onToggleSearchMode}
        />
    </div>
{:else}
    <div class="filter-bar" in:slide={{ duration: 300 }} out:slide={{ duration: 300 }}>
        <div class="filter-bar-header">
            <h2 class="filter-heading">{$_("title")}</h2>
            <button class="collapse-btn" onclick={onToggleSearchMode}>⨯</button>
        </div>

        <input
            bind:this={expandedInputRef}
            bind:value={searchFilters.title}
            placeholder={$_("search-title")}
            onkeydown={handleKeydown}
            oninput={(e) => updateTitle(e.currentTarget.value)}
        />

        <input
            bind:value={searchFilters.developer}
            placeholder={$_("search-developer")}
            oninput={(e) => updateAuthor(e.currentTarget.value)}
        />

        <select
            bind:value={searchFilters.status}
            onchange={(e) => updateStatus(e.currentTarget.value)}
        >
            <option value="">{$_("gallery.filters.any-status")}</option>
            <option value="Playing">Playing</option>
            <option value="Finished">Finished</option>
            <option value="Plan to Play">Plan to Play</option>
            <option value="Dropped">Dropped</option>
        </select>

        <select
            bind:value={searchFilters.rating}
            onchange={(e) =>
                updateRating(e.currentTarget.value ? Number(e.currentTarget.value) : null)}
        >
            <option value="">{$_("gallery.filters.any-rating")}</option>
            {#each [1, 2, 3, 4, 5, 10, 20, 30, 40, 50] as r}
                <option value={r}>{$_("rating", { values: { rating: r } })}</option>
            {/each}
        </select>

        <MultiSelectDropdown
            label={$_("genres")}
            items={filteredGenreCounts.map(([genre, count]) => ({ value: genre, count }))}
            selectedItems={searchFilters.genres}
            isOpen={dropdowns.genres}
            placeholder={$_("select-genres")}
            noItemsMessage="No genres available"
            ontoggle={() => onToggleDropdown("genres")}
            onclose={() => onCloseDropdown("genres")}
            ontoggle-item={(genre) => onToggleFilterItem("genres", genre)}
        />

        <MultiSelectDropdown
            label={$_("tags")}
            items={filteredTagCounts.map(([tag, count]) => ({ value: tag, count }))}
            selectedItems={searchFilters.tags}
            isOpen={dropdowns.tags}
            placeholder={$_("select-tags")}
            noItemsMessage="No tags available"
            ontoggle={() => onToggleDropdown("tags")}
            onclose={() => onCloseDropdown("tags")}
            ontoggle-item={(tag) => onToggleFilterItem("tags", tag)}
        />

        <button class="clear-filters-btn" onclick={onClearAllFilters}>
            {$_("clear-filters")}
        </button>
    </div>
{/if}
