<script lang="ts">
    import type { Book } from "$lib/types";
    import { SvelteSet } from "svelte/reactivity";
    import BookCard from "./BookCard.svelte";
    import { _ } from "svelte-i18n";

    interface Props {
        books: Book[];
        isContentVisible: boolean;
        viewMode: "masonry" | "list";
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

<div
    class="book-grid-container"
    class:fade-in={isContentVisible}
>
    {#if books.length > 0}
        <div
            role="button"
            tabindex="0"
            class="book-grid"
            class:list-view={viewMode === "list"}
            class:is-reordering={isReordering}
            ondrop={handleDrop}
            ondragover={handleDragOver}
        >
            {#each books as book, index (book.id)}
                <button
                    onclick={() => {
                        onToggleCard(book.id);
                    }}
                >
                    <BookCard
                        show_explicit={showExplicit}
                        {book}
                        {index}
                        view_mode={viewMode}
                        expanded={expandedCard === book.id}
                        on_toggle_card={() => onToggleCard(book.id)}
                        on_add_genre_to_filters={onAddGenreToFilters}
                        on_add_tag_to_filters={onAddTagToFilters}
                        draggable={true}
                        is_dragging={draggedBookId === book.id}
                        is_dragged_over={draggedOverBookId === book.id}
                        is_dropping={droppingBookIds.has(book.id)}
                        on_drag_start={() => onDragStart(book.id)}
                        on_drag_enter={() => onDragEnter(book.id)}
                        on_drag_leave={() => onDragLeave()}
                        on_drop={() => onDrop()}
                        on_drag_end={() => onDragEnd()}
                    />
                </button>
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
