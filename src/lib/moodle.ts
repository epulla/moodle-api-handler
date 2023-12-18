import { RequestException } from './exceptions';
import { Toast } from './toasts';

export const requestMoodle = async (
	host: string,
	token: string,
	functionName: string,
	body: object,
	moodlewsrestformat: string = 'json'
) => {
	if (host.endsWith('/')) {
		host = host.slice(0, -1);
	}
	const url =
		`${host}/webservice/rest/server.php?` +
		new URLSearchParams({
			...body,
			wstoken: token,
			wsfunction: functionName,
			moodlewsrestformat
		});

	try {
		const response = await fetch(url, {
			method: 'POST'
		});

		if (!response.ok) {
			throw new RequestException(await response.text(), response.status);
		}
		return await response.json();
	} catch (error) {
		console.log(error);
		Toast.error((error as Error).message)
		if (error instanceof RequestException) {
			return { status: error.status, message: error.message };
		}
		return {
			error: (error as Error).name,
			message: (error as Error).message
		};
	}
};
