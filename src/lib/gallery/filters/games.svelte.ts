import { create_game_filters_store } from "$lib/stores/filters/games.svelte";
import Fuse from "fuse.js";
import type { Game, GameFilters } from "libbearo";
import { SvelteMap, SvelteSet } from "svelte/reactivity";

export function filters(all_games: () => Game[]) {
    const storage = create_game_filters_store();
    const dropdowns = $state({ genres: false, tags: false });

    const has_search = $derived(() => {
        return storage.filters.title.trim() || storage.filters.developer.trim();
    });

    const fuse = $derived(() => {
        if (!has_search()) return null;
        return new Fuse(all_games(), {
            keys: ["title", "developer", "description"],
            threshold: 0.21,
        });
    });

    const all_genres = $derived(() => {
        const genres = new SvelteSet<string>();
        all_games().forEach((game) => {
            game.genres.forEach((g) => {
                genres.add(g);
            });
        });
        return [...genres].sort();
    });

    const all_tags = $derived(() => {
        const tags = new SvelteSet<string>();
        all_games().forEach((game) => {
            game.tags.forEach((t) => {
                tags.add(t);
            });
        });
        return [...tags].sort();
    });

    function apply_filter(game: Game): boolean {
        const { genres, tags, rating, status } = storage.filters;

        if (genres.length && !genres.every((g) => game.genres.includes(g))) return false;
        if (tags.length && !tags.every((t) => game.tags.includes(t))) return false;
        if (rating && game.rating < rating) return false;
        if (status && game.status !== status) return false;

        return true;
    }

    const filtered_games = $derived(() => {
        let games = all_games();

        if (has_search() && fuse()) {
            const query = `${storage.filters.title} ${storage.filters.developer}`.trim();
            games = fuse()!
                .search(query)
                .map((r) => r.item);
        }

        return games.filter(apply_filter);
    });

    const filtered_tag_counts = $derived(() => {
        const tag_map = new SvelteMap<string, number>();
        const selected_tags = new SvelteSet(storage.filters.tags);

        const games = all_games().filter((book) => {
            const { genres, rating, status } = storage.filters;

            if (
                (genres.length && !genres.every((g) => book.genres.includes(g))) ||
                (rating && book.rating < rating) ||
                (status && book.status !== status)
            ) {
                return false;
            }

            if (has_search() && fuse()) {
                const query = `${storage.filters.title} ${storage.filters.developer}`.trim();
                const matched = fuse()!
                    .search(query)
                    .some((r) => r.item.id === book.id);
                if (!matched) return false;
            }

            return true;
        });

        for (const game of games) {
            for (const tag of game.tags) {
                if (!selected_tags.has(tag)) {
                    tag_map.set(tag, (tag_map.get(tag) || 0) + 1);
                }
            }
        }

        return [...tag_map.entries()].sort((a, b) => b[1] - a[1]);
    });

    const filtered_genre_counts = $derived(() => {
        const genre_map = new SvelteMap<string, number>();
        const selected_genres = new SvelteSet(storage.filters.genres);

        const games = all_games().filter((book: Game) => {
            const { genres, rating, status } = storage.filters;

            if (
                (genres.length && !genres.every((g) => book.genres.includes(g))) ||
                (rating && book.rating < rating) ||
                (status && book.status !== status)
            ) {
                return false;
            }

            if (has_search() && fuse()) {
                const query = `${storage.filters.title} ${storage.filters.developer}`.trim();
                const matched = fuse()!
                    .search(query)
                    .some((r) => r.item.id === book.id);
                if (!matched) return false;
            }

            return true;
        });

        for (const game of games) {
            for (const genre of game.genres) {
                if (!selected_genres.has(genre)) {
                    genre_map.set(genre, (genre_map.get(genre) || 0) + 1);
                }
            }
        }

        return [...genre_map.entries()].sort((a, b) => b[1] - a[1]);
    });

    function toggle_dropdown(type: keyof typeof dropdowns) {
        dropdowns[type] = !dropdowns[type];
    }

    function close_dropdown(type: keyof typeof dropdowns) {
        dropdowns[type] = false;
    }

    function toggle_filter_item(type: "genres" | "tags", item: string) {
        const arr = storage.filters[type];
        const idx = arr.indexOf(item);
        if (idx === -1) {
            arr.push(item);
        } else {
            arr.splice(idx, 1);
        }
        storage.filters = { ...storage.filters };
    }

    function clear_all_filters() {
        storage.filters = storage.defaults;
    }

    function add_genre(genre: string) {
        if (!storage.filters.genres.includes(genre)) {
            storage.filters.genres = [...storage.filters.genres, genre];
        }
    }

    function add_tag(tag: string) {
        if (!storage.filters.tags.includes(tag)) {
            storage.filters.tags = [...storage.filters.tags, tag];
        }
    }

    return {
        get search_filters() {
            return storage.filters;
        },
        set search_filters(value: GameFilters) {
            storage.filters = value;
        },
        get all_genres() {
            return all_genres();
        },
        get all_tags() {
            return all_tags();
        },
        get filtered_games() {
            return filtered_games();
        },
        get dropdowns() {
            return dropdowns;
        },
        get filtered_tag_counts() {
            return filtered_tag_counts();
        },
        get filtered_genre_counts() {
            return filtered_genre_counts();
        },
        toggle_dropdown,
        close_dropdown,
        toggle_filter_item,
        clear_all_filters,
        update_filter: storage.update_filter,
        add_genre,
        add_tag,
    };
}
