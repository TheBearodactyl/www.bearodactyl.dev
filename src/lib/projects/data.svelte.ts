import { browser } from '$app/environment';
import type { Project } from '$lib/types';
import { getGithubRelease } from '$lib/utils/getGitHubRelease';

const IMAGE_CACHE = 'project-cover-cache';

async function cacheCoverImage(url: string) {
	try {
		const cache = await caches.open(IMAGE_CACHE);
		const res = await cache.match(url);
		if (res) {
			const blob = await res.blob();
			return URL.createObjectURL(blob);
		}
		const resp = await fetch(url, { mode: 'cors' });
		if (resp.ok) {
			await cache.put(url, resp.clone());
			const blob = await resp.blob();
			return URL.createObjectURL(blob);
		}
		console.warn(`Failed to fetch cover image: ${url}`);
		return url;
	} catch {
		return url;
	}
}

export function useData() {
	let projects = $state<Project[]>([]);
	let isLoading = $state(false);
	let fetchError = $state<string | null>(null);
	let downloadProgress = $state(0);

	async function loadWithProgress() {
		try {
			isLoading = true;
			downloadProgress = 10;

			const file = await getGithubRelease('TheBearodactyl', 'bearodactyl.dev', 'projects.json');
			downloadProgress = 50;

			const text = await file.text();
			const data: Project[] = JSON.parse(text);

			const withImages = data.filter((p) => p.coverImage);
			let loaded = 0;
			for (const p of data) {
				if (p.coverImage) {
					p.coverImage = await cacheCoverImage(p.coverImage);
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
		downloadProgress: () => downloadProgress
	};
}
