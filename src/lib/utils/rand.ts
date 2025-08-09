export function shuffle<T>(input: readonly T[]): T[] {
	const array = input.slice();

	const secure_rand = (max: number): number => {
		if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
			const buf = new Uint32Array(1);
			window.crypto.getRandomValues(buf);
			return Math.floor((buf[0] / (0xffffffff + 1)) * max);
		} else {
			return Math.floor(Math.random() * max);
		}
	};

	const blend_rand = (max: number): number => {
		const time_noise = (Date.now() * Math.random()) % 1;
		const mixed = (Math.random() + time_noise + secure_rand(1_000_000) / 1_000_000) % 1;
		return Math.floor(mixed * max);
	};

	const passes = secure_rand(10) + 10;
	for (let p = 0; p < passes; p++) {
		const mode = secure_rand(4);
		if (mode === 0) {
			for (let i = array.length - 1; i > 0; i--) {
				const j = blend_rand(i + 1);
				[array[i], array[j]] = [array[j], array[i]];
			}
		} else if (mode === 1) {
			for (let i = 0; i < array.length; i++) {
				const j = blend_rand(array.length);
				[array[i], array[j]] = [array[j], array[i]];
			}
		} else if (mode === 2) {
			const start = blend_rand(array.length);
			const end = blend_rand(array.length);
			const [s, e] = [Math.min(start, end), Math.max(start, end)];
			const segment = array.slice(s, e + 1).reverse();
			array.splice(s, segment.length, ...segment);
		} else {
			const offset = blend_rand(array.length);
			array.push(...array.splice(0, offset));
		}
	}

	if (secure_rand(2) === 1) {
		array.reverse();
	}

	return array;
}

export function rand_bool(): boolean {
	return Math.random() < 0.5;
}

export function choose_rand<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}
