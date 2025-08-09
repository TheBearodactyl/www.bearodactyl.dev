<script lang="ts">
    import { _ } from "svelte-i18n";
    import type { NavItem } from "$lib/types";
    import { show_discouragement } from "$lib/stores/discouragement";
    import { getCharCountOfRepo, shuffleArray } from "$lib/utils/misc";
    import { onMount } from "svelte";

    const { navItems }: { navItems: NavItem[] } = $props();

    let char_count: number | null = $state(null);
    let loading = $state(true);
    let error: string | null = $state(null);
    let show_emergency = $state(false);

    let columns: NavItem[][] = $state([]);

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

    function handle_card_click(item: NavItem) {
        const title = getItemTitle(item);
        if (title === "Emergency frog!") play_emergency();
        if (item.discouraged) play_discouragement();
    }

    function getItemTitle(item: NavItem): string | undefined {
        if (item.title !== undefined) return item.title;
        if (item.name) return `titles.routes.${item.name}`;
        return undefined;
    }

    function getItemDescription(item: NavItem): string | undefined {
        if (item.description !== undefined) return item.description;
        if (item.name) return `descriptions.routes.${item.name}`;
        return undefined;
    }

    function createBalancedColumns(items: NavItem[], numCols: number): NavItem[][] {
        const cols: NavItem[][] = Array.from({ length: numCols }, () => []);
        items.forEach((item, i) => {
            cols[i % numCols].push(item);
        });
        return cols;
    }

    function updateColumns() {
        let numCols = 5;
        const w = window.innerWidth;
        if (w <= 600) numCols = 1;
        else if (w <= 900) numCols = 2;
        else if (w <= 1000) numCols = 3;

        const shuffled = shuffleArray(navItems);
        columns = createBalancedColumns(shuffled, numCols);
    }

    onMount(async () => {
        try {
            char_count = await getCharCountOfRepo(
                "https://api.github.com/repos/thebearodactyl/www.bearodactyl.dev/languages",
            );
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
    <div>Loading...</div>
{:else if error}
    <div>Error: {error}</div>
{:else if char_count !== null}
    {#if $show_discouragement}
        <div></div>
    {/if}

    <div class="navigation-gallery-wrapper">
        <div class="navigation-gallery">
            {#each columns as col}
                <div class="nav-column">
                    {#each col as item}
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
                                            <p class="card-description">{$_(itemDescription)}</p>
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
                                    window.open(item.coverImage, "_blank")
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
                                            <p class="card-description">{$_(itemDescription)}</p>
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                        {:else if item.route === ""}
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
                                            <p class="card-description">{$_(itemDescription)}</p>
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                        {:else}
                            <a href={item.route} class="nav-card">
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
                                            <source src={item.coverImage} type="video/webm" />
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
                    {/each}
                </div>
            {/each}
        </div>
    </div>
{/if}

<style lang="scss">
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
            height: auto;
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
</style>
