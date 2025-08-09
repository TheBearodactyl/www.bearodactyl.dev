<script lang="ts">
    import { _ } from "svelte-i18n";
    import Seo from "../../../components/misc/Seo.svelte";
    import { data } from "$lib/gallery/data/reviews.svelte";
    import { filters } from "$lib/gallery/filters/reviews.svelte";

    const review_data = data();
    let review_filters = filters(review_data.reviews);
</script>

<Seo
    title="The Motherfucking Chapter Reviews"
    desc="A list of my reviews of OP chapters"
    image="https://static0.colliderimages.com/wordpress/wp-content/uploads/sharedimages/2025/01/0388694_poster_w780.jpg"
    url="https://bearodactyl.dev/lists/one-piece"
/>

<div class="book-gallery">
    <h1 class="gallery-title">{$_("titles.routes.one-piece-long")}</h1>

    {#if review_data.is_loading()}
        <div class="progress-wrapper">
            <p>
                {$_("indicators.loading", {
                    values: {
                        progress: review_data.dl_progress(),
                    },
                })}
            </p>
        </div>
    {/if}

    {#if review_data.fetch_err()}
        <div class="error-message">
            {$_("indicators.list-load-error", {
                values: {
                    err: review_data.fetch_err(),
                },
            })}
        </div>
    {/if}

    <div class="filter-pill">
        <input
            type="text"
            bind:value={review_filters.search_filters.search}
            placeholder={$_("gallery.filters.search")}
            class="pill-search-input"
        />
    </div>

    {#if !review_data.is_loading() && !review_data.fetch_err()}
        <div class="book-grid-container fade-in">
            <div class="book-grid">
                {#each review_filters.filtered_reviews() as review (review.chapter)}
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
                                        <span
                                            class="star"
                                            class:filled={star + 1 <= review.rating}>★</span
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

                {#if review_filters.filtered_reviews().length === 0}
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
