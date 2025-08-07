<script lang="ts">
    import type { NavItem } from "$lib/types";
    import { show_discouragement } from "$lib/stores/discouragement";
    import { chooseRandom, randBool } from "$lib/utils/misc";

    const {
        navItems
    }: {
        navItems: NavItem[];
    } = $props();

    let show_emergency = $state(false);

    async function play_emergency() {
        const audio = new Audio("https://www.myinstants.com/media/sounds/emergency-frog-situation.mp3");
        await audio.play();
        show_emergency = true;
        setTimeout(() => (show_emergency = false), 3500);
    }

    async function play_discouragement() {
        show_discouragement.set(true);
    }

    function handle_card_click(item: NavItem) {
        if (item.title === "Emergency frog!") play_emergency();
        if (item.title === undefined) play_discouragement();
    }
</script>

{#if $show_discouragement}
    <div></div>
{:else}
    <div class="navigation-gallery-wrapper">
        <div class="navigation-gallery">
            {#each navItems as item}
                {#if item.title === "Emergency frog!"}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div class="nav-card clickable" onclick={() => handle_card_click(item)}>
                        <div class="card-image-container">
                            {#if item.coverImage}
                                <img src={item.coverImage} alt={`Cover for ${item.title}`} class="card-image" />
                            {:else}
                                <div class="placeholder-image">?</div>
                            {/if}
                        </div>
                        <div class="card-content">
                            <h2 class="card-title">{item.title}</h2>
                            <p class="card-description">{item.description}</p>
                        </div>
                    </div>
                {:else if !item.title}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div class="nav-card clickable" onclick={() => handle_card_click(item)}>
                        <div class="card-image-container">
                            {#if item.coverImage}
                                <img src={item.coverImage} alt={`Cover for ${item.title}`} class="card-image" />
                            {:else}
                                <div></div>
                            {/if}
                        </div>
                        {#if !item.title === undefined && !item.description === undefined}
                            <div class="card-content">
                                {#if !item.title === undefined}
                                    <h2 class="card-title">{item.title}</h2>
                                {/if}
                                <p class="card-description">{item.description}</p>
                            </div>
                        {/if}
                    </div>
                {:else}
                    <a href={item.route} class="nav-card">
                        <div class="card-image-container">
                            {#if item.coverImage && !item.coverImage.endsWith("webm")}
                                <img src={item.coverImage} alt={`Cover for ${item.title}`} class="card-image" />
                            {:else if item.coverImage && item.coverImage.endsWith("webm")}
                                <video disablepictureinpicture autoplay loop muted playsinline class="card-image">
                                    <source src={item.coverImage} type="video/webm" />
                                </video>
                            {:else}
                                <div class="placeholder-image">?</div>
                            {/if}
                        </div>
                        <div class="card-content">
                            <h2 class="card-title">{item.title}</h2>
                            <p class="card-description">{item.description}</p>
                        </div>
                    </a>
                {/if}
            {/each}
        </div>
    </div>

    {#if show_emergency}
        <div class="emergency-backdrop"></div>
        <div class="emergency-overlay">EMERGENCY FROG!</div>
    {/if}
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
            column-count: 3;
            column-gap: 1.5rem;
            max-width: 1200px;
            width: 100%;
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
            width: 100%;
            background-color: var(--rp-overlay);
            border: 1px solid var(--rp-highlight-low);
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            text-decoration: none;
            color: var(--text);
            transition:
                transform 0.2s ease,
                border-color 0.2s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            margin-bottom: 1.5rem;
            break-inside: avoid-column;
        }

        .nav-card:hover {
            transform: translateY(-5px);
            border-color: var(--rp-iris);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
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
