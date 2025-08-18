import { Bearror, cache_cover, get_gh_release, LogLvl, shuffle, type Game } from "libbearo";
import { onMount } from "svelte";

export function data() {
    let games = $state<Game[]>([]);
    let is_loading = $state(true);
    let fetch_err = $state<string | null>(null);
    let dl_progress = $state(0);
    let is_content_visible = $state(false);

    async function load() {
        try {
            is_loading = true;
            dl_progress = 5;

            const file_contents = await get_gh_release(
                "thebearodactyl",
                "www.bearodactyl.dev",
                "games.json",
            );
            const data: Game[] = JSON.parse(await file_contents.text());
            dl_progress = 20;
            const games_with_covers = data.filter((game: Game) => game.coverImage);
            const promises = games_with_covers.map(async (game: Game, index: number) => {
                game.coverImage = await cache_cover("game-cover-cache", game.coverImage || "");
                const progress = 20 + Math.round(((index + 1) / games_with_covers.length) * 80);
                dl_progress = progress;
            });

            await Promise.all(promises);

            games = shuffle(data);
            dl_progress = 100;
        } catch (err) {
            const error_msg = new Bearror(LogLvl.ERR, "Failed to load games list")
                .set_full_msg(err)
                .to_string();

            fetch_err = error_msg;
            console.error(error_msg);
        } finally {
            is_loading = false;
        }
    }

    return {
        get games(): Game[] {
            return games;
        },
        set games(value: Game[]) {
            games = value;
        },
        get is_loading(): boolean {
            return is_loading;
        },
        get fetch_err(): string | null {
            return fetch_err;
        },
        get dl_progress(): number {
            return dl_progress;
        },
        get is_content_visible(): boolean {
            return is_content_visible;
        },
        set is_content_visible(value: boolean) {
            is_content_visible = value;
        },
        load,
    };
}

export const games_data = data();

export function use_games_data() {
    onMount(async () => {
        await games_data.load();
    });

    return games_data;
}
