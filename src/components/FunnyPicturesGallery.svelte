<script lang="ts">
    import type { FunnyImg } from "$lib/types";
    import { browser } from "$app/environment";
    import { getGithubRelease } from "$lib/utils/getGitHubRelease";
    import { shuffleArray } from "$lib/utils/misc";

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

        $effect.pre(() => {
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

    const { images, isLoading, fetchError } = useData();
</script>

{#if isLoading()}
    <p>Loading images...</p>
{:else if fetchError()}
    <p>Error loading images: {fetchError()}</p>
{:else}
    <div class="masonry" aria-label="Masonry image gallery">
        {#each images() as image}
            <figure class="masonry-item">
                <img src={image.src} alt={image.alt ?? ""} loading="lazy" />
                {#if image.alt}
                    <figcaption class="caption">{image.alt}</figcaption>
                {/if}
            </figure>
        {/each}
    </div>
{/if}

<style>
    :global {
        @import url("/src/assets/css/main.css");
    }

    .masonry {
        column-count: 3;
        column-gap: 1rem;
        padding: 1rem;
    }

    .masonry-item {
        break-inside: avoid;
        -webkit-column-break-inside: avoid;
        margin-bottom: 1rem;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        border-radius: 10px;
        overflow: hidden;
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

    @media (max-width: 900px) {
        .masonry {
            column-count: 2;
        }
    }

    @media (max-width: 520px) {
        .masonry {
            column-count: 1;
        }
    }
</style>
