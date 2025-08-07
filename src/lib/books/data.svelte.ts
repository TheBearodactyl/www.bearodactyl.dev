import type { Book } from "$lib/types";
import { cacheCoverImage } from "$lib/utils/cacheCoverImage";
import { getGithubRelease } from "$lib/utils/getGitHubRelease";
import { shuffleArray } from "$lib/utils/misc";
import { onMount } from "svelte";

const IMAGE_CACHE_NAME = "book-cover-cache";

export function createDataStore() {
    let books = $state<Book[]>([]);
    let isLoading = $state(true);
    let fetchError = $state<string | null>(null);
    let downloadProgress = $state(0);
    let isContentVisible = $state(false);

    async function loadBooksWithProgress() {
        try {
            isLoading = true;
            downloadProgress = 0;

            downloadProgress = 5;

            const fileContents = await getGithubRelease(
                "thebearodactyl",
                "www.bearodactyl.dev",
                "books.json"
            );
            const data = JSON.parse(await fileContents.text());

            downloadProgress = 20;

            const booksWithImages = data.filter((book: Book) => book.coverImage);

            const promises = booksWithImages.map(async (book: Book, index: number) => {
                book.coverImage = await cacheCoverImage(IMAGE_CACHE_NAME, book.coverImage);
                const progress = 20 + Math.round(((index + 1) / booksWithImages.length) * 80);
                downloadProgress = progress;
            });

            await Promise.all(promises);

            books = shuffleArray<Book>(data);
            downloadProgress = 100;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            fetchError = err?.message ?? String(err);
            console.error("Error loading books:", err);
        } finally {
            isLoading = false;
        }
    }

    return {
        get books() {
            return books;
        },
        set books(value: Book[]) {
            books = value;
        },
        get isLoading() {
            return isLoading;
        },
        get fetchError() {
            return fetchError;
        },
        get downloadProgress() {
            return downloadProgress;
        },
        get isContentVisible() {
            return isContentVisible;
        },
        set isContentVisible(value: boolean) {
            isContentVisible = value;
        },
        loadBooksWithProgress
    };
}

export const dataStore = createDataStore();

export function useData() {
    onMount(async () => {
        await dataStore.loadBooksWithProgress();
    });

    return dataStore;
}
