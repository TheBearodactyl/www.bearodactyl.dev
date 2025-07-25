<script lang="ts">
    import { useData } from "$lib/projects/data.svelte";
    import { useFilters } from "$lib/projects/filters.svelte";
    import { fade } from "svelte/transition";

    const data = useData();
    const filters = useFilters(data.projects);

    let expandedCards = $state<Record<string, boolean>>({});
    let tagsDropdownRef: HTMLElement;

    const copyInstallCommand = async (text: string | undefined) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            alert("Copied to clipboard");
        } catch (err) {
            alert("Failed to copy.");
            console.error("Clipboard copy error: ", err);
        }
    };

    const toggleInstallCmd = (name: string) => {
        expandedCards[name] = !expandedCards[name];
    };

    $effect(() => {
        document.title = "Projects List";
    });
</script>

<svelte:head>
    <title>my projects</title>
    <meta charset="utf-8" />
</svelte:head>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="gallery-wrapper">
    <h1 class="title">My Projects</h1>

    {#if data.isLoading()}
        <div class="loading">Loading projects... {data.downloadProgress()}%</div>
    {/if}

    {#if data.fetchError()}
        <div class="error">Error: {data.fetchError()}</div>
    {/if}

    <div class="filters">
        <input
            bind:value={filters.searchFilters.name}
            type="text"
            placeholder="Search projects..."
            class="search-input"
        />

        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div bind:this={tagsDropdownRef} class="multi-select">
            <!-- svelte-ignore event_directive_deprecated -->
            <div
                class="dropdown"
                class:open={filters.dropdowns.tags}
                tabindex="0"
                on:click|stopPropagation={() => filters.openDropdown("tags")}
                on:blur|capture={() => filters.delayedCloseDropdown("tags")}
            >
                <div class="dropdown-content">
                    {#if filters.searchFilters.tags.length === 0}
                        <span class="placeholder">Select tags...</span>
                    {:else}
                        <div class="selected-tags">
                            <div class="tags-wrapper">
                                {#each filters.searchFilters.tags as tag}
                                    <span
                                        class="tag-button"
                                        on:click|stopPropagation={() =>
                                            filters.toggleFilterTag(tag)}
                                    >
                                        {tag} <span class="remove-icon">×</span>
                                    </span>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>

                <span class="dropdown-arrow">☰</span>

                {#if filters.dropdowns.tags}
                    <ul class="dropdown-list">
                        {#if filters.filteredTagCounts.length > 0}
                            {#each filters.filteredTagCounts() as [tag, count]}
                                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                                <li
                                    class:selected={filters.searchFilters.tags.includes(tag)}
                                    on:click|stopPropagation={() => filters.toggleFilterTag(tag)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.searchFilters.tags.includes(tag)}
                                        readonly
                                    />
                                    {tag} <span class="tag-count">({count})</span>
                                </li>
                            {/each}
                        {:else}
                            <li class="no-tags">No tags available</li>
                        {/if}
                    </ul>
                {/if}
            </div>
        </div>
    </div>

    {#if !data.isLoading() && !data.fetchError()}
        <div class="gallery">
            {#each filters.filteredProjects() as project}
                <div class="card">
                    <div class="card-content">
                        <h2 class="project-name">{project.name}</h2>
                        <p class="project-description">{project.description}</p>

                        {#if project.tags}
                            <div class="book-tags">
                                {#each project.tags.slice(0, 5) as tag}
                                    <span class="book-tag">{tag}</span>
                                {/each}
                            </div>
                        {/if}

                        <a
                            href={project.source}
                            class="project-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View Source
                        </a>

                        <!-- svelte-ignore event_directive_deprecated -->
                        <button
                            class="expand-button"
                            on:click={() => toggleInstallCmd(project.name)}
                        >
                            {expandedCards[project.name] ? "Hide" : "Show"} Install Command
                        </button>

                        {#if expandedCards[project.name]}
                            <div class="install-section" transition:fade>
                                <code class="install-command">
                                    {project.installCommand || "No install command provided."}
                                </code>
                                <!-- svelte-ignore a11y_consider_explicit_label -->
                                <!-- svelte-ignore event_directive_deprecated -->
                                <button
                                    class="copy-button"
                                    on:click={() => copyInstallCommand(project.installCommand)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="feather feather-copy"
                                    >
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"
                                        ></rect>
                                        <path
                                            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}

            {#if filters.allTags.length !== 0}
                {#if filters.filteredProjects.length === 0}
                    <div class="no-results">No projects match your search.</div>
                {/if}
            {/if}
        </div>
    {/if}
</div>

<style>
    @import url("/src/assets/css/bookgallery.css");

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

    .selected-tags {
        display: flex;
        flex-wrap: nowrap;
        gap: 0.5rem;
        margin-left: -0.025rem;
        margin-top: 0.05rem;
        overflow-x: auto;
        overflow-y: hidden;
        max-width: calc(100% - 2rem);
        /* padding-top: 10px; */
        /* Account for dropdown arrow space */
        height: 38px;
        align-items: center;
        padding-bottom: 2px;
        scrollbar-width: none;
        scrollbar-color: transparent;
        flex: 1;
        min-width: 0;
    }

    .install-section {
        margin-top: 0.5rem;
        background-color: var(--rp-base);
        border: 1px dashed var(--rp-highlight-low);
        padding: 0.75rem;
        border-radius: 6px;
        font-family: monospace;
        color: var(--rp-foam);
        white-space: pre-wrap;
        position: relative;
    }

    .install-command {
        font-size: 0.95rem;
        word-break: break-word;
        display: flex;
        margin-bottom: 0.5rem;
    }

    .copy-button {
        background-color: var(--rp-surface);
        color: var(--rp-foam);
        border: 1px solid var(--rp-highlight-low);
        padding: 0.25rem 0.6rem;
        border-radius: 6px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .copy-button:hover {
        background-color: var(--rp-highlight-med);
    }

    .expand-button {
        margin-top: 0.5rem;
        background-color: var(--rp-surface);
        border: 1px solid var(--rp-highlight-low);
        color: var(--rp-foam);
        padding: 0.4rem 0.8rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        font-size: 0.9rem;
    }

    .expand-button:hover {
        background-color: var(--rp-highlight-med);
    }

    .selected-tags::-webkit-scrollbar {
        height: 4px;
    }

    .selected-tags::-webkit-scrollbar-track {
        background: var(--rp-surface);
        border-radius: 2px;
    }

    .selected-tags::-webkit-scrollbar-thumb {
        background: var(--rp-highlight-med);
        border-radius: 2px;
    }

    .selected-tags::-webkit-scrollbar-thumb:hover {
        background: var(--rp-highlight-high);
    }

    .tag-button {
        background-color: var(--rp-highlight-med);
        color: var(--rp-foam);
        padding: 0.2rem 0.8rem;
        border-radius: 9999px;
        font-size: 0.9rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        transition: background-color 0.2s ease;
        white-space: nowrap;
        flex-shrink: 0;
        height: 24px;
    }

    .tag-button:hover {
        background-color: var(--rp-highlight-high);
    }

    .remove-icon {
        font-weight: bold;
        font-size: 1rem;
        line-height: 1;
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

    /* Unified styles for search input and dropdown */
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

    .multi-select {
        flex-grow: 0;
        flex-shrink: 0;
        width: 50%;
        box-sizing: border-box;
    }

    .dropdown {
        position: relative;
        border-radius: 9999px;
        user-select: none;
        background-color: var(--rp-surface);
        border: 1px solid var(--rp-highlight-low);
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        font-size: 1rem;
        min-height: 38px;
        max-height: 38px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: border-color 0.2s ease;
        gap: 0.5rem;
    }

    .dropdown:hover {
        background-color: var(--rp-surface);
    }

    .dropdown:focus {
        border-color: var(--rp-foam);
        outline: none;
    }

    .dropdown-content {
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 0;
        overflow: hidden;
        max-width: calc(100% - 2rem);
    }

    .placeholder {
        color: var(--rp-text);
        font-size: 1rem;
        font-weight: 400;
        font-style: normal;
        padding: 0;
        margin: 0;
        flex-shrink: 0;
    }

    .dropdown-arrow {
        color: var(--rp-text);
        font-size: 1rem;
        flex-shrink: 0;
        pointer-events: auto;
        z-index: 5000;
        position: relative;
    }

    .dropdown-list {
        position: absolute;
        top: calc(100% + 0.25rem);
        left: 0;
        background-color: var(--rp-overlay);
        border: 1px solid var(--rp-highlight-low);
        border-radius: 6px;
        max-height: 180px;
        overflow-y: auto;
        width: 100%;
        z-index: 10;
        padding: 0.5rem 0;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
    }

    .dropdown-list li {
        padding: 0.5rem 1rem;
        cursor: pointer;
        transition: background-color 0.2s ease;
        color: var(--rp-subtle);
    }

    .dropdown-list li:hover {
        background-color: var(--rp-highlight-med);
        color: var(--rp-foam);
    }

    .dropdown-list li.selected {
        font-weight: 700;
        color: var(--rp-foam);
    }

    .gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 1.5rem;
    }

    .card {
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

    .project-link {
        align-self: flex-start;
        color: var(--rp-foam);
        text-decoration: none;
        font-weight: bold;
        border-bottom: 2px solid transparent;
        transition: border-color 0.2s ease;
    }

    .project-link:hover {
        border-color: var(--rp-foam);
    }

    .tags-wrapper {
        display: inline-flex;
        flex-wrap: nowrap;
        gap: 0.4rem;
    }

    .tag-count {
        color: var(--rp-muted);
        font-size: 0.85em;
        margin-left: 0.5em;
    }
</style>
