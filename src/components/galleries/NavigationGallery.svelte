<script lang="ts">
    import { _ } from "svelte-i18n";
    import type { NavItem, RouteItemNext } from "$lib/types";
    import { show_discouragement } from "$lib/stores/discouragement";
    import { onMount } from "svelte";
    import { shuffle } from "$lib/utils/rand";
    import { get_char_count_of_repo } from "$lib/utils/net";
    import { browser } from "$app/environment";

    interface Props {
        navItems: RouteItemNext[];
        num_cols?: number;
        shuffleItems?: boolean;
    }

    const { navItems, num_cols, shuffleItems = true }: Props = $props();

    let char_count: number | null = $state(null);
    let loading = $state(true);
    let error: string | null = $state(null);
    let show_emergency = $state(false);
    let loading_progress = $state(0);
    let loading_stage = $state("Initializing...");

    let columns: RouteItemNext[][] = $state([]);

    async function play_emergency() {
        const audio = new Audio(
            "https://www.myinstants.com/media/sounds/emergency-frog-situation.mp3",
        );
        await audio.play();
        show_emergency = true;
        setTimeout(() => (show_emergency = false), 3500);
    }

    async function play_discouragement() {
        show_discouragement.set(true);
    }

    function handle_card_click(item: RouteItemNext) {
        const title = getItemTitle(item);
        if (title === "Emergency frog!") play_emergency();
        if (item.discouraged) play_discouragement();
        if (item.audioSrc) {
            try {
                const audio = new Audio(item.audioSrc);
                audio.play();
            } catch (error) {
                console.error(error);
            }
        }

        if (item.path) {
            if (browser) {
                window.location.href = item.path;
            }
        }
    }

    function getItemTitle(item: RouteItemNext): string | undefined {
        if (item.title !== undefined) return item.title;
        if (item.name) return `titles.routes.${item.name}`;
        if (item.nameKey) return item.nameKey;
        return undefined;
    }

    function getItemDescription(item: RouteItemNext): string | undefined {
        if (item.description !== undefined) return item.description;
        if (item.name) return `descriptions.routes.${item.name}`;
        if (item.nameKey) return `descriptions.routes.${item.nameKey.split(".").pop()}`;
        return undefined;
    }

    function createBalancedColumns(items: RouteItemNext[], numCols: number): RouteItemNext[][] {
        const cols: RouteItemNext[][] = Array.from({ length: numCols }, () => []);
        items.forEach((item, i) => {
            cols[i % numCols].push(item);
        });
        return cols;
    }

    function updateColumns() {
        let numCols: number;

        if (typeof num_cols === "number" && num_cols > 0 && num_cols) {
            numCols = num_cols;
        } else {
            numCols = 5;
            const w = window.innerWidth;
            if (w <= 600) numCols = 1;
            else if (w <= 900) numCols = 2;
            else if (w <= 1000) numCols = 3;
        }

        const shuffled = shuffleItems ? shuffle(navItems) : navItems;
        columns = createBalancedColumns(shuffled, numCols);
    }

    function updateLoadingProgress(progress: number, stage: string) {
        loading_progress = Math.min(progress, 100);
        loading_stage = stage;
    }

    onMount(async () => {
        try {
            updateLoadingProgress(10, "Setting up navigation");
            await new Promise((resolve) => setTimeout(resolve, 200));
            updateLoadingProgress(30, "Fetching repository info...");
            char_count = await get_char_count_of_repo(
                "https://api.github.com/repos/thebearodactyl/www.bearodactyl.dev/languages",
            );

            updateLoadingProgress(70, "Processing navigation items...");
            await new Promise((resolve) => setTimeout(resolve, 100));

            updateLoadingProgress(90, "Organizing layout...");
            updateColumns();

            updateLoadingProgress(100, "Ready!");
            await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (err) {
            error = err instanceof Error ? err.message : "Failed to get character count";
        } finally {
            loading = false;
            updateColumns();
            window.addEventListener("resize", updateColumns);
        }
    });
</script>

{#if loading}
    <div class="loading-container">
        <div class="loading-content">
            <div class="loading-spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
            </div>
            <div class="loading-text">
                <h2>{loading_stage}</h2>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div
                            class="progress-fill"
                            style="width: {loading_progress}%"
                        ></div>
                    </div>
                    <span class="progress-text">{loading_progress}%</span>
                </div>
            </div>
        </div>
    </div>
{:else if error}
    <div class="error-container">
        <div class="error-content">
            <div class="error-icon">⚠️</div>
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button
                onclick={() => window.location.reload()}
                class="retry-button"
            >
                Try Again
            </button>
        </div>
    </div>
{:else if char_count !== null}
    {#if $show_discouragement}
        <div></div>
    {/if}

    <div class="navigation-gallery-wrapper">
        <div class="navigation-gallery">
            {#each columns as col}
                <div class="nav-column">
                    {#each col as item}
                        {#if item.homePage !== false || item.homePage === undefined}
                            {@const itemTitle = getItemTitle(item)}
                            {@const itemDescription = getItemDescription(item)}

                            {#if itemTitle === "Emergency frog!"}
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <div
                                    title={itemTitle === undefined ? "don't" : $_(itemTitle)}
                                    class="nav-card clickable"
                                    onclick={() => handle_card_click(item)}
                                >
                                    <div class="card-image-container">
                                        {#if item.coverImage}
                                            <img
                                                src={item.coverImage}
                                                alt={`Cover for ${itemTitle}`}
                                                class="card-image"
                                            />
                                        {:else if item.videoSrc}
                                            <!-- svelte-ignore a11y_media_has_caption -->
                                            <video
                                                src={item.videoSrc}
                                                disablepictureinpicture
                                                loop
                                            ></video>
                                        {:else}
                                            <div class="placeholder-image">?</div>
                                        {/if}
                                    </div>
                                    <div class="card-content">
                                        {#if itemTitle !== undefined}
                                            <h2 class="card-title">{$_(itemTitle)}</h2>
                                        {/if}
                                        {#if itemDescription !== undefined}
                                            <p class="card-description">{$_(itemDescription)}</p>
                                        {/if}
                                    </div>
                                </div>
                            {:else if item.discouraged}
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <div
                                    title={itemTitle === undefined ? "don't" : $_(itemTitle)}
                                    class="nav-card clickable"
                                    onclick={() => handle_card_click(item)}
                                >
                                    <div class="card-image-container">
                                        {#if item.coverImage}
                                            <img
                                                src={item.coverImage}
                                                alt={`Cover for ${itemTitle}`}
                                                class="card-image"
                                            />
                                        {:else}
                                            <div></div>
                                        {/if}
                                    </div>
                                    {#if itemTitle !== undefined || itemDescription !== undefined}
                                        <div class="card-content">
                                            {#if itemTitle !== undefined}
                                                <h2 class="card-title">{$_(itemTitle)}</h2>
                                            {/if}
                                            {#if itemDescription !== undefined}
                                                <p class="card-description">
                                                    {$_(itemDescription)}
                                                </p>
                                            {/if}
                                        </div>
                                    {/if}
                                </div>
                            {:else if !itemTitle}
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <div
                                    title={itemTitle === undefined ? "an image :O" : $_(itemTitle)}
                                    class="nav-card"
                                    onclick={() => {
                                        handle_card_click(item);
                                    }}
                                >
                                    <div class="card-image-container">
                                        {#if item.coverImage}
                                            <img
                                                src={item.coverImage}
                                                alt={`Cover for ${itemTitle}`}
                                                class="card-image"
                                            />
                                        {:else}
                                            <div></div>
                                        {/if}
                                    </div>
                                    {#if itemTitle !== undefined || itemDescription !== undefined}
                                        <div class="card-content">
                                            {#if itemTitle !== undefined}
                                                <h2 class="card-title">{$_(itemTitle)}</h2>
                                            {/if}
                                            {#if itemDescription !== undefined}
                                                <p class="card-description">
                                                    {$_(itemDescription)}
                                                </p>
                                            {/if}
                                        </div>
                                    {/if}
                                </div>
                            {:else if item.path === ""}
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <div
                                    title={itemTitle === undefined ? "an image :O" : $_(itemTitle)}
                                    class="nav-card"
                                    onclick={() => {
                                        window.open(item.coverImage, "_blank");
                                    }}
                                >
                                    <div class="card-image-container">
                                        {#if item.coverImage}
                                            <img
                                                src={item.coverImage}
                                                alt={`Cover for ${itemTitle}`}
                                                class="card-image"
                                            />
                                        {:else}
                                            <div></div>
                                        {/if}
                                    </div>
                                    {#if itemTitle !== undefined || itemDescription !== undefined}
                                        <div class="card-content">
                                            {#if itemTitle !== undefined}
                                                <h2 class="card-title">{$_(itemTitle)}</h2>
                                            {/if}
                                            {#if itemDescription !== undefined}
                                                <p class="card-description">
                                                    {$_(itemDescription)}
                                                </p>
                                            {/if}
                                        </div>
                                    {/if}
                                </div>
                            {:else}
                                <a
                                    href={item.path}
                                    class="nav-card"
                                >
                                    <div
                                        title={itemTitle === undefined ? "don't" : $_(itemTitle)}
                                        class="card-image-container"
                                    >
                                        {#if item.coverImage && !item.coverImage.endsWith("webm")}
                                            <img
                                                src={item.coverImage}
                                                alt={`Cover for ${itemTitle}`}
                                                class="card-image"
                                            />
                                        {:else if item.coverImage && item.coverImage.endsWith("webm")}
                                            <video
                                                disablepictureinpicture
                                                autoplay
                                                loop
                                                muted
                                                playsinline
                                                class="card-image"
                                            >
                                                <source
                                                    src={item.coverImage}
                                                    type="video/webm"
                                                />
                                            </video>
                                        {:else}
                                            <div class="placeholder-image">?</div>
                                        {/if}
                                    </div>
                                    <div class="card-content">
                                        {#if itemTitle !== undefined}
                                            <h2 class="card-title">{$_(itemTitle)}</h2>
                                        {/if}
                                        {#if itemDescription !== undefined && itemDescription !== "descriptions.routes.website-src"}
                                            <p class="card-description">{$_(itemDescription)}</p>
                                        {:else if itemDescription === "descriptions.routes.website-src"}
                                            <p class="card-description">
                                                {$_(itemDescription, {
                                                    values: {
                                                        charcount: char_count.toLocaleString(),
                                                    },
                                                })}
                                            </p>
                                        {/if}
                                    </div>
                                </a>
                            {/if}
                        {/if}
                    {/each}
                </div>
            {/each}
        </div>
    </div>
{/if}

<style>
    :global {
        @import "/src/assets/css/main.css";

        .navigation-gallery-wrapper {
            padding: 2rem;
            background-color: var(--rp-base);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: flex-start;
        }

        .navigation-gallery {
            display: flex;
            gap: 1.5rem;
            width: 100%;
            max-width: calc(100% - 20px);
        }

        .nav-column {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        @media (max-width: 1000px) {
            .navigation-gallery {
                column-count: 3;
            }
        }

        @media (max-width: 900px) {
            .navigation-gallery {
                column-count: 2;
            }
        }

        @media (max-width: 600px) {
            .navigation-gallery {
                column-count: 1;
            }
        }

        .nav-card {
            animation: fadeInScale 0.6s var(--transition-ease) forwards;
            background-color: var(--rp-surface);
            border: 2px solid var(--rp-highlight-low);
            border-radius: var(--border-radius-xl);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.45);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            text-decoration: none;
            color: var(--text);
            opacity: 0;
            transform: scale(0.96);
            transform-origin: center;
            will-change: transform, box-shadow, filter;
            backface-visibility: hidden;
            transition:
                transform var(--hover-response-duration) var(--smooth-ease),
                box-shadow var(--hover-response-duration) var(--smooth-ease),
                border-color var(--hover-response-duration) var(--smooth-ease),
                background var(--hover-response-duration) var(--smooth-ease);
        }

        .nav-card:hover {
            transform: translateY(calc(var(--hover-lift, 8px) * -0.5)) scale(1.02) translateZ(0);
            box-shadow:
                0 12px 40px rgba(0, 0, 0, 0.4),
                0 4px 15px rgba(0, 0, 0, 0.2);
            border-color: var(--hover-border-color, var(--rp-love));
            background: linear-gradient(135deg, var(--rp-surface) 0%, var(--rp-overlay) 100%);
        }

        .card-content {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            position: relative;
            z-index: 2;
            background: transparent;
            transition: background var(--transition-speed) var(--transition-ease);
        }

        .nav-card:hover .card-content {
            background: linear-gradient(
                180deg,
                rgba(196, 167, 231, 0.06) 0%,
                rgba(196, 167, 231, 0.12) 100%
            );
        }

        .nav-card.clickable {
            cursor: pointer;
        }

        .card-image-container {
            width: 100%;
            position: relative;
            overflow: hidden;
            background-color: var(--rp-surface);
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .card-image {
            width: 100%;
            height: fit-content;
            object-fit: contain;
            transition: transform 0.3s ease;
        }

        .nav-card:hover .card-image {
            transform: scale(1.05);
        }

        .placeholder-image {
            position: absolute;
            inset: 0;
            background-color: var(--rp-surface);
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--muted);
            font-size: 1.5rem;
        }

        .card-content {
            padding: 1.2rem;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }

        .card-title {
            font-size: 1.5rem;
            color: var(--rp-gold);
            margin-bottom: 0.5rem;
            line-height: 1.2;
        }

        .card-description {
            font-size: 1rem;
            color: var(--rp-subtle);
            flex-grow: 1;
            margin-bottom: 1rem;
        }

        .emergency-backdrop {
            position: fixed;
            inset: 0;
            background-color: rgba(255, 0, 0, 0.3);
            z-index: 999;
            pointer-events: none;
        }

        .emergency-overlay {
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(255, 0, 0, 0.9);
            color: white;
            font-size: 2rem;
            font-weight: bold;
            padding: 1.5rem 3rem;
            border-radius: 1rem;
            z-index: 1000;
            animation:
                shake 0.05s infinite,
                pulse 1s infinite alternate;
            box-shadow: 0 0 30px red;
        }

        @keyframes shake {
            /* same frames as Vue */
        }
        @keyframes pulse {
            /* same frames as Vue */
        }
    }

    /* Loading Styles */
    .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: var(--rp-base);
        padding: 2rem;
    }

    .loading-content {
        text-align: center;
        max-width: 400px;
        width: 100%;
    }

    .loading-spinner {
        position: relative;
        width: 80px;
        height: 80px;
        margin: 0 auto 2rem auto;
    }

    .spinner-ring {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 3px solid transparent;
        border-top-color: var(--rp-rose);
        border-radius: 50%;
        animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
    }

    .spinner-ring:nth-child(2) {
        border-top-color: var(--rp-gold);
        animation-delay: -0.4s;
        animation-duration: 1.2s;
    }

    .spinner-ring:nth-child(3) {
        border-top-color: var(--rp-love);
        animation-delay: -0.8s;
        animation-duration: 1.8s;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
            opacity: 1;
            scale: 1;
        }
        50% {
            opacity: 0.8;
            scale: 0.95;
        }
        100% {
            transform: rotate(360deg);
            opacity: 1;
            scale: 1;
        }
    }

    .loading-text h2 {
        color: var(--rp-text);
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        font-weight: 600;
        background: linear-gradient(135deg, var(--rp-rose), var(--rp-gold));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .progress-container {
        width: 100%;
        margin-top: 1rem;
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background-color: var(--rp-surface);
        border-radius: 10px;
        overflow: hidden;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--rp-rose), var(--rp-gold), var(--rp-love));
        background-size: 200% 100%;
        border-radius: 10px;
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }

    .progress-text {
        display: inline-block;
        margin-top: 0.5rem;
        color: var(--rp-subtle);
        font-size: 0.9rem;
        font-weight: 500;
    }

    .error-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: var(--rp-base);
        padding: 2rem;
    }

    .error-content {
        text-align: center;
        max-width: 400px;
        width: 100%;
        background-color: var(--rp-surface);
        padding: 2rem;
        border-radius: var(--border-radius-xl);
        border: 2px solid var(--rp-love);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }
</style>
