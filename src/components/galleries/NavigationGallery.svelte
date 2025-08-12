<script lang="ts">
    import { _ } from "svelte-i18n";
    import type { RouteItemNext } from "$lib/types";
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

    let char_count = $state<number | null>(null);
    let loading = $state(true);
    let error = $state<string | null>(null);
    let show_emergency = $state(false);
    let loading_progress = $state(0);
    let loading_stage = $state("Initializing...");
    let columns = $state<RouteItemNext[][]>([]);

    const getItemTitle = (item: RouteItemNext): string | undefined => {
        return item.title ?? (item.name ? `titles.routes.${item.name}` : item.nameKey);
    };

    const getItemDescription = (item: RouteItemNext): string | undefined => {
        return (
            item.description ??
            (item.name
                ? `descriptions.routes.${item.name}`
                : item.nameKey
                  ? `descriptions.routes.${item.nameKey.split(".").pop()}`
                  : undefined)
        );
    };

    const createColumns = (items: RouteItemNext[], numCols: number): RouteItemNext[][] => {
        const cols = Array.from({ length: numCols }, () => [] as RouteItemNext[]);
        items.forEach((item, i) => cols[i % numCols].push(item));
        return cols;
    };

    const getColumnCount = (): number => {
        if (typeof num_cols === "number" && num_cols > 0) return num_cols;

        const w = globalThis.innerWidth ?? 1200;
        if (w <= 600) return 1;
        if (w <= 900) return 2;
        if (w <= 1000) return 3;
        return 5;
    };

    const updateColumns = () => {
        const shuffled = shuffleItems ? shuffle(navItems) : navItems;
        columns = createColumns(shuffled, getColumnCount());
    };

    const updateLoadingProgress = (progress: number, stage: string) => {
        loading_progress = Math.min(progress, 100);
        loading_stage = stage;
    };

    const playAudio = async (src: string) => {
        try {
            await new Audio(src).play();
        } catch (e) {
            console.error("Audio playback failed:", e);
        }
    };

    const playEmergency = async () => {
        await playAudio("https://www.myinstants.com/media/sounds/emergency-frog-situation.mp3");
        show_emergency = true;
        setTimeout(() => (show_emergency = false), 3500);
    };

    const handleCardClick = (item: RouteItemNext) => {
        const title = getItemTitle(item);

        if (title === "Emergency frog!") playEmergency();
        if (item.discouraged) show_discouragement.set(true);
        if (item.audioSrc) playAudio(item.audioSrc);
        if (item.path && browser) window.location.href = item.path;
        if (item.path === "" && item.coverImage) window.open(item.coverImage, "_blank");
    };

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
            error = err instanceof Error ? err.message : "Failed to load data";
        } finally {
            loading = false;
            updateColumns();
            if (browser) {
                window.addEventListener("resize", updateColumns, { passive: true });
            }
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
    <div class="navigation-gallery-wrapper">
        <div class="navigation-gallery">
            {#each columns as col}
                <div class="nav-column">
                    {#each col as item}
                        {#if item.homePage !== false}
                            {@const itemTitle = getItemTitle(item)}
                            {@const itemDescription = getItemDescription(item)}

                            <button
                                class="nav-card {item.path ? 'clickable' : ''}"
                                title={itemTitle ? $_(itemTitle) : "Navigation item"}
                                onclick={() => handleCardClick(item)}
                            >
                                <div class="card-image-container">
                                    {#if item.coverImage}
                                        {#if item.coverImage.endsWith("webm")}
                                            <video
                                                src={item.coverImage}
                                                class="card-image"
                                                autoplay
                                                loop
                                                muted
                                                playsinline
                                                disablepictureinpicture
                                            ></video>
                                        {:else}
                                            <img
                                                src={item.coverImage}
                                                alt={`Cover for ${itemTitle}`}
                                                class="card-image"
                                                loading="lazy"
                                            />
                                        {/if}
                                    {:else if item.videoSrc}
                                        <video
                                            src={item.videoSrc}
                                            loop
                                            autoplay
                                            playsinline
                                            muted
                                            disablepictureinpicture
                                        ></video>
                                    {:else}
                                        <div class="placeholder-image">?</div>
                                    {/if}
                                </div>

                                {#if itemTitle || itemDescription}
                                    <div class="card-content">
                                        {#if itemTitle}
                                            <h2 class="card-title">{$_(itemTitle)}</h2>
                                        {/if}
                                        {#if itemDescription}
                                            <p class="card-description">
                                                {itemDescription ===
                                                "descriptions.routes.website-src"
                                                    ? $_(itemDescription, {
                                                          values: {
                                                              charcount:
                                                                  char_count.toLocaleString(),
                                                          },
                                                      })
                                                    : $_(itemDescription)}
                                            </p>
                                        {/if}
                                    </div>
                                {/if}
                            </button>
                        {/if}
                    {/each}
                </div>
            {/each}
        </div>
    </div>
{/if}

{#if show_emergency}
    <div class="emergency-overlay">EMERGENCY FROG SITUATION!</div>
{/if}

<style>
    :global {
        @import url("/src/assets/css/main.css");
    }
</style>
