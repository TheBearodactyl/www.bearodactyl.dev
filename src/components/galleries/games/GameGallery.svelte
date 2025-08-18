<script lang="ts">
    import { _ } from "svelte-i18n";

    import GameGrid from "./GameGrid.svelte";
    import GameExpandedCard from "./GameExpandedCard.svelte";
    import GameFilters from "./GameFilters.svelte";
    import { games_data, use_games_data } from "$lib/gallery/data/games.svelte";
    import { use_games_display } from "$lib/gallery/display/games.svelte";
    import { filters } from "$lib/gallery/filters/games.svelte";
    import GalleryBackdrop from "../base/GalleryBackdrop.svelte";
    import { scroll_to_top } from "libbearo";

    const data = use_games_data();
    const display = use_games_display();
    const game_filters = filters(() => data.games);
    let hell_naw: HTMLAudioElement | null = null;

    let is_filter_collapsed = $state(true);
    let show_fuckass_video = $state(false);
    let fuckass_video: HTMLVideoElement | null = $state(null);

    function toggle_search_mode() {
        is_filter_collapsed = !is_filter_collapsed;
    }

    const expanded_book = $derived(() => {
        if (display.expanded_card !== null) {
            return game_filters.filtered_games.find((b) => b.id === display.expanded_card);
        }
    });

    function handle_toggle_card(game_id: string | number) {
        const clicked_game = games_data.games.find((game) => game.id === game_id);

        if (clicked_game?.bad) {
            if (show_fuckass_video) {
                show_fuckass_video = false;
            } else {
                show_fuckass_video = true;
                scroll_to_top();
                setTimeout(() => {
                    if (fuckass_video) {
                        fuckass_video.play().catch(() => {
                            console.warn("failed to play video");
                        });
                    }
                }, 100);
            }
        } else {
            display.toggle_card(game_id);
        }
    }

    function handle_close_card() {
        display.close_card();
    }

    function handle_update_filters(newFilters: typeof game_filters.search_filters) {
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
        isFilterCollapsed={is_filter_collapsed}
        onToggleDropdown={game_filters.toggle_dropdown}
        onCloseDropdown={game_filters.close_dropdown}
        onToggleFilterItem={game_filters.toggle_filter_item}
        onClearAllFilters={game_filters.clear_all_filters}
        onToggleSearchMode={toggle_search_mode}
        onUpdateFilters={handle_update_filters}
        getViewMode={() => {
            return display.view_mode;
        }}
        setViewMode={display.set_view_mode}
        toggleViewMode={display.toggle_view_mode}
    />

    {#if show_fuckass_video}
        <div class="fuckass-video-container">
            <video
                bind:this={fuckass_video}
                muted
                autoplay
                preload="auto"
                class="fuckass-video"
                onended={() => {
                    show_fuckass_video = false;
                    if (hell_naw) {
                        hell_naw.pause();
                        hell_naw.currentTime = 0;
                    }
                }}
                onclick={() => {
                    show_fuckass_video = false;
                    if (hell_naw) {
                        hell_naw.pause();
                        hell_naw.currentTime = 0;
                    }
                }}
            >
                <source
                    src="/videos/hellnah.mp4"
                    type="video/webm"
                />
                Your browser does not support the video tag.
            </video>
        </div>
    {/if}

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
            onToggleCard={async (id) => {
                handle_toggle_card(id);

                const clicked_game = games_data.games.find((game) => game.id === id);
                if (clicked_game?.bad) {
                    try {
                        hell_naw = new Audio("/audio/hellnah.mp3");
                        await hell_naw.play();
                    } catch {
                        console.warn("failed to play");
                    }
                }
            }}
        />
    {/if}

    {#if display.expanded_card !== null && !data.is_loading && !data.fetch_err && expanded_book}
        <GameExpandedCard
            game={expanded_book()!}
            onCloseCard={handle_close_card}
        />
    {/if}

    <GalleryBackdrop
        show={display.expanded_card !== null}
        on_click={handle_close_card}
    />
</div>

<style>
    :global {
        @import url("/src/assets/css/main.css");
    }

    .fuckass-video-container {
        display: flex;
    }

    .fuckass-video {
        position: fixed;
        top: 0px;
        right: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        object-fit: fill;
    }
</style>
