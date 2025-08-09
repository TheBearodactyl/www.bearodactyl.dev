<script lang="ts">
    import type { Book } from "$lib/types";
    import { lazy_load } from "$lib/utils/loading";
    import { is_peak } from "$lib/utils/misc";
    import BaseCard from "../base/BaseCard.svelte";
    import WarningIcon from "../../icons/WarningIcon.svelte";
    import { _ } from "svelte-i18n";

    interface Props {
        book: Book;
        index: number;
        expanded: boolean;
        view_mode: "masonry" | "list";
        show_explicit: boolean;
        on_toggle_card: () => void;
        on_add_genre_to_filters: (genre: string) => void;
        on_add_tag_to_filters: (tag: string) => void;

        draggable: boolean;
        is_dragging: boolean;
        is_dragged_over: boolean;
        is_dropping: boolean;
        on_drag_start: () => void;
        on_drag_enter: () => void;
        on_drag_leave: () => void;
        on_drop: () => void;
        on_drag_end: () => void;
    }

    let {
        book,
        index,
        expanded,
        view_mode,
        show_explicit,
        on_toggle_card,
        on_add_genre_to_filters,
        on_add_tag_to_filters,
        draggable,
        is_dragging,
        is_dropping,
        is_dragged_over,
        on_drag_start,
        on_drag_enter,
        on_drag_leave,
        on_drop,
        on_drag_end,
    }: Props = $props();

    let card_element: HTMLElement;
    let drag_start_timeout: number;

    function handle_drag_start(event: DragEvent) {
        event.stopPropagation();
        event.dataTransfer?.setData(
            "text/plain",
            String(book.id),
        );

        drag_start_timeout = setTimeout(() => {
            on_drag_start();
        }, 50);
    }

    function handle_drag_enter(event: DragEvent) {
        event.preventDefault();
        on_drag_enter();
    }

    function handle_drag_leave(event: DragEvent) {
        const rect = card_element.getBoundingClientRect();
        const { clientX, clientY } = event;

        if (
            clientX < rect.left ||
            clientX > rect.right ||
            clientY < rect.top ||
            clientY > rect.bottom
        ) {
            on_drag_leave();
        }
    }

    function handle_drag_end() {
        if (drag_start_timeout) {
            clearTimeout(drag_start_timeout);
        }

        on_drag_end();
    }

    function handle_drop(event: DragEvent) {
        event.stopPropagation();
        on_drop();
    }
</script>

<div
    bind:this={card_element}
    style="--hover-border-color: {!expanded && book.color
        ? book.color
        : 'var(--rp-love)'};"
    class:is-dragging={is_dragging}
    class:is-dragged-over={is_dragged_over}
    class:is-dropping={is_dropping}
>
    <BaseCard
        {index}
        {expanded}
        {view_mode}
        explicit={!show_explicit ? book.explicit : false}
        card_classes={{ "explicit-content": book.explicit }}
        on_toggle={on_toggle_card}
        {draggable}
        on_drag_start={handle_drag_start}
        on_drag_enter={handle_drag_enter}
        on_drag_leave={handle_drag_leave}
        on_drop={handle_drop}
        on_drag_end={handle_drag_end}
    >
        {#if !expanded}
            {#if view_mode === "list"}
                <div class="book-list-item">
                    <div
                        class="book-cover-small"
                        class:explicit-content={book.explicit}
                    >
                        <img
                            use:lazy_load
                            data-src={book.coverImage}
                            alt={book.title}
                            class="cover-image-small"
                            loading="lazy"
                        />
                        {#if !show_explicit ? book.explicit : false}
                            <div
                                class="explicit-icon-small"
                            >
                                <span
                                    class="icon-warning-small"
                                    >⚠️</span
                                >
                                <span
                                    class="explicit-label-small"
                                    >18+</span
                                >
                            </div>
                        {/if}
                    </div>
                    <div class="book-details">
                        <div class="book-primary-info">
                            <h class="book-title-list"
                                >{book.title}</h
                            >
                            <p class="book-author-list">
                                {book.author}
                            </p>
                        </div>
                        <div class="book-meta">
                            <div class="book-rating-list">
                                <span class="stars-small">
                                    {#each Array(is_peak(book) ? 50 : 5) as _, star}
                                        <span
                                            class="star-small"
                                            class:filled={star +
                                                1 <=
                                                book.rating}
                                            >★</span
                                        >
                                    {/each}
                                </span>
                            </div>
                            <div class="read-status-list">
                                {book.status}
                            </div>
                        </div>
                        <div class="book-genres-list">
                            {#each book.genres.slice(0, 3) as genre (genre)}
                                <span
                                    class="book-genre-small"
                                >
                                    <button
                                        onclick={() =>
                                            on_add_genre_to_filters(
                                                genre,
                                            )}
                                        >{genre}</button
                                    >
                                </span>
                            {/each}
                        </div>
                    </div>
                </div>
            {:else}
                <div class="book-compact">
                    <div class="book-cover">
                        <img
                            use:lazy_load
                            data-src={book.coverImage}
                            alt={$_(
                                "gallery.generic.cover-alt",
                                {
                                    values: {
                                        title: book.title,
                                    },
                                },
                            )}
                            class="cover-image"
                            loading="lazy"
                        />
                        {#if !show_explicit ? book.explicit : false}
                            <div class="explicit-icon">
                                <span class="icon-warning">
                                    <WarningIcon />
                                </span>
                                <span class="explicit-label"
                                    >{$_(
                                        "indicators.explicit",
                                    )}</span
                                >
                            </div>
                        {/if}
                    </div>
                    <div class="book-info">
                        <h class="book-title"
                            >{book.title}</h
                        >
                        <p class="book-author">
                            {book.author}
                        </p>
                        <div class="read-status">
                            {book.status}
                        </div>
                        <div class="book-genres">
                            {#each book.genres.slice(0, 5) as genre (genre)}
                                <span class="book-genre">
                                    <button
                                        onclick={() =>
                                            on_add_genre_to_filters(
                                                genre,
                                            )}
                                        >{genre}</button
                                    >
                                </span>
                            {/each}
                        </div>
                        {#if book.tags}
                            <div class="book-tags">
                                {#each book.tags.slice(0, 5) as tag (tag)}
                                    <span class="book-tag">
                                        <button
                                            onclick={() =>
                                                on_add_tag_to_filters(
                                                    tag,
                                                )}
                                            >{tag}</button
                                        >
                                    </span>
                                {/each}
                            </div>
                        {/if}
                        <div class="book-rating">
                            <span class="stars">
                                {#each Array(is_peak(book) ? 50 : 5) as _, star}
                                    <span
                                        class="star"
                                        class:filled={star +
                                            1 <=
                                            book.rating}
                                        >★</span
                                    >
                                {/each}
                            </span>
                            <span class="rating-text">
                                {$_(
                                    "gallery.generic.rating-of-five",
                                    {
                                        values: {
                                            rating: book.rating,
                                        },
                                    },
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            {/if}
        {/if}
    </BaseCard>
</div>
