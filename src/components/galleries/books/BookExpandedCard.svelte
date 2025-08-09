<script lang="ts">
    import type { Book } from "$lib/types";
    import { lazy_load } from "$lib/utils/loading";
    import { _ } from "svelte-i18n";

    interface Props {
        book: Book;
        on_close_card: () => void;
        on_add_genre_to_filters: (genre: string) => void;
        on_add_tag_to_filters: (tag: string) => void;
    }

    let {
        book,
        on_close_card,
        on_add_genre_to_filters,
        on_add_tag_to_filters,
    }: Props = $props();
</script>

<div class="expanded-card-overlay">
    <div
        class="book-expanded"
        class:show={book !== null}
        class:explicit-content={book.explicit}
    >
        <div class="expanded-header">
            <button
                class="close-btn"
                onclick={on_close_card}>×</button
            >
            <div class="expanded-cover">
                <img
                    use:lazy_load
                    data-src={book.coverImage}
                    alt={$_("gallery.generic.cover-alt", {
                        values: { title: book.title },
                    })}
                    class="expanded-cover-image"
                />
                {#if book.explicit}
                    <div class="explicit-icon">
                        <span class="icon-warning">⚠️</span>
                        <span class="explicit-label"
                            >{$_(
                                "indicators.explicit",
                            )}</span
                        >
                    </div>
                {/if}
            </div>
            <div class="expanded-basic-info">
                <h1 class="expanded-title">{book.title}</h1>
                <p class="expanded-author">{book.author}</p>
                <div class="book-genres">
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    {#each book.genres as genre (genre)}
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <span
                            class="book-genre"
                            onclick={() =>
                                on_add_genre_to_filters(
                                    genre,
                                )}
                        >
                            {genre}
                        </span>
                    {/each}
                </div>
                {#if book.tags}
                    <div class="book-tags">
                        {#each book.tags as tag (tag)}
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <span
                                class="book-tag"
                                onclick={() =>
                                    on_add_tag_to_filters(
                                        tag,
                                    )}>{tag}</span
                            >
                        {/each}
                    </div>
                {/if}
                <div class="expanded-rating">
                    <span class="stars">
                        {#each Array(book.title === "One Piece" ? 50 : 5) as _, star}
                            <span
                                class="star"
                                class:filled={star + 1 <=
                                    book.rating}>★</span
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

        <div class="expanded-content">
            <h4>
                {$_("gallery.generic.headers.description")}
            </h4>
            <div class="description-section">
                <p>{book.description}</p>
            </div>

            <h4>
                {$_("gallery.generic.headers.my-thoughts")}
            </h4>
            <div class="thoughts-section">
                <p>{book.myThoughts}</p>
            </div>

            {#if book.links && book.links.length > 0}
                <div class="links-section">
                    <h4>
                        {$_(
                            "gallery.generic.headers.links",
                        )}
                    </h4>
                    <div class="links-grid">
                        {#each book.links as link (link.title)}
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="book-link"
                            >
                                <span class="link-title"
                                    >{link.title}</span
                                >
                            </a>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
