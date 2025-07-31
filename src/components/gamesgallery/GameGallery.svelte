<script lang="ts">
    import { _ } from "svelte-i18n";

    import GalleryBackdrop from "../gallery/GalleryBackdrop.svelte";
    import GameGrid from "./GameGrid.svelte";
    import { useData } from "$lib/games/data.svelte";
    import { useDisplay } from "$lib/games/display.svelte";
    import { useFilters } from "$lib/games/filters.svelte";
    import GameExpandedCard from "./GameExpandedCard.svelte";
    import GameFilters from "./GameFilters.svelte";

    const data = useData();
    const display = useDisplay();
    const filters = useFilters(() => data.games);

    let isFilterCollapsed = $state(true);

    function toggleSearchMode() {
        isFilterCollapsed = !isFilterCollapsed;
    }

    const expandedBook = $derived(() => {
        if (display.expandedCard !== null) {
            return filters.filteredBooks.find((b) => b.id === display.expandedCard);
        }
    });

    function handleToggleCard(gameId: string | number) {
        display.toggleCard(gameId);
    }

    function handleCloseCard() {
        display.closeCard();
    }

    function handleUpdateFilters(newFilters: typeof filters.searchFilters) {
        filters.searchFilters = newFilters;
    }
</script>

<div class="book-gallery" class:idle-background={display.isIdle}>
    <h1 class="gallery-title">{$_("games-list")}</h1>

    <GameFilters
        searchFilters={filters.searchFilters}
        allGenres={filters.allGenres}
        allTags={filters.allTags}
        dropdowns={filters.dropdowns}
        filteredTagCounts={filters.filteredTagCounts}
        filteredGenreCounts={filters.filteredGenreCounts}
        bind:expandedInputRef={display.expandedInputRef}
        {isFilterCollapsed}
        onToggleDropdown={filters.toggleDropdown}
        onCloseDropdown={filters.closeDropdown}
        onToggleFilterItem={filters.toggleFilterItem}
        onClearAllFilters={filters.clearAllFilters}
        onToggleSearchMode={toggleSearchMode}
        onUpdateFilters={handleUpdateFilters}
        getViewMode={() => {
            return display.viewMode;
        }}
        setViewMode={display.setViewMode}
        toggleViewMode={display.toggleViewMode}
    />

    {#if data.isLoading}
        <div class="progress-wrapper">
            <div class="progress-bar">
                <div class="progress-fill" style="width: {data.downloadProgress}%"></div>
            </div>
            <p>loading... {data.downloadProgress}</p>
        </div>
    {/if}

    {#if data.fetchError}
        <div class="error-message">
            {$_("error-loading-list-fetcherror", { values: { err: data.fetchError } })}
        </div>
    {/if}

    {#if !data.isLoading && !data.fetchError}
        <GameGrid
            games={filters.filteredBooks}
            isContentVisible={data.isContentVisible}
            viewMode={display.viewMode}
            expandedCard={display.expandedCard}
            onToggleCard={handleToggleCard}
        />
    {/if}

    {#if display.expandedCard !== null && !data.isLoading && !data.fetchError && expandedBook}
        <GameExpandedCard game={expandedBook()!} onCloseCard={handleCloseCard} />
    {/if}

    <GalleryBackdrop show={display.expandedCard !== null} onClick={handleCloseCard} />
</div>

<style>
    :global {
        @import url("/src/assets/css/bookgallery.css");
    }
</style>
