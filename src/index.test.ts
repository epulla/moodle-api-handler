import { compress, compressToBase64, compressToEncodedURIComponent, compressToUTF16, compressToUint8Array } from 'lz-string';
import { describe, it, expect } from 'vitest';

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		const x = "ISH7tfrYTKvJAQQj85un&core_user_get_users"
		console.log(compress(x));
		console.log(compressToBase64(x));
		console.log(compressToEncodedURIComponent(x));
		console.log(compressToUTF16(x));
		console.log(compressToUint8Array(x));

		expect(1 + 2).toBe(3);
	});
});
