import { FUNCTION_ID_NAME_SEPARATOR, MAX_BYTES_ALLOWED_PER_HISTORY_RESPONSE } from './constants';
import type { MoodleFunctionCall } from './types';

export const extractFunctionIdAndName = (functionIdAndName: string) => {
	let functionId: string = '';
	let functionName: string = '';
	if (functionIdAndName.split(FUNCTION_ID_NAME_SEPARATOR).length === 2) {
		[functionId, functionName] = functionIdAndName.split(FUNCTION_ID_NAME_SEPARATOR);
	} else {
		functionName = functionIdAndName;
	}
	return [functionId, functionName];
};

export const createBlobFromMoodleFunctionCall = (call: MoodleFunctionCall) => {
	const responseBlob = new Blob([JSON.stringify(call.response)], { type: 'application/json' });
	let tooLarge = false;

	if (responseBlob.size > MAX_BYTES_ALLOWED_PER_HISTORY_RESPONSE) {
		// omit response because it is too large
		tooLarge = true;
		return {
			blob: new Blob([
				JSON.stringify({
					...call,
					response: 'Response was too large to save'
				})
			]),
			tooLarge
		};
	}

	return { blob: new Blob([JSON.stringify(call)], { type: 'application/json' }), tooLarge };
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
