<script lang="ts">
    import { _ } from "svelte-i18n";

    import GameGrid from "./GameGrid.svelte";
    import GameExpandedCard from "./GameExpandedCard.svelte";
    import GameFilters from "./GameFilters.svelte";
    import { use_games_data } from "$lib/gallery/data/games.svelte";
    import { use_games_display } from "$lib/gallery/display/games.svelte";
    import { filters } from "$lib/gallery/filters/games.svelte";
    import GalleryBackdrop from "../base/GalleryBackdrop.svelte";

    const data = use_games_data();
    const display = use_games_display();
    const game_filters = filters(() => data.games);

    let isFilterCollapsed = $state(true);

    function toggleSearchMode() {
        isFilterCollapsed = !isFilterCollapsed;
    }

    const expandedBook = $derived(() => {
        if (display.expanded_card !== null) {
            return game_filters.filtered_games.find((b) => b.id === display.expanded_card);
        }
    });

    function handleToggleCard(gameId: string | number) {
        display.toggle_card(gameId);
    }

    function handleCloseCard() {
        display.close_card();
    }

    function handleUpdateFilters(newFilters: typeof game_filters.search_filters) {
        game_filters.search_filters = newFilters;
    }
</script>

<div
    class="book-gallery"
    class:idle-background={display.is_idle}
>
    <h1 class="gallery-title">{$_("titles.routes.games")}</h1>

    <GameFilters
        searchFilters={game_filters.search_filters}
        allGenres={game_filters.all_genres}
        allTags={game_filters.all_tags}
        dropdowns={game_filters.dropdowns}
        filteredTagCounts={game_filters.filtered_tag_counts}
        filteredGenreCounts={game_filters.filtered_genre_counts}
        bind:expandedInputRef={display.expanded_input_ref}
        {isFilterCollapsed}
        onToggleDropdown={game_filters.toggle_dropdown}
        onCloseDropdown={game_filters.close_dropdown}
        onToggleFilterItem={game_filters.toggle_filter_item}
        onClearAllFilters={game_filters.clear_all_filters}
        onToggleSearchMode={toggleSearchMode}
        onUpdateFilters={handleUpdateFilters}
        getViewMode={() => {
            return display.view_mode;
        }}
        setViewMode={display.set_view_mode}
        toggleViewMode={display.toggle_view_mode}
    />

    {#if data.is_loading}
        <div class="progress-wrapper">
            <div class="progress-bar">
                <div
                    class="progress-fill"
                    style="width: {data.dl_progress}%"
                ></div>
            </div>
            <p>loading... {data.dl_progress}</p>
        </div>
    {/if}

    {#if data.fetch_err}
        <div class="error-message">
            {$_("indicators.list-load-error", { values: { err: data.fetch_err } })}
        </div>
    {/if}

    {#if !data.is_loading && !data.fetch_err}
        <GameGrid
            games={game_filters.filtered_games}
            isContentVisible={data.is_content_visible}
            viewMode={display.view_mode}
            expandedCard={display.expanded_card}
            onToggleCard={handleToggleCard}
        />
    {/if}

    {#if display.expanded_card !== null && !data.is_loading && !data.fetch_err && expandedBook}
        <GameExpandedCard
            game={expandedBook()!}
            onCloseCard={handleCloseCard}
        />
    {/if}

    <GalleryBackdrop
        show={display.expanded_card !== null}
        on_click={handleCloseCard}
    />
</div>

<style>
    :global {
        @import url("/src/assets/css/main.css");
    }
</style>
