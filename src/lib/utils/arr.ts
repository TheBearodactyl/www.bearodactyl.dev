import type { Review } from "$lib/types";

export function split<T, N extends number>(
    arr: T[],
    parts: N,
): N extends 0 ? [] : T[][] & { length: N } {
    if (parts <= 0) throw new Error("Parts must be greater than 0");

    const result: T[][] = [];
    const base_size = Math.floor(arr.length / parts);
    const remainder = arr.length % parts;

    let start = 0;
    for (let i = 0; i < parts; i++) {
        const size = base_size + (i < remainder ? 1 : 0);
        result.push(arr.slice(start, start + size));
        start += size;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result as any;
}

export function sort_reviews(input: readonly Review[]): Review[] {
    return input.slice().sort((a, b) => a.chapter - b.chapter);
}
