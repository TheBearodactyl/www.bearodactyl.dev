import { Bearror, cache_cover, get_gh_release, LogLvl, shuffle } from "libbearo";
import { onMount } from "svelte";

export function data<T extends { coverImage: string }>(filename: string) {
    let items = $state<T[]>([]);
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
                filename,
            );

            const data: T[] = JSON.parse(await file_contents.text());
            dl_progress = 20;
            const items_with_images = data.filter((item: T) => item.coverImage);
            const promises = items_with_images.map(async (item: T, idx: number) => {
                item.coverImage = await cache_cover(
                    `${filename.split(".").at(0) || "items"}-cover-cache`,
                    item.coverImage,
                );
                const progress = 20 + Math.round(((idx + 1) / items_with_images.length) * 80);
                dl_progress = progress;
            });

            await Promise.all(promises);

            items = shuffle<T>(data);
            dl_progress = 100;
        } catch (err) {
            const error_msg = new Bearror(LogLvl.ERR, "Failed to load books list")
                .set_full_msg(err)
                .to_string();

            fetch_err = error_msg;
            console.error(error_msg);
        } finally {
            is_loading = false;
        }
    }

    return {
        get items(): T[] {
            return items;
        },
        set items(value: T[]) {
            items = value;
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

export function use_generic_data<T extends { coverImage: string }>(filename: string) {
    const generic_data = data<T>(filename);

    onMount(async () => {
        await generic_data.load();
    });

    return generic_data;
}
