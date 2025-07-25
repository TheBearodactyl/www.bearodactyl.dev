import { assert, test } from 'vitest';
import { shuffleArray } from './misc';

test('shuffleArray actually shuffles arrays', () => {
	const testArray: string[] = ['item1', 'item2', 'item3', 'item4', 'item5'];
	const shuffled = shuffleArray<string>(testArray);

	assert(testArray !== shuffled, `Test failed: ${testArray} is equal to ${shuffled}`);
});
