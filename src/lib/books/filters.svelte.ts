import { browser } from '$app/environment';
import type { Book } from '$lib/types';
import Fuse from 'fuse.js';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';

interface Filters {
	title: string;
	author: string;
	genres: string[];
	tags: string[];
	rating: number | null;
	status: string;
}

function createFiltersStore() {
	const defaultFilters: Filters = {
		title: '',
		author: '',
		genres: [],
		tags: [],
		rating: null,
		status: ''
	};

	let filters = $state<Filters>({ ...defaultFilters });

	if (browser) {
		const stored = localStorage.getItem('book-filters');
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				filters = { ...defaultFilters, ...parsed };
			} catch {
				filters = { ...defaultFilters };
			}
		}

		// Persist changes to localStorage
		$effect(() => {
			localStorage.setItem('book-filters', JSON.stringify(filters));
		});
	}

	return {
		get filters() {
			return filters;
		},
		set filters(newFilters: Filters) {
			filters = newFilters;
		},
		updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
			filters[key] = value;
		}
	};
}

export function useFilters(allBooks: () => Book[]) {
	const storage = createFiltersStore();
	const dropdowns = $state({ genres: false, tags: false });

	const hasSearch = $derived(() => {
		return storage.filters.title.trim() || storage.filters.author.trim();
	});

	const fuse = $derived(() => {
		if (!hasSearch()) return null;
		return new Fuse(allBooks(), {
			keys: ['title', 'author', 'genres', 'tags'],
			threshold: 0.3
		});
	});

	const allGenres = $derived(() => {
		const genres = new SvelteSet<string>();
		for (const book of allBooks()) {
			for (const g of book.genres) genres.add(g);
		}
		return [...genres].sort();
	});

	const allTags = $derived(() => {
		const tags = new SvelteSet<string>();
		for (const book of allBooks()) {
			for (const t of book.tags) tags.add(t);
		}
		return [...tags].sort();
	});

	function applyFilter(book: Book): boolean {
		const { genres, tags, rating, status } = storage.filters;

		if (genres.length && !genres.every((g) => book.genres.includes(g))) return false;
		if (tags.length && !tags.every((t) => book.tags.includes(t))) return false;
		if (rating && book.rating < rating) return false;
		if (status && book.status !== status) return false;

		return true;
	}

	const filteredBooks = $derived(() => {
		let books = allBooks();

		if (hasSearch() && fuse()) {
			const query = `${storage.filters.title} ${storage.filters.author}`.trim();
			books = fuse()!
				.search(query)
				.map((r) => r.item);
		}

		return books.filter(applyFilter);
	});

	const filteredTagCounts = $derived(() => {
		const tagMap = new SvelteMap<string, number>();
		const selectedTags = new SvelteSet(storage.filters.tags);

		const books = allBooks().filter((book) => {
			const { genres, rating, status } = storage.filters;

			if (
				(genres.length && !genres.every((g) => book.genres.includes(g))) ||
				(rating && book.rating < rating) ||
				(status && book.status !== status)
			) {
				return false;
			}

			if (hasSearch() && fuse()) {
				const query = `${storage.filters.title} ${storage.filters.author}`.trim();
				const matched = fuse()!
					.search(query)
					.some((r) => r.item.id === book.id);
				if (!matched) return false;
			}

			return true;
		});

		for (const book of books) {
			for (const tag of book.tags) {
				if (!selectedTags.has(tag)) {
					tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
				}
			}
		}

		return [...tagMap.entries()].sort((a, b) => b[1] - a[1]);
	});

	const filteredGenreCounts = $derived(() => {
		const genreMap = new SvelteMap<string, number>();
		const selectedGenres = new SvelteSet(storage.filters.genres);

		const books = allBooks().filter((book: Book) => {
			const { genres, rating, status } = storage.filters;

			if (
				(genres.length && !genres.every((g) => book.genres.includes(g))) ||
				(rating && book.rating < rating) ||
				(status && book.status !== status)
			) {
				return false;
			}

			if (hasSearch() && fuse()) {
				const query = `${storage.filters.title} ${storage.filters.author}`.trim();
				const matched = fuse()!
					.search(query)
					.some((r) => r.item.id === book.id);
				if (!matched) return false;
			}

			return true;
		});

		for (const book of books) {
			for (const genre of book.genres) {
				if (!selectedGenres.has(genre)) {
					genreMap.set(genre, (genreMap.get(genre) || 0) + 1);
				}
			}
		}

		return [...genreMap.entries()].sort((a, b) => b[1] - a[1]);
	});

	function toggleDropdown(type: keyof typeof dropdowns) {
		dropdowns[type] = !dropdowns[type];
	}

	function closeDropdown(type: keyof typeof dropdowns) {
		dropdowns[type] = false;
	}

	function toggleFilterItem(type: 'genres' | 'tags', item: string) {
		const arr = storage.filters[type];
		const idx = arr.indexOf(item);
		if (idx === -1) {
			arr.push(item);
		} else {
			arr.splice(idx, 1);
		}
		storage.filters = { ...storage.filters };
	}

	function clearAllFilters() {
		storage.filters = {
			title: '',
			author: '',
			genres: [],
			tags: [],
			rating: null,
			status: ''
		};
	}

	return {
		get searchFilters() {
			return storage.filters;
		},
		set searchFilters(value: Filters) {
			storage.filters = value;
		},
		get allGenres() {
			return allGenres();
		},
		get allTags() {
			return allTags();
		},
		get filteredBooks() {
			return filteredBooks();
		},
		get dropdowns() {
			return dropdowns;
		},
		get filteredTagCounts() {
			return filteredTagCounts();
		},
		get filteredGenreCounts() {
			return filteredGenreCounts();
		},
		toggleDropdown,
		closeDropdown,
		toggleFilterItem,
		clearAllFilters,
		updateFilter: storage.updateFilter
	};
}