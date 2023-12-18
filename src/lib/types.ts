export interface UserDoc {
	uid: string;
	email: string;
	config: {
		host: string;
		token: string;
		updated: string;
	};
	functions: string[];
}

export interface MoodleFunctionKey {
	key: string;
	required: boolean;
	hint?: string;
}

export interface MoodleFunctionCall {
	call: object;
	functionName: string;
	response: object;
	date: string;
}

export interface MoodleFunction {
	name: string;
	functionKeys: MoodleFunctionKey[];
	history: MoodleHistoryItem[];
}

export interface MoodleHistoryItem {
	storageUrl: string;
	date: string;
	calledBy: string;
}
