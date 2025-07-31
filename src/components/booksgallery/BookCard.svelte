<script lang="ts">
    import type { Book } from "$lib/types";
    import { lazyLoad } from "$lib/utils/lazyLoad";
    import { isPeakFiction } from "$lib/utils/misc";
    import BaseCard from "../gallery/BaseCard.svelte";
    import WarningIcon from "../icons/WarningIcon.svelte";
    import { _ } from "svelte-i18n";

    interface Props {
        book: Book;
        index: number;
        isExpanded: boolean;
        viewMode: string;
        onToggleCard: () => void;
    }

    let { book, index, isExpanded, viewMode, onToggleCard }: Props = $props();
</script>

<div style="--hover-border-color: {!isExpanded && book.color ? book.color : 'var(--rp-love)'};">
    <BaseCard
        {index}
        expanded={isExpanded}
        {viewMode}
        explicit={book.explicit}
        cardClasses={{ "explicit-content": book.explicit }}
        ontoggle={onToggleCard}
    >
        {#if !isExpanded}
            {#if viewMode === "list"}
                <div class="book-list-item">
                    <div class="book-cover-small" class:explicit-content={book.explicit}>
                        <img
                            use:lazyLoad
                            data-src={book.coverImage}
                            alt={book.title}
                            class="cover-image-small"
                            loading="lazy"
                        />
                        {#if book.explicit}
                            <div class="explicit-icon-small">
                                <span class="icon-warning-small">⚠️</span>
                                <span class="explicit-label-small">18+</span>
                            </div>
                        {/if}
                    </div>
                    <div class="book-details">
                        <div class="book-primary-info">
                            <h3 class="book-title-list">{book.title}</h3>
                            <p class="book-author-list">{book.author}</p>
                        </div>
                        <div class="book-meta">
                            <div class="book-rating-list">
                                <span class="stars-small">
                                    {#each Array(isPeakFiction(book) ? 50 : 5) as _, star}
                                        <span
                                            class="star-small"
                                            class:filled={star + 1 <= book.rating}>★</span
                                        >
                                    {/each}
                                </span>
                            </div>
                            <div class="read-status-list">{book.status}</div>
                        </div>
                        <div class="book-genres-list">
                            {#each book.genres.slice(0, 3) as genre (genre)}
                                <span class="book-genre-small">{genre}</span>
                            {/each}
                        </div>
                    </div>
                </div>
            {:else}
                <div class="book-compact">
                    <div class="book-cover">
                        <img
                            use:lazyLoad
                            data-src={book.coverImage}
                            alt={$_("gallery.book.cover-alt", { values: { title: book.title } })}
                            class="cover-image"
                            loading="lazy"
                        />
                        {#if book.explicit}
                            <div class="explicit-icon">
                                <span class="icon-warning">
                                    <WarningIcon />
                                </span>
                                <span class="explicit-label">{$_("gallery.explicit")}</span>
                            </div>
                        {/if}
                    </div>
                    <div class="book-info">
                        <h3 class="book-title">{book.title}</h3>
                        <p class="book-author">{book.author}</p>
                        <div class="read-status">{book.status}</div>
                        <div class="book-genres">
                            {#each book.genres.slice(0, 5) as genre (genre)}
                                <span class="book-genre">{genre}</span>
                            {/each}
                        </div>
                        {#if book.tags}
                            <div class="book-tags">
                                {#each book.tags.slice(0, 5) as tag (tag)}
                                    <span class="book-tag">{tag}</span>
                                {/each}
                            </div>
                        {/if}
                        <div class="book-rating">
                            <span class="stars">
                                {#each Array(isPeakFiction(book) ? 50 : 5) as _, star}
                                    <span class="star" class:filled={star + 1 <= book.rating}
                                        >★</span
                                    >
                                {/each}
                            </span>
                            <span class="rating-text">
                                {$_("props-book-rating-5", { values: { rating: book.rating } })}
                            </span>
                        </div>
                    </div>
                </div>
            {/if}
        {/if}
    </BaseCard>
</div>
