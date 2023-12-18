<script lang="ts">
	import {
		LANDING_PAGE_RANDOM_ANIMATION_CYCLE_BETWEEN_WORDS,
		LANDING_PAGE_RANDOM_WORDS_ANIMATION_DURATION as LANDING_PAGE_RANDOM_ANIMATION_DURATION_PER_LETTER
	} from '$lib/constants';
	import { getRandomInt } from '$lib/util';
	import { onMount } from 'svelte';

	const titles = ['Welcome!', 'Bienvenido!', 'Bienvenue!', 'Benvenuto/a!', 'Willkommen!'];

	const chosenTitleObj = {
		title: titles[0]
	};

	const count = (word: string) => {
		var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var numbers = '0123456789';
		var string = numbers + letters;
		let heroTitleElem = document.querySelector('#hero-title');
		if (heroTitleElem) {
			heroTitleElem.innerHTML = '';
		}
		for (const char of word) {
			const wordElem = document.createElement('i');
			wordElem.style.cssText = 'font-style: normal';
			wordElem.setAttribute('data-final', char);
			heroTitleElem?.appendChild(wordElem);
		}

		var allCounters = document.querySelectorAll('#hero-title > i');

		allCounters.forEach(function (el) {
			var duration = 1000 + Array.from(allCounters).indexOf(el) * 1000;
			var interval = setInterval(function () {
				(el as HTMLElement).innerText = string.charAt(Math.random() * string.length);
				duration = duration - 50;
				if (duration <= 0) {
					clearInterval(interval);
					(el as HTMLElement).innerText = el.getAttribute('data-final') || '';
				}
			}, LANDING_PAGE_RANDOM_ANIMATION_DURATION_PER_LETTER);
		});
	};

	onMount(() => {
		count(chosenTitleObj.title);
		setInterval(() => {
			let newChosenTitle = titles[getRandomInt(0, titles.length - 1)];
			while (newChosenTitle === chosenTitleObj.title) {
				newChosenTitle = titles[getRandomInt(0, titles.length - 1)];
			}
			chosenTitleObj.title = newChosenTitle;
			count(newChosenTitle);
		}, LANDING_PAGE_RANDOM_ANIMATION_CYCLE_BETWEEN_WORDS);
	});
</script>

<div class="h-full flex flex-col justify-center items-center relative">
	<div id="landing-image" class="h-full w-full"></div>
	<!-- Hello<br /><a href="/app" class="text-blue-400 underline">Go to app</a> -->
	<div class="absolute flex flex-col items-center gap-4 w-[500px]">
		<h1 id="hero-title" class="flex text-white text-7xl h-20 gap-2 font-bold"></h1>
		<h2>
			<a class="flex justify-center hero-btn text-xl py-3 px-5 transition-all" href="/auth/login">Login →</a>
		</h2>
	</div>
</div>

<style>
	#landing-image {
		position: relative;
		background-image: url('/anime_classroom_wallpaper.jpeg');
		background-repeat: no-repeat;
		background-size: cover;
	}

	#landing-image:after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		/* background: linear-gradient(to bottom, #000 0%, #fff0 100%); */
		background: #0008;
		height: 100%;
	}

	.hero-btn {
		border-radius: 50px;
		background: #000;
		color: #fff;
		box-shadow:
			20px 20px 60px #3f3f3f,
			-20px -20px 60px #555555;
	}

	.hero-btn:hover {
		background: #fff;
		color: #000
	}
</style>
