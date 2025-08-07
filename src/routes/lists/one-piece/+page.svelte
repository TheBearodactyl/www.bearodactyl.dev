<script lang="ts">
    import { useFilters } from "$lib/reviews/filters.svelte";
    import { useData } from "$lib/reviews/data.svelte";
    import Seo from "../../../components/SEO.svelte";
    import { _ } from "svelte-i18n";
    import { debugMessages } from "$lib/i18n";

    const data = useData();
    let filters = useFilters(data.reviews);
</script>

<Seo
    title="The Motherfucking Chapter Reviews"
    desc="A list of my reviews of OP chapters"
    image="https://static0.colliderimages.com/wordpress/wp-content/uploads/sharedimages/2025/01/0388694_poster_w780.jpg"
    url="https://bearodactyl.dev/lists/one-piece"
/>

<div class="gallery-wrapper">
    <h1 class="title">{$_("titles.routes.one-piece")}</h1>

    {#if data.isLoading()}
        <div class="loading">
            {$_("indicators.loading", {
                values: {
                    progress: data.downloadProgress()
                }
            })}
        </div>
    {/if}

    {#if data.fetchError()}
        <div class="error">
            {$_("indicators.list-load-error", {
                values: {
                    err: data.fetchError()!
                }
            })}
        </div>
    {/if}

    <div class="filters">
        <input
            type="text"
            bind:value={filters.searchFilters.search}
            placeholder={$_("gallery.filters.search")}
            class="search-input"
        />
    </div>

    {#if !data.isLoading() && !data.fetchError()}
        <div class="book-gallery">
            {#each filters.filteredReviews() as review (review.chapter)}
                <div class="book-card">
                    <div class="book-info">
                        <h1 class="book-title">
                            {$_("gallery.review.chapter-number", {
                                values: {
                                    chapter: review.chapter
                                }
                            })}
                        </h1>
                        <p class="book-description">{review.description}</p>
                        <p><strong>{$_("gallery.review.rating")}</strong> {review.rating}/5</p>
                        {#if review.thoughts}
                            <p>
                                {$_("gallery.review.my-thoughts", {
                                    values: {
                                        thoughts: review.thoughts!
                                    }
                                })}
                            </p>
                        {/if}
                    </div>
                </div>
            {/each}

            {#if filters.filteredReviews().length === 0}
                <div class="no-results">{$_("indicators.no-results")}</div>
            {/if}
        </div>
    {/if}
</div>

<style>
    :global {
        @import url("/src/assets/css/main.css");
    }
</style>