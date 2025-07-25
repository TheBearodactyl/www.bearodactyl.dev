import { browser } from '$app/environment';
import type { Review } from '$lib/types';
import Fuse from 'fuse.js';
import { SvelteMap } from 'svelte/reactivity';

interface ReviewFilters {
	search: string;
	minRating?: number;
	maxRating?: number;
}

function createFiltersStore() {
	const defaultFilters: ReviewFilters = {
		search: '',
		minRating: undefined,
		maxRating: undefined
	};

	let filters = $state<ReviewFilters>({ ...defaultFilters });

	if (browser) {
		const stored = localStorage.getItem('review-filters');
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				filters = { ...defaultFilters, ...parsed };
			} catch {
				filters = { ...defaultFilters };
			}
		}

		$effect(() => {
			localStorage.setItem('review-filters', JSON.stringify(filters));
		});
	}

	return {
		get filters() {
			return filters;
		},
		set filters(newFilters: ReviewFilters) {
			filters = newFilters;
		},
		updateFilter<K extends keyof ReviewFilters>(key: K, value: ReviewFilters[K]) {
			filters[key] = value;
		}
	};
}

export function useFilters(allReviews: () => Review[]) {
	const storage = createFiltersStore();
	const dropdowns = $state({ rating: false });

	const hasSearch = $derived(storage.filters.search.trim().length > 0);

	const fuse = $derived(() => {
		return new Fuse(allReviews(), {
			keys: ['description', 'thoughts'],
			threshold: 0.3
		});
	});

	const filteredReviews = $derived(() => {
		let result = allReviews();

		if (hasSearch) {
			const query = storage.filters.search.trim();
			result = fuse()
				.search(query)
				.map(({ item }) => item);
		}

		if (storage.filters.minRating !== undefined) {
			result = result.filter((r) => r.rating >= storage.filters.minRating!);
		}

		if (storage.filters.maxRating !== undefined) {
			result = result.filter((r) => r.rating <= storage.filters.maxRating!);
		}

		return result;
	});

	const ratingCounts = $derived(() => {
		const countMap = new SvelteMap<number, number>();

		for (const review of allReviews()) {
			const rating = review.rating;
			countMap.set(rating, (countMap.get(rating) || 0) + 1);
		}

		return [...countMap.entries()].sort((a, b) => b[0] - a[0]);
	});

	function toggleDropdown(type: keyof typeof dropdowns) {
		dropdowns[type] = !dropdowns[type];
	}

	function closeDropdown(type: keyof typeof dropdowns) {
		dropdowns[type] = false;
	}

	function openDropdown(type: keyof typeof dropdowns) {
		dropdowns[type] = true;
	}

	function delayedCloseDropdown(type: keyof typeof dropdowns) {
		setTimeout(() => {
			closeDropdown(type);
		}, 150);
	}

	return {
		get searchFilters() {
			return storage.filters;
		},
		set searchFilters(value: ReviewFilters) {
			storage.filters = value;
		},
		get filteredReviews() {
			return filteredReviews;
		},
		get dropdowns() {
			return dropdowns;
		},
		get ratingCounts() {
			return ratingCounts;
		},
		toggleDropdown,
		closeDropdown,
		openDropdown,
		delayedCloseDropdown,
		updateFilter: storage.updateFilter
	};
}