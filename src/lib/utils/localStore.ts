/* eslint-disable @typescript-eslint/no-explicit-any */
import { browser } from "$app/environment";

export class LocalStore<T> {
    value: T = undefined as any;
    key: string;

    constructor(key: string, initial: T) {
        this.key = key;
        this.value = initial;

        if (browser) {
            const stored = localStorage.getItem(key);
            if (stored !== null) {
                try {
                    this.value = JSON.parse(stored) as T;
                } catch {
                    this.value = initial;
                }
            }
        }

        $effect(() => {
            if (browser) {
                localStorage.setItem(this.key, JSON.stringify(this.value));
            }
        });
    }
}

export function localStore<T>(key: string, initial: T) {
    return new LocalStore<T>(key, initial);
}
