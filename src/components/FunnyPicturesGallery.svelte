<script lang="ts">
    import { browser } from "$app/environment";
    import { getGithubRelease } from "$lib/utils/getGitHubRelease";
    import { shuffleArray, splitIntoParts } from "$lib/utils/misc";
    import { _ } from "svelte-i18n";
    import type { FunnyImg } from "$lib/types";

    export function useData() {
        let imgs = $state<FunnyImg[]>([]);
        let isLoading = $state(false);
        let fetchError = $state<string | null>(null);
        let downloadProgress = $state(0);

        async function loadWithProgress() {
            try {
                isLoading = true;
                downloadProgress = 10;

                const file = await getGithubRelease(
                    "TheBearodactyl",
                    "bearodactyl.dev",
                    "funny_images.json",
                );
                downloadProgress = 60;

                let data: FunnyImg[] = JSON.parse(await file.text());
                data = shuffleArray(data);
                imgs = data;

                downloadProgress = 100;
            } catch (e: any) {
                fetchError = e?.message ?? String(e);
                console.error(e);
            } finally {
                isLoading = false;
            }
        }

        $effect(() => {
            if (browser) {
                loadWithProgress();
            }
        });

        return {
            images: () => imgs,
            isLoading: () => isLoading,
            fetchError: () => fetchError,
            downloadProgress: () => downloadProgress,
        };
    }

    const { images, isLoading, fetchError, downloadProgress } = useData();
</script>

{#if isLoading()}
    <p>
        {$_("indicators.loading", {
            values: {
                progress: downloadProgress(),
            },
        })}
    </p>
{:else if fetchError()}
    <p>
        {$_("indicators.list-load-error", {
            values: {
                err: fetchError(),
            },
        })}
    </p>
{:else}
    <div class="masonry" aria-label="Masonry image gallery">
        {#each splitIntoParts(images(), 3) as column}
            <div class="masonry-column">
                {#each column as image}
                    <figure class="masonry-item">
                        <img src={image.src} alt={image.alt ?? ""} loading="lazy" />
                        {#if image.alt}
                            <figcaption class="caption">{image.alt}</figcaption>
                        {/if}
                    </figure>
                {/each}
            </div>
        {/each}
    </div>
{/if}

<style>
    :global {
        @import url("/src/assets/css/main.css");
    }

    .masonry {
        display: flex;
        gap: 0.1rem;
        padding: 0.5rem;
    }

    .masonry-column {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .masonry-item {
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        border-radius: 10px;
        overflow: hidden;
        width: 90%;
        background: #fff;
        position: relative;
    }

    .masonry-item img {
        width: 100%;
        height: auto;
        display: block;
    }

    .caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0.5rem 0.75rem;
        font-size: 0.9rem;
        color: #fff;
        background: rgba(0, 0, 0, 0.6);
        transform: translateY(100%);
        transition: transform 0.3s ease;
        pointer-events: none;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
    }

    .masonry-item:hover .caption {
        transform: translateY(0);
        pointer-events: auto;
    }

    /* Responsive: 2 columns */
    @media (max-width: 900px) {
        .masonry {
            gap: 0.5rem;
        }
        .masonry-column {
            flex: 1 1 50%;
        }
        /* Only render 2 columns for smaller */
        /* Optional: you can slice columns here if you want */
    }

    /* Responsive: 1 column */
    @media (max-width: 520px) {
        .masonry {
            flex-direction: column;
        }
        .masonry-column {
            width: 100%;
            flex: none;
        }
    }
</style>
