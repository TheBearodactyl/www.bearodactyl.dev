<script lang="ts">
    import type { Book } from "$lib/types";
    import { SvelteSet } from "svelte/reactivity";
    import BookCard from "./BookCard.svelte";
    import { _ } from "svelte-i18n";

    interface Props {
        books: Book[];
        isContentVisible: boolean;
        viewMode: string;
        expandedCard: string | number | null;
        showExplicit: boolean;
        onToggleCard: (bookId: string | number) => void;
        onAddGenreToFilters: (genre: string) => void;
        onAddTagToFilters: (tag: string) => void;

        onDragStart: (bookId: string | number) => void;
        onDragEnter: (bookId: string | number) => void;
        onDragLeave: () => void;
        onDrop: () => void;
        onDragEnd: () => void;
        draggedBookId: string | number | null;
        draggedOverBookId: string | number | null;
    }

    let {
        books,
        isContentVisible,
        viewMode,
        expandedCard,
        showExplicit,
        onToggleCard,
        onAddGenreToFilters,
        onAddTagToFilters,
        onDragStart,
        onDragEnter,
        onDragLeave,
        onDrop,
        onDragEnd,
        draggedBookId,
        draggedOverBookId,
    }: Props = $props();

    let isReordering = $state(false);
    let droppingBookIds = $state(new SvelteSet<string | number>());

    function handleDrop(event: DragEvent) {
        event.preventDefault();

        if (draggedBookId) {
            droppingBookIds.add(draggedBookId);

            setTimeout(() => {
                droppingBookIds.delete(draggedBookId);
                droppingBookIds = new SvelteSet(droppingBookIds);
            }, 300);
        }

        isReordering = true;
        onDrop();

        setTimeout(() => {
            isReordering = false;
        }, 250);
    }

    function handleDragOver(event: DragEvent) {
        event.preventDefault();

        event.dataTransfer!.dropEffect = "move";
    }
</script>

<div class="book-grid-container" class:fade-in={isContentVisible}>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    {#if books.length > 0}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore event_directive_deprecated -->
        <div
            class="book-grid"
            class:list-view={viewMode === "list"}
            class:is-reordering={isReordering}
            on:drop={handleDrop}
            on:dragover={handleDragOver}
        >
            {#each books as book, index (book.id)}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div
                    on:click={() => {
                        onToggleCard(book.id);
                    }}
                >
                    <BookCard
                        {showExplicit}
                        {book}
                        {index}
                        {viewMode}
                        isExpanded={expandedCard === book.id}
                        onToggleCard={() => onToggleCard(book.id)}
                        {onAddGenreToFilters}
                        {onAddTagToFilters}
                        draggable={true}
                        isDragging={draggedBookId === book.id}
                        isDraggedOver={draggedOverBookId === book.id}
                        isDropping={droppingBookIds.has(book.id)}
                        onDragStart={() => onDragStart(book.id)}
                        onDragEnter={() => onDragEnter(book.id)}
                        onDragLeave={() => onDragLeave()}
                        onDrop={() => onDrop()}
                        onDragEnd={() => onDragEnd()}
                    />
                </div>
            {/each}
        </div>
    {:else}
        <p class="no-books-found">{$_("indicators.no-results")}</p>
    {/if}
</div>

<style>
    .book-grid-container {
        min-height: calc(100vh - var(--spacing-2xl) * 2 - 120px);
    }
</style>
