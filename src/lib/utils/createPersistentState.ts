import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

type SerializableValue = string | number | boolean | object | null | undefined;

interface PersistentStateOptions<T> {
	key: string;
	defaultValue: T;
	storage?: 'localStorage' | 'sessionStorage';
	serializer?: {
		serialize: (value: T) => string;
		deserialize: (value: string) => T;
	};
}

export function createPersistentState<T extends SerializableValue>(
	options: PersistentStateOptions<T>
): Writable<T> {
	const { key, defaultValue, storage = 'localStorage', serializer } = options;

	const defaultSerializer = {
		serialize: (value: T) => JSON.stringify(value),
		deserialize: (value: string) => JSON.parse(value) as T
	};

	const { serialize, deserialize } = serializer || defaultSerializer;

	let initialValue = defaultValue;

	if (browser) {
		try {
			const storageApi = storage === 'sessionStorage' ? sessionStorage : localStorage;
			const stored = storageApi.getItem(key);
			if (stored !== null) {
				initialValue = deserialize(stored);
			}
		} catch (error) {
			console.warn(`Failed to load persistent state for key "${key}":`, error);
		}
	}

	const store = writable<T>(initialValue);

	if (browser) {
		store.subscribe((value) => {
			try {
				const storageApi = storage === 'sessionStorage' ? sessionStorage : localStorage;
				storageApi.setItem(key, serialize(value));
			} catch (error) {
				console.warn(`Failed to persist state for key "${key}":`, error);
			}
		});
	}

	return store;
}

export function persistentState<T extends SerializableValue>(
	key: string,
	defaultValue: T,
	storage: 'localStorage' | 'sessionStorage' = 'localStorage'
): Writable<T> {
	return createPersistentState({ key, defaultValue, storage });
}
