import Toastify from 'toastify-js';

export class Toast {
	static success(message: string) {
		Toastify({
			text: message,
			style: {
				background: 'rgb(34 197 94)'
			},
			close: true,
            gravity: "bottom",
            position: "left",
		}).showToast();
	}

	static info(message: string) {
		Toastify({
			text: message,
			style: {
				background: 'rgb(59 130 246)'
			},
			close: true,
            gravity: "bottom",
            position: "left",
		}).showToast();
	}
	static warn(message: string) {
		Toastify({
			text: message,
			style: {
				background: 'rgb(234 179 8)',
			},
			close: true,
            gravity: "bottom",
            position: "left",
		}).showToast();
	}

	static error(message: string) {
		Toastify({
			text: message,
			style: {
				background: 'rgb(239 68 68)'
			},
			close: true,
            gravity: "bottom",
            position: "left",
		}).showToast();
	}
}
