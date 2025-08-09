import { LogLvl, type Book } from "$lib/types";
import { cache_cover } from "$lib/utils/loading";
import { Bearror } from "$lib/utils/errs";
import { get_data_release } from "$lib/utils/net";
import { shuffle } from "$lib/utils/rand";
import { onMount } from "svelte";

export function data() {
    let books = $state<Book[]>([]);
    let is_loading = $state(true);
    let fetch_err = $state<string | null>(null);
    let dl_progress = $state(0);
    let is_content_visible = $state(false);

    async function load() {
        try {
            is_loading = true;
            dl_progress = 5;

            const file_contents = await get_data_release("books");
            const data: Book[] = JSON.parse(await file_contents.text());
            dl_progress = 20;
            const books_with_covers = data.filter((book: Book) => book.coverImage);
            const promises = books_with_covers.map(async (book: Book, index: number) => {
                book.coverImage = await cache_cover("book-cover-cache", book.coverImage);
                const progress = 20 + Math.round(((index + 1) / books_with_covers.length) * 80);
                dl_progress = progress;
            });

            await Promise.all(promises);

            books = shuffle<Book>(data);
            dl_progress = 100;
        } catch (err) {
            const error_msg = new Bearror(LogLvl.ERR, "Failed to load books list")
                .set_full_msg(err)
                .to_string();

            fetch_err = error_msg;
            console.error(error_msg);
        }
    }

    return {
        get books(): Book[] {
            return books;
        },
        set books(value: Book[]) {
            books = value;
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

export const books_data = data();

export function use_books_data() {
    onMount(async () => {
        await books_data.load();
    });

    return books_data;
}
