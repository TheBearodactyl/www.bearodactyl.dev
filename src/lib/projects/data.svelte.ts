import { browser } from "$app/environment";
import type { Project } from "$lib/types";
import { cacheCoverImage } from "$lib/utils/cacheCoverImage";
import { getGithubRelease } from "$lib/utils/getGitHubRelease";

const IMAGE_CACHE_NAME = "project-cover-cache";

export function useData() {
    let projects = $state<Project[]>([]);
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
                "projects.json",
            );
            downloadProgress = 50;

            const text = await file.text();
            const data: Project[] = JSON.parse(text);

            const withImages = data.filter((p) => p.coverImage);
            let loaded = 0;
            for (const p of data) {
                if (p.coverImage) {
                    p.coverImage = await cacheCoverImage(IMAGE_CACHE_NAME, p.coverImage);
                    loaded++;
                    downloadProgress = 50 + Math.round((loaded / withImages.length) * 50);
                }
            }

            projects = data;
            downloadProgress = 100;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        projects: () => projects,
        isLoading: () => isLoading,
        fetchError: () => fetchError,
        downloadProgress: () => downloadProgress,
    };
}
