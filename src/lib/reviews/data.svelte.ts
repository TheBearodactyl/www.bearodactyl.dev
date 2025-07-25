import { browser } from '$app/environment';
import type { Review } from '$lib/types';
import { getGithubRelease } from '$lib/utils/getGitHubRelease';

function sortReviews(input: readonly Review[]): Review[] {
	return input.slice().sort((a, b) => a.chapter - b.chapter);
}

export function useData() {
	let reviews = $state<Review[]>([]);
	let isLoading = $state(false);
	let fetchError = $state<string | null>(null);
	let downloadProgress = $state(0);

	async function loadWithProgress() {
		try {
			isLoading = true;
			downloadProgress = 10;

			const file = await getGithubRelease('TheBearodactyl', 'bearodactyl.dev', 'reviews.json');
			downloadProgress = 60;

			let data: Review[] = JSON.parse(await file.text());
			data = sortReviews(data);
			reviews = data;

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
		reviews: () => reviews,
		isLoading: () => isLoading,
		fetchError: () => fetchError,
		downloadProgress: () => downloadProgress
	};
}
