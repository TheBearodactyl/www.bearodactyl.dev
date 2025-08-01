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

<div class="gallery-wrapper">
    <h1 class="title">{$_("titles.op-reviews")}</h1>

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
        <div class="gallery">
            {#each filters.filteredReviews() as review (review.chapter)}
                <div class="card">
                    <div class="card-content">
                        <h1 class="project-name">
                            {$_("gallery.review.chapter-number", {
                                values: {
                                    chapter: review.chapter
                                }
                            })}
                        </h1>
                        <p class="project-description">{review.description}</p>
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
    .gallery-wrapper {
        background-color: var(--rp-base);
        color: var(--rp-text);
        padding: 2rem;
        min-height: 100vh;
        font-family: "Segoe UI", sans-serif;
    }

    .title {
        font-size: 2.5rem;
        color: var(--rp-rose);
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .loading,
    .error,
    .no-results {
        text-align: center;
        margin: 1rem 0;
        color: var(--rp-gold);
    }

    .filters {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1rem;
        flex-wrap: nowrap;
        align-items: center;
        flex-grow: unset;
    }

    .search-input {
        padding: 0.5rem 0.75rem;
        border-radius: 9999px;
        border: 1px solid var(--rp-highlight-low);
        background-color: var(--rp-surface);
        color: var(--rp-text);
        width: 50%;
        font-size: 1rem;
        outline-offset: 2px;
        transition: border-color 0.2s ease;
        flex-grow: 0;
        flex-shrink: 0;
        box-sizing: border-box;
    }

    .search-input:focus {
        border-color: var(--rp-foam);
    }

    .gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 1.5rem;
    }

    .card {
        position: relative;
        background-color: var(--rp-overlay);
        border: 1px solid var(--rp-highlight-low);
        border-radius: 12px;
        padding: 1.2rem;
        transition: transform 0.2s ease;
    }

    .card:hover {
        transform: scale(1.02);
        border-color: var(--rp-iris);
    }

    .card-content {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .project-name {
        font-size: 1.3rem;
        color: var(--rp-gold);
        margin-bottom: 0.5rem;
    }

    .project-description {
        flex-grow: 1;
        font-size: 1rem;
        color: var(--rp-subtle);
        margin-bottom: 1rem;
    }
</style>
