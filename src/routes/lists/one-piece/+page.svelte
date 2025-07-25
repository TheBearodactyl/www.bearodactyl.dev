<script lang="ts">
    import { useFilters } from "$lib/reviews/filters.svelte";
    import { useData } from "$lib/reviews/data.svelte";

    const data = useData();
    let filters = useFilters(data.reviews);
</script>

<svelte:head>
    <title>one piece chapter reviews</title>
    <meta charset="utf-8" />
</svelte:head>

<div class="gallery-wrapper">
    <h1 class="title">My Reviews</h1>

    {#if data.isLoading()}
        <div class="loading">
            Loading reviews... {data.downloadProgress()}%
        </div>
    {/if}

    {#if data.fetchError()}
        <div class="error">Error: {data.fetchError()}</div>
    {/if}

    <div class="filters">
        <input
            type="text"
            bind:value={filters.searchFilters.search}
            placeholder="Search reviews..."
            class="search-input"
        />
    </div>

    {#if !data.isLoading() && !data.fetchError()}
        <div class="gallery">
            {#each filters.filteredReviews() as review (review.chapter)}
                <div class="card">
                    <div class="card-content">
                        <h2 class="project-name">Chapter {review.chapter}</h2>
                        <p class="project-description">{review.description}</p>
                        <p><strong>Rating:</strong> {review.rating}/5</p>
                        {#if review.thoughts}
                            <p><strong>Thoughts:</strong> {review.thoughts}</p>
                        {/if}
                    </div>
                </div>
            {/each}

            {#if filters.filteredReviews().length === 0}
                <div class="no-results">No reviews match your search.</div>
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
