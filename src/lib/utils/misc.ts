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

    const secureRand = (max: number): number => {
        if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
            const buf = new Uint32Array(1);
            window.crypto.getRandomValues(buf);
            return Math.floor((buf[0] / (0xffffffff + 1)) * max);
        } else {
            return Math.floor(Math.random() * max);
        }
    };

    const blendRand = (max: number): number => {
        const timeNoise = (Date.now() * Math.random()) % 1;
        const mixed = (Math.random() + timeNoise + secureRand(1_000_000) / 1_000_000) % 1;
        return Math.floor(mixed * max);
    };

    const passes = secureRand(10) + 10; // 10–20 passes
    for (let p = 0; p < passes; p++) {
        const mode = secureRand(4);

        if (mode === 0) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = blendRand(i + 1);
                [array[i], array[j]] = [array[j], array[i]];
            }
        } else if (mode === 1) {
            for (let i = 0; i < array.length; i++) {
                const j = blendRand(array.length);
                [array[i], array[j]] = [array[j], array[i]];
            }
        } else if (mode === 2) {
            const start = blendRand(array.length);
            const end = blendRand(array.length);
            const [s, e] = [Math.min(start, end), Math.max(start, end)];
            const segment = array.slice(s, e + 1).reverse();
            array.splice(s, segment.length, ...segment);
        } else {
            const offset = blendRand(array.length);
            array.push(...array.splice(0, offset));
        }
    }

    if (secureRand(2) === 1) {
        array.reverse();
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
        src: img.src,
    };
}

export function imgsToHtmlImgs(imgs: FunnyImg[]): HTMLImgAttributes[] {
    return imgs.map((img) => ({
        src: img.src,
        alt: img.alt,
    }));
}
