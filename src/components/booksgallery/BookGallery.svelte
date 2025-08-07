<script lang="ts">
    import { _ } from "svelte-i18n";

    import GalleryBackdrop from "../gallery/GalleryBackdrop.svelte";
    import Filters from "./BookFilters.svelte";
    import ExpandedCard from "./BookExpandedCard.svelte";
    import { useData } from "$lib/books/data.svelte";
    import { useDisplay } from "$lib/books/display.svelte";
    import { useFilters } from "$lib/books/filters.svelte";
    import BookGrid from "./BookGrid.svelte";
    import { PersistedState } from "runed";
    import { show_explicit } from "$lib/stores/show_explicit";

    let data = useData();
    const display = useDisplay();
    const filters = useFilters(() => data.books);

    let isFilterCollapsed = $state(true);
    let draggedBookId: string | number | null = $state(null);
    let draggedOverBookId: string | number | null = $state(null);

    function toggleSearchMode() {
        isFilterCollapsed = !isFilterCollapsed;
    }

    const persistedViewMode = new PersistedState<"masonry" | "list">("viewMode", "masonry");

    $effect(() => {
        display.setViewMode(persistedViewMode.current);
    });

    $effect(() => {
        persistedViewMode.current = display.viewMode;
    });

    const expandedBook = $derived(() => {
        if (display.expandedCard !== null) {
            return filters.filteredBooks.find((b) => b.id === display.expandedCard);
        }
    });

    function handleDragStart(bookId: string | number) {
        draggedBookId = bookId;
    }

    function handleDragEnter(bookId: string | number) {
        if (draggedBookId !== bookId) {
            draggedOverBookId = bookId;
        }
    }

    function handleDragLeave() {
        draggedOverBookId = null;
    }

    function handleDrop() {
        if (
            draggedBookId === null ||
            draggedOverBookId === null ||
            draggedBookId === draggedOverBookId
        ) {
            return;
        }

        const draggedBookIndex = filters.filteredBooks.findIndex((b) => b.id === draggedBookId);
        const draggedOverBookIndex = filters.filteredBooks.findIndex(
            (b) => b.id === draggedOverBookId,
        );
        const newBooks = [...filters.filteredBooks];
        const [removed] = newBooks.splice(draggedBookIndex, 1);

        newBooks.splice(draggedOverBookIndex, 0, removed);
        data.books = newBooks;

        draggedBookId = null;
        draggedOverBookId = null;
    }

    function handleDragEnd() {
        draggedBookId = null;
        draggedOverBookId = null;
    }

    function handleToggleCard(bookId: string | number) {
        display.toggleCard(bookId);
    }

    function handleCloseCard() {
        display.closeCard();
    }

    function handleUpdateFilters(newFilters: typeof filters.searchFilters) {
        filters.searchFilters = newFilters;
    }

    function handleAddGenreToFilters(genre: string) {
        filters.addGenre(genre);
    }

    function handleAddTagToFilters(tag: string) {
        filters.addTag(tag);
    }
</script>

<div class="book-gallery" class:idle-background={display.isIdle}>
    <h1 class="gallery-title">{$_("titles.read-watch")}</h1>

    <Filters
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
        setViewMode={display.setViewMode}
        toggleViewMode={display.toggleViewMode}
        getViewMode={() => {
            return display.viewMode;
        }}
    />

    {#if data.isLoading}
        <div class="progress-wrapper">
            <div class="progress-bar">
                <div class="progress-fill" style="width: {data.downloadProgress}%"></div>
            </div>
            <p>{$_("indicators.loading", { values: { progress: data.downloadProgress } })}</p>
        </div>
    {/if}

    {#if data.fetchError}
        <div class="error-message">
            {$_("indicators.list-load-error", { values: { err: data.fetchError } })}
        </div>
    {/if}

    {#if !data.isLoading && !data.fetchError}
        <BookGrid
            showExplicit={$show_explicit}
            books={filters.filteredBooks}
            isContentVisible={data.isContentVisible}
            viewMode={display.viewMode}
            expandedCard={display.expandedCard}
            onToggleCard={handleToggleCard}
            onAddGenreToFilters={handleAddGenreToFilters}
            onAddTagToFilters={handleAddTagToFilters}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            {draggedBookId}
            {draggedOverBookId}
        />
    {/if}

    {#if display.expandedCard !== null && !data.isLoading && !data.fetchError && expandedBook}
        <ExpandedCard
            book={expandedBook()!}
            onCloseCard={handleCloseCard}
            onAddGenreToFilters={handleAddGenreToFilters}
            onAddTagToFilters={handleAddTagToFilters}
        />
    {/if}

    <GalleryBackdrop show={display.expandedCard !== null} onClick={handleCloseCard} />
</div>

<style>
    :global {
        @import url("/src/assets/css/main.css");
    }
</style>
