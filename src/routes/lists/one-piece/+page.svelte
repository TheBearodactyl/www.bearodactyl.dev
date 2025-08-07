<script lang="ts">
    import { useFilters } from "$lib/reviews/filters.svelte";
    import { useData } from "$lib/reviews/data.svelte";
    import Seo from "../../../components/SEO.svelte";
    import { _ } from "svelte-i18n";

    const data = useData();
    let filters = useFilters(data.reviews);
</script>

<Seo
    title="The Motherfucking Chapter Reviews"
    desc="A list of my reviews of OP chapters"
    image="https://static0.colliderimages.com/wordpress/wp-content/uploads/sharedimages/2025/01/0388694_poster_w780.jpg"
    url="https://bearodactyl.dev/lists/one-piece"
/>

<div class="book-gallery">
    <h1 class="gallery-title">{$_("titles.routes.one-piece-long")}</h1>

    {#if data.isLoading()}
        <div class="progress-wrapper">
            <p>
                {$_("indicators.loading", {
                    values: {
                        progress: data.downloadProgress(),
                    },
                })}
            </p>
        </div>
    {/if}

    {#if data.fetchError()}
        <div class="error-message">
            {$_("indicators.list-load-error", {
                values: {
                    err: data.fetchError()!,
                },
            })}
        </div>
    {/if}

    <div class="filter-pill">
        <input
            type="text"
            bind:value={filters.searchFilters.search}
            placeholder={$_("gallery.filters.search")}
            class="pill-search-input"
        />
    </div>

    {#if !data.isLoading() && !data.fetchError()}
        <div class="book-grid-container fade-in">
            <div class="book-grid">
                {#each filters.filteredReviews() as review (review.chapter)}
                    <div class="book-card">
                        <div class="book-info">
                            <h class="book-title">
                                {$_("gallery.review.chapter-number", {
                                    values: {
                                        chapter: review.chapter,
                                    },
                                })}
                            </h>
                            <p class="book-author">{review.description}</p>
                            <div class="book-rating">
                                <span class="stars">
                                    {#each Array(5) as _, star}
                                        <span class="star" class:filled={star + 1 <= review.rating}
                                            >★</span
                                        >
                                    {/each}
                                </span>
                                <span class="rating-text">
                                    {review.rating}/5
                                </span>
                            </div>
                            {#if review.thoughts}
                                <div class="book-meta">
                                    <p>
                                        {$_("gallery.review.my-thoughts", {
                                            values: {
                                                thoughts: review.thoughts!,
                                            },
                                        })}
                                    </p>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}

                {#if filters.filteredReviews().length === 0}
                    <p class="no-books-found">{$_("indicators.no-results")}</p>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    :global {
        @import url("/src/assets/css/main.css");
    }

    .book-grid-container {
        min-height: calc(100vh - var(--spacing-2xl) * 2 - 120px);
    }
</style>
