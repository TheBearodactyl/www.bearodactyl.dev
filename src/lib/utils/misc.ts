import { browser } from "$app/environment";
import type { Book, FunnyImg, Game } from "$lib/types";
import type { HTMLImgAttributes } from "svelte/elements";
import { writable, type Writable } from "svelte/store";

function isBook(item: Book | Game): item is Book {
    return typeof item === "object" && "author" in item && typeof item.author === "string";
}

function isGame(item: Book | Game): item is Game {
    return typeof item === "object" && "developer" in item && typeof item.developer === "string";
}

export function isPeakFiction(item: Book | Game): boolean {
    if (isBook(item)) {
        return item.title.toLowerCase() === "one piece";
    } else if (isGame(item)) {
        return item.title.toLowerCase() === "p5r";
    } else {
        return false;
    }
}

export function shuffleArray<T>(input: readonly T[]): T[] {
    const array = input.slice();

    const getRandomIndex = (max: number): number => {
        let randVal;

        if (typeof window !== "undefined") {
            randVal = window.crypto.getRandomValues(new Uint32Array(1))[0];
        } else {
            randVal = Math.random();
        }

        return Math.floor((randVal * max + Math.random() * max) % (max + 1));
    };

    const passes = 20;

    for (let k = 0; k < passes; k++) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = getRandomIndex(i);

            if (j >= 0 && j < array.length) {
                const temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }
    }

    return array;
}

export function createPersistedStore<T>(key: string, initial: T): Writable<T> {
    const store = writable<T>(initial);

    if (browser) {
        const json = localStorage.getItem(key);
        if (json) store.set(JSON.parse(json));

        store.subscribe((value) => {
            localStorage.setItem(key, JSON.stringify(value));
        });
    }

    return store;
}

export function randBool(): boolean {
    return Math.random() < 0.5;
}

export function chooseRandom<T>(arr: T[]): T {
    const rand_idx = Math.floor(Math.random() * arr.length);
    return arr[rand_idx];
}

export async function getCharCountOfRepo(url: string): Promise<number> {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`error status: ${response.status}`);
        }

        const languages: Record<string, number> = await response.json();
        let total_chars = 0;

        for (const [, bytes] of Object.entries(languages)) {
            const estimatedCharacters = Math.round(bytes * 0.7);
            total_chars += estimatedCharacters;
        }

        return total_chars;
    } catch (error) {
        console.error("Error estimating character count of repository:", error);
        throw error;
    }
}

export function splitIntoParts<T, N extends number>(
    arr: T[],
    parts: N,
): N extends 0 ? [] : T[][] & { length: N } {
    if (parts <= 0) throw new Error("Parts must be greater than 0");

    const result: T[][] = [];
    const baseSize = Math.floor(arr.length / parts);
    const remainder = arr.length % parts;

    let start = 0;
    for (let i = 0; i < parts; i++) {
        const size = baseSize + (i < remainder ? 1 : 0);
        result.push(arr.slice(start, start + size));
        start += size;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result as any;
}

export function imgToHtmlImg(img: FunnyImg): HTMLImgAttributes {
    return {
        alt: img.alt,
        src: img.src
    }
}

export function imgsToHtmlImgs(imgs: FunnyImg[]): HTMLImgAttributes[] {
    return imgs.map((img) => ({
        src: img.src,
        alt: img.alt
    }))
}