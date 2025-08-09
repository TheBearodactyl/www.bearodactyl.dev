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
        images: () => imgs,
        isLoading: () => isLoading,
        fetchError: () => fetchError,
        downloadProgress: () => downloadProgress,
    };
}
