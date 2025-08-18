<script lang="ts">
    import { _ } from "svelte-i18n";

    import Filters from "./BookFilters.svelte";
    import ExpandedCard from "./BookExpandedCard.svelte";
    import BookGrid from "./BookGrid.svelte";
    import { PersistedState } from "runed";
    import { use_books_data } from "$lib/gallery/data/books.svelte";
    import { use_books_display } from "$lib/gallery/display/books.svelte";
    import { filters } from "$lib/gallery/filters/books.svelte";
    import { show_explicit } from "$lib/stores/show_explicit.svelte";
    import GalleryBackdrop from "../base/GalleryBackdrop.svelte";

    let data = use_books_data();
    const display = use_books_display();
    const book_filters = filters(() => data.books);

    let is_filter_collapsed = $state(true);
    let dragged_book_id: string | number | null = $state(null);
    let dragged_over_book_id: string | number | null = $state(null);

    function toggle_search_mode() {
        is_filter_collapsed = !is_filter_collapsed;
    }

    const persisted_view_mode = new PersistedState<"masonry" | "list">("viewMode", "masonry");

    $effect(() => {
        display.set_view_mode(persisted_view_mode.current);
    });

    const expanded_book = $derived(() => {
        if (display.expanded_card !== null) {
            return book_filters.filtered_books.find((b) => b.id === display.expanded_card);
        }
    });

    function handleDragStart(bookId: string | number) {
        dragged_book_id = bookId;
    }

    function handleDragEnter(bookId: string | number) {
        if (dragged_book_id !== bookId) {
            dragged_over_book_id = bookId;
        }
    }

    function handleDragLeave() {
        dragged_over_book_id = null;
    }

    function handleDrop() {
        if (
            dragged_book_id === null ||
            dragged_over_book_id === null ||
            dragged_book_id === dragged_over_book_id
        ) {
            return;
        }

        const draggedBookIndex = book_filters.filtered_books.findIndex(
            (b) => b.id === dragged_book_id,
        );
        const draggedOverBookIndex = book_filters.filtered_books.findIndex(
            (b) => b.id === dragged_over_book_id,
        );
        const newBooks = [...book_filters.filtered_books];
        const [removed] = newBooks.splice(draggedBookIndex, 1);

        newBooks.splice(draggedOverBookIndex, 0, removed);
        data.books = newBooks;

        dragged_book_id = null;
        dragged_over_book_id = null;
    }

    function handleDragEnd() {
        dragged_book_id = null;
        dragged_over_book_id = null;
    }

    function handleToggleCard(bookId: string | number) {
        display.toggle_card(bookId);
    }

    function handleCloseCard() {
        display.close_card();
    }

    function handleUpdateFilters(newFilters: typeof book_filters.search_filters) {
        book_filters.search_filters = newFilters;
    }

    function handleAddGenreToFilters(genre: string) {
        book_filters.add_genre(genre);
    }

    function handleAddTagToFilters(tag: string) {
        book_filters.add_tag(tag);
    }
</script>

<div
    class="book-gallery"
    class:idle-background={display.is_idle}
>
    <h1 class="gallery-title">{$_("titles.routes.read-watch")}</h1>

    <Filters
        searchFilters={book_filters.search_filters}
        allGenres={book_filters.all_genres}
        allTags={book_filters.all_tags}
        dropdowns={book_filters.dropdowns}
        filteredTagCounts={book_filters.filtered_tag_counts}
        filteredGenreCounts={book_filters.filtered_genre_counts}
        bind:expandedInputRef={display.expanded_input_ref}
        isFilterCollapsed={is_filter_collapsed}
        onToggleDropdown={book_filters.toggle_dropdown}
        onCloseDropdown={book_filters.close_dropdown}
        onToggleFilterItem={book_filters.toggle_filter_item}
        onClearAllFilters={book_filters.clear_all_filters}
        onToggleSearchMode={toggle_search_mode}
        onUpdateFilters={handleUpdateFilters}
        setViewMode={display.set_view_mode}
        toggleViewMode={display.toggle_view_mode}
        getViewMode={() => {
            return display.view_mode;
        }}
    />

    {#if data.is_loading}
        <div class="progress-wrapper">
            <div class="progress-bar">
                <div
                    class="progress-fill"
                    style="width: {data.dl_progress}%"
                ></div>
            </div>
            <p>{$_("indicators.loading", { values: { progress: data.dl_progress } })}</p>
        </div>
    {/if}

    {#if data.fetch_err}
        <div class="error-message">
            {$_("indicators.list-load-error", { values: { err: data.fetch_err } })}
        </div>
    {/if}

    {#if !data.is_loading && !data.fetch_err}
        <BookGrid
            showExplicit={$show_explicit}
            books={book_filters.filtered_books}
            isContentVisible={data.is_content_visible}
            viewMode={display.view_mode}
            expandedCard={display.expanded_card}
            onToggleCard={handleToggleCard}
            onAddGenreToFilters={handleAddGenreToFilters}
            onAddTagToFilters={handleAddTagToFilters}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            draggedBookId={dragged_book_id}
            draggedOverBookId={dragged_over_book_id}
        />
    {/if}

    {#if display.expanded_card !== null && !data.is_loading && !data.fetch_err && expanded_book}
        <ExpandedCard
            book={expanded_book()!}
            on_close_card={handleCloseCard}
            on_add_genre_to_filters={handleAddGenreToFilters}
            on_add_tag_to_filters={handleAddTagToFilters}
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
