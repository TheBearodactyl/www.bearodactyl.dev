<script lang="ts">
    import type { Book } from "$lib/types";
    import { lazyLoad } from "$lib/utils/lazyLoad";
    import { _ } from "svelte-i18n";

    interface Props {
        book: Book;
        onCloseCard: () => void;
    }

    let { book, onCloseCard }: Props = $props();
</script>

<div class="expanded-card-overlay">
    <div class="book-expanded" class:show={book !== null} class:explicit-content={book.explicit}>
        <div class="expanded-header">
            <button class="close-btn" onclick={onCloseCard}>×</button>
            <div class="expanded-cover">
                <img
                    use:lazyLoad
                    data-src={book.coverImage}
                    alt={$_("gallery.book.cover-alt", { values: { title: book.title } })}
                    class="expanded-cover-image"
                />
                {#if book.explicit}
                    <div class="explicit-icon">
                        <span class="icon-warning">⚠️</span>
                        <span class="explicit-label">{$_("gallery.explicit")}</span>
                    </div>
                {/if}
            </div>
            <div class="expanded-basic-info">
                <h3 class="expanded-title">{book.title}</h3>
                <p class="expanded-author">{book.author}</p>
                <div class="book-genres">
                    {#each book.genres as genre (genre)}
                        <span class="book-genre">{genre}</span>
                    {/each}
                </div>
                {#if book.tags}
                    <div class="book-tags">
                        {#each book.tags as tag (tag)}
                            <span class="book-tag">{tag}</span>
                        {/each}
                    </div>
                {/if}
                <div class="expanded-rating">
                    <span class="stars">
                        {#each Array(book.title === "One Piece" ? 50 : 5) as _, star}
                            <span class="star" class:filled={star + 1 <= book.rating}>★</span>
                        {/each}
                    </span>
                    <span class="rating-text">
                        {$_("props-book-rating-5", { values: { rating: book.rating } })}
                    </span>
                </div>
            </div>
        </div>

        <div class="expanded-content">
            <div class="description-section">
                <h4>{$_("gallery.expanded.description")}</h4>
                <p>{book.description}</p>
            </div>

            <div class="thoughts-section">
                <h4>{$_("gallery.expanded.my-thoughts")}</h4>
                <p>{book.myThoughts}</p>
            </div>

            {#if book.links && book.links.length > 0}
                <div class="links-section">
                    <h4>{$_("gallery.expanded.links")}</h4>
                    <div class="links-grid">
                        {#each book.links as link (link.title)}
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="book-link"
                            >
                                <span class="link-title">{link.title}</span>
                            </a>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
