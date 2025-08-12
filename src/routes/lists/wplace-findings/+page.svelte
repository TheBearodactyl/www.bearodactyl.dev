<script lang="ts">
    import { use_generic_data } from "$lib/gallery/data/generic.svelte";
    import type { WplaceScreenshot } from "$lib/types";
    import { _ } from "svelte-i18n";

    let data = use_generic_data<WplaceScreenshot>("wplace.json");
</script>

<div class="book-gallery">
    <h1 class="gallery-title">{$_("titles.routes.wplace")}</h1>

    {#if data.is_loading}
        <div class="progress-wrapper">
            <div class="progress-bar">
                <div
                    class="progress-fill"
                    style="width: {data.dl_progress}%"
                ></div>
            </div>
            <p>{$_("indicators.loading", { values: { progress: data.dl_progress } })}</p>
        </div>
    {/if}

    {#if data.fetch_err}
        <div class="error-message">
            {$_("indicators.list-load-error", { values: { err: data.fetch_err } })}
        </div>
    {/if}

    {#if !data.is_loading && !data.fetch_err}
        <div class="wplace-gallery">
            {#each data.items as item}
                <div class="wplace-ss">
                    <img
                        src={item.coverImage}
                        alt={item.alt}
                    />

                    <div class="wplace-ss-alt">{item.alt}</div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    :global {
        @import url("/src/assets/css/main.css");
    }

    .wplace-gallery {
        column-count: 3;
        column-gap: 1.5rem;
        width: 100%;
        padding-bottom: 2rem;
        transition: all 0.6s var(--transition-ease);
    }

    .wplace-gallery > .wplace-ss {
        break-inside: avoid-column;
        margin-bottom: 1.5rem;
        transition:
            transform 0.6s var(--spring-ease),
            opacity 0.6s var(--smooth-ease);
    }

    .wplace-ss {
        position: relative;
        text-align: center;
        color: var(--rp-text);
        overflow: hidden;
        border-radius: 20px;
        width: 100%;
        height: fit-content !important;
    }

    .wplace-ss img {
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        width: 100%;
        height: auto;
        display: block;
    }

    .wplace-ss-alt {
        background-color: var(--rp-overlay);
        position: absolute;
        bottom: 0px;
        width: 105%;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        transform: translateY(25px);
    }

    .wplace-ss:hover .wplace-ss-alt {
        animation: slideInSmooth 0.4s var(--transition-ease) forwards;
    }

    .wplace-ss:not(:hover) .wplace-ss-alt {
        animation: slideOutSmooth 0.4s var(--transition-ease) forwards;
    }

    @keyframes slideInSmooth {
        from {
            transform: translateY(25px);
        }
        to {
            transform: translateY(0px);
        }
    }
    @keyframes slideOutSmooth {
        from {
            transform: translateY(0px);
        }
        to {
            transform: translateY(25px);
        }
    }
</style>