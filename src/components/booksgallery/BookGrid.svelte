<script lang="ts">
    import type { Book } from "$lib/types";
    import BookCard from "./BookCard.svelte";
    import { _ } from "svelte-i18n";

    interface Props {
        books: Book[];
        isContentVisible: boolean;
        viewMode: string;
        expandedCard: string | number | null;
        onToggleCard: (bookId: string | number) => void;
        onAddGenreToFilters: (genre: string) => void;
        onAddTagToFilters: (tag: string) => void;
    }

    let {
        books,
        isContentVisible,
        viewMode,
        expandedCard,
        onToggleCard,
        onAddGenreToFilters,
        onAddTagToFilters
    }: Props = $props();
</script>

<div class="book-grid-container" class:fade-in={isContentVisible}>
    {#if books.length > 0}
        <div class="book-grid" class:list-view={viewMode === "list"}>
            {#each books as book, index (book.id)}
                <BookCard
                    {book}
                    {index}
                    {viewMode}
                    isExpanded={expandedCard === book.id}
                    onToggleCard={() => onToggleCard(book.id)}
                    {onAddGenreToFilters}
                    {onAddTagToFilters}
                />
            {/each}
        </div>
    {:else}
        <div class="no-results">
            {$_("indicators.no-results")}
        </div>
    {/if}
</div>
