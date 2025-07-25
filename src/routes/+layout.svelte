<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { derived } from 'svelte/store';
	import LangSwitcher from '../components/LangSwitcher.svelte';
	import HomeIcon from '../components/icons/HomeIcon.svelte';
	import MenuIcon from '../components/icons/MenuIcon.svelte';

	const themes = [
		'kanagawa',
		'rose-pine',
		'rose-pine-moon',
		'rose-pine-dawn',
		'catppuccin-mocha',
		'catppuccin-macchiato',
		'catppuccin-frappe',
		'catppuccin-latte',
		'gruvbox-dark',
		'gruvbox-light',
		'nord',
		'alduin',
		'angr',
		'ayu',
		'carbonized',
		'gotham',
		'iceberg',
		'papercolor',
		'jellybeans',
		'materialbox',
		'onedark',
		'pink-moon',
		'tokyo-night'
	];

	const { children } = $props();

	let selectedTheme = $state('rose-pine');
	let isMenuOpen = $state(false);

	const currentRoutePath = derived(page, ($page) => $page.url.pathname);

	function changeTheme() {
		document.documentElement.setAttribute('data-theme', selectedTheme);
		localStorage.setItem('theme', selectedTheme);
	}

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	async function goHome() {
		await goto('/');
	}

	onMount(() => {
		const storedTheme = localStorage.getItem('theme');
		if (storedTheme) {
			selectedTheme = storedTheme;
			document.documentElement.setAttribute('data-theme', storedTheme);
		}
	});
</script>

<div class="quick-buttons">
	<div class="menu-items" class:open={isMenuOpen}>
		<div class="theme-switcher">
			<select id="theme-select" bind:value={selectedTheme} onchange={changeTheme}>
				{#each themes as theme}
					<option value={theme}>{theme.replace(/-/g, ' ')}</option>
				{/each}
			</select>
		</div>

		<div class="lang-switcher-aligned">
			<LangSwitcher />
		</div>

		{#if $currentRoutePath !== '/'}
			<button class="home_button" aria-label="Home" title="Go to Home" onclick={goHome}>
				<HomeIcon />
			</button>
		{/if}
	</div>

	<button
		class="menu-toggle"
		class:active={isMenuOpen}
		aria-label="Toggle menu"
		onclick={toggleMenu}
	>
		<MenuIcon />
	</button>
</div>

{@render children?.()}

<style>
	:global {
		/* My Fingers Hurt :'D */
		:root {
			--rose-pine-bg: #1f1f28;
			--rose-pine-wood: #16161d;
			--rose-pine-sky: #727169;
			--rose-pine-pine: #7e9cd8;
			--rose-pine-foam: #7aa89f;
			--rose-pine-love: #c34043;
			--rose-pine-gold: #c0a36e;
			--rose-pine-crust: #0d0c0c;
			--rose-pine-highlight: #7aa89f;
			--rose-pine-muted: #727169;
			--rose-pine-text: #dcd7ba;
			--rose-pine-iris: #957fb8;
			--rp-base: #1f1f28;
			--rp-surface: #16161d;
			--rp-overlay: #223249;
			--rp-muted: #54546d;
			--rp-subtle: #727169;
			--rp-text: #dcd7ba;
			--rp-love: #c34043;
			--rp-gold: #c0a36e;
			--rp-rose: #e6c384;
			--rp-pine: #7e9cd8;
			--rp-foam: #7aa89f;
			--rp-iris: #957fb8;
			--rp-highlight-low: #16161d;
			--rp-highlight-med: #223249;
			--rp-highlight-high: #2d4f67;
		}

		html[data-theme='rose-pine'] {
			--rose-pine-bg: #191724;
			--rose-pine-wood: #26233a;
			--rose-pine-sky: #6e6a86;
			--rose-pine-pine: #31748f;
			--rose-pine-foam: #9ccfd8;
			--rose-pine-love: #eb6f92;
			--rose-pine-gold: #f6c177;
			--rose-pine-crust: #232136;
			--rose-pine-highlight: #9ccfd8;
			--rose-pine-muted: #6e6a86;
			--rose-pine-text: #e0def4;
			--rose-pine-iris: #c4a7e7;
			--rp-base: #191724;
			--rp-surface: #1f1d2e;
			--rp-overlay: #26233a;
			--rp-muted: #6e6a86;
			--rp-subtle: #908caa;
			--rp-text: #e0def4;
			--rp-love: #eb6f92;
			--rp-gold: #f6c177;
			--rp-rose: #ebbcba;
			--rp-pine: #31748f;
			--rp-foam: #9ccfd8;
			--rp-iris: #c4a7e7;
			--rp-highlight-low: #2a283d;
			--rp-highlight-med: #403d52;
			--rp-highlight-high: #524f67;
			--transition-speed: 0.4s;
			--transition-ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
			--hover-scale: 1.02;
		}

		html[data-theme='rose-pine-moon'] {
			--rose-pine-bg: #232136;
			--rose-pine-wood: #2a273a;
			--rose-pine-sky: #6e6a86;
			--rose-pine-pine: #3e81a3;
			--rose-pine-foam: #9ccfd8;
			--rose-pine-love: #eb6f92;
			--rose-pine-gold: #f6c177;
			--rose-pine-crust: #1a1826;
			--rose-pine-highlight: #9ccfd8;
			--rose-pine-muted: #6e6a86;
			--rose-pine-text: #e0def4;
			--rose-pine-iris: #c4a7e7;
			--rp-base: #232136;
			--rp-surface: #2a273a;
			--rp-overlay: #312e43;
			--rp-muted: #8b859e;
			--rp-subtle: #b2accc;
			--rp-text: #e0def4;
			--rp-love: #ea96a6;
			--rp-gold: #e7bc8c;
			--rp-rose: #f0c6c6;
			--rp-pine: #56949f;
			--rp-foam: #9ccfd8;
			--rp-iris: #c4a7e7;
			--rp-highlight-low: #39354d;
			--rp-highlight-med: #4a4561;
			--rp-highlight-high: #5c5775;
		}

		html[data-theme='rose-pine-dawn'] {
			--rose-pine-bg: #faf4ed;
			--rose-pine-wood: #fffaf3;
			--rose-pine-sky: #9893a5;
			--rose-pine-pine: #56949f;
			--rose-pine-foam: #56949f;
			--rose-pine-love: #b4637a;
			--rose-pine-gold: #ea9d34;
			--rose-pine-crust: #f2e9e1;
			--rose-pine-highlight: #56949f;
			--rose-pine-muted: #9893a5;
			--rose-pine-text: #575279;
			--rose-pine-iris: #907aa9;
			--rp-base: #faf4ed;
			--rp-surface: #fffaf3;
			--rp-overlay: #f2e9e1;
			--rp-muted: #9893a5;
			--rp-subtle: #797593;
			--rp-text: #575279;
			--rp-love: #b4637a;
			--rp-gold: #ea9d34;
			--rp-rose: #d7827e;
			--rp-pine: #286983;
			--rp-foam: #407d9b;
			--rp-iris: #907aa9;
			--rp-highlight-low: #f4ede8;
			--rp-highlight-med: #e4dfd8;
			--rp-highlight-high: #dcd7d1;
		}

		html[data-theme='catppuccin-mocha'] {
			--rose-pine-bg: #1e1e2e;
			--rose-pine-wood: #313244;
			--rose-pine-sky: #6c7086;
			--rose-pine-pine: #74c7ec;
			--rose-pine-foam: #94e2d5;
			--rose-pine-love: #f38ba8;
			--rose-pine-gold: #f9e2af;
			--rose-pine-crust: #11111b;
			--rose-pine-highlight: #94e2d5;
			--rose-pine-muted: #6c7086;
			--rose-pine-text: #cdd6f4;
			--rose-pine-iris: #cba6f7;
			--rp-base: #1e1e2e;
			--rp-surface: #313244;
			--rp-overlay: #45475a;
			--rp-muted: #6c7086;
			--rp-subtle: #9399b2;
			--rp-text: #cdd6f4;
			--rp-love: #f38ba8;
			--rp-gold: #f9e2af;
			--rp-rose: #f5c2e7;
			--rp-pine: #74c7ec;
			--rp-foam: #94e2d5;
			--rp-iris: #cba6f7;
			--rp-highlight-low: #313244;
			--rp-highlight-med: #45475a;
			--rp-highlight-high: #585b70;
		}

		html[data-theme='catppuccin-macchiato'] {
			--rose-pine-bg: #24273a;
			--rose-pine-wood: #363a4f;
			--rose-pine-sky: #6e738d;
			--rose-pine-pine: #7dc4e4;
			--rose-pine-foam: #8bd5ca;
			--rose-pine-love: #f5bde6;
			--rose-pine-gold: #eed49f;
			--rose-pine-crust: #181926;
			--rose-pine-highlight: #8bd5ca;
			--rose-pine-muted: #6e738d;
			--rose-pine-text: #cad3f5;
			--rose-pine-iris: #c6a0f6;
			--rp-base: #24273a;
			--rp-surface: #363a4f;
			--rp-overlay: #494d64;
			--rp-muted: #6e738d;
			--rp-subtle: #939ab7;
			--rp-text: #cad3f5;
			--rp-love: #f5bde6;
			--rp-gold: #eed49f;
			--rp-rose: #f4dbd6;
			--rp-pine: #7dc4e4;
			--rp-foam: #8bd5ca;
			--rp-iris: #c6a0f6;
			--rp-highlight-low: #363a4f;
			--rp-highlight-med: #494d64;
			--rp-highlight-high: #5b6078;
		}

		html[data-theme='catppuccin-frappe'] {
			--rose-pine-bg: #303446;
			--rose-pine-wood: #414559;
			--rose-pine-sky: #737994;
			--rose-pine-pine: #81c8be;
			--rose-pine-foam: #85c1dc;
			--rose-pine-love: #f4b8e4;
			--rose-pine-gold: #e5c890;
			--rose-pine-crust: #232634;
			--rose-pine-highlight: #85c1dc;
			--rose-pine-muted: #737994;
			--rose-pine-text: #c6d0f5;
			--rose-pine-iris: #ca9ee6;
			--rp-base: #303446;
			--rp-surface: #414559;
			--rp-overlay: #51576d;
			--rp-muted: #737994;
			--rp-subtle: #949cbb;
			--rp-text: #c6d0f5;
			--rp-love: #f4b8e4;
			--rp-gold: #e5c890;
			--rp-rose: #eebebe;
			--rp-pine: #81c8be;
			--rp-foam: #85c1dc;
			--rp-iris: #ca9ee6;
			--rp-highlight-low: #414559;
			--rp-highlight-med: #51576d;
			--rp-highlight-high: #626880;
		}

		html[data-theme='catppuccin-latte'] {
			--rose-pine-bg: #eff1f5;
			--rose-pine-wood: #e6e9ef;
			--rose-pine-sky: #9ca0b0;
			--rose-pine-pine: #179299;
			--rose-pine-foam: #04a5e5;
			--rose-pine-love: #e64553;
			--rose-pine-gold: #df8e1d;
			--rose-pine-crust: #dce0e8;
			--rose-pine-highlight: #04a5e5;
			--rose-pine-muted: #9ca0b0;
			--rose-pine-text: #4c4f69;
			--rose-pine-iris: #8839ef;
			--rp-base: #eff1f5;
			--rp-surface: #e6e9ef;
			--rp-overlay: #dce0e8;
			--rp-muted: #9ca0b0;
			--rp-subtle: #6c6f85;
			--rp-text: #4c4f69;
			--rp-love: #e64553;
			--rp-gold: #df8e1d;
			--rp-rose: #ea76cb;
			--rp-pine: #179299;
			--rp-foam: #04a5e5;
			--rp-iris: #8839ef;
			--rp-highlight-low: #e6e9ef;
			--rp-highlight-med: #dce0e8;
			--rp-highlight-high: #ccd0da;
		}

		html[data-theme='nord'] {
			--rose-pine-bg: #2e3440;
			--rose-pine-wood: #3b4252;
			--rose-pine-sky: #616e88;
			--rose-pine-pine: #88c0d0;
			--rose-pine-foam: #8fbcbb;
			--rose-pine-love: #bf616a;
			--rose-pine-gold: #ebcb8b;
			--rose-pine-crust: #2e3440;
			--rose-pine-highlight: #88c0d0;
			--rose-pine-muted: #616e88;
			--rose-pine-text: #eceff4;
			--rose-pine-iris: #b48ead;
			--rp-base: #2e3440;
			--rp-surface: #3b4252;
			--rp-overlay: #434c5e;
			--rp-muted: #4c566a;
			--rp-subtle: #616e88;
			--rp-text: #eceff4;
			--rp-love: #bf616a;
			--rp-gold: #ebcb8b;
			--rp-rose: #d08770;
			--rp-pine: #5e81ac;
			--rp-foam: #8fbcbb;
			--rp-iris: #b48ead;
			--rp-highlight-low: #3b4252;
			--rp-highlight-med: #434c5e;
			--rp-highlight-high: #4c566a;
		}

		html[data-theme='gruvbox-dark'] {
			--rose-pine-bg: #282828;
			--rose-pine-wood: #3c3836;
			--rose-pine-sky: #7c6f64;
			--rose-pine-pine: #458588;
			--rose-pine-foam: #689d6a;
			--rose-pine-love: #cc241d;
			--rose-pine-gold: #d79921;
			--rose-pine-crust: #1d2021;
			--rose-pine-highlight: #689d6a;
			--rose-pine-muted: #7c6f64;
			--rose-pine-text: #ebdbb2;
			--rose-pine-iris: #b16286;
			--rp-base: #282828;
			--rp-surface: #3c3836;
			--rp-overlay: #504945;
			--rp-muted: #665c54;
			--rp-subtle: #7c6f64;
			--rp-text: #ebdbb2;
			--rp-love: #cc241d;
			--rp-gold: #d79921;
			--rp-rose: #d3869b;
			--rp-pine: #458588;
			--rp-foam: #689d6a;
			--rp-iris: #b16286;
			--rp-highlight-low: #3c3836;
			--rp-highlight-med: #504945;
			--rp-highlight-high: #665c54;
		}

		html[data-theme='gruvbox-light'] {
			--rose-pine-bg: #fbf1c7;
			--rose-pine-wood: #f2e5bc;
			--rose-pine-sky: #7c6f64;
			--rose-pine-pine: #076678;
			--rose-pine-foam: #427b58;
			--rose-pine-love: #9d0006;
			--rose-pine-gold: #b57614;
			--rose-pine-crust: #f9f5d7;
			--rose-pine-highlight: #427b58;
			--rose-pine-muted: #7c6f64;
			--rose-pine-text: #3c3836;
			--rose-pine-iris: #8f3f71;
			--rp-base: #fbf1c7;
			--rp-surface: #f2e5bc;
			--rp-overlay: #ebdbb2;
			--rp-muted: #a89984;
			--rp-subtle: #7c6f64;
			--rp-text: #3c3836;
			--rp-love: #9d0006;
			--rp-gold: #b57614;
			--rp-rose: #af3a03;
			--rp-pine: #076678;
			--rp-foam: #427b58;
			--rp-iris: #8f3f71;
			--rp-highlight-low: #f2e5bc;
			--rp-highlight-med: #ebdbb2;
			--rp-highlight-high: #d5c4a1;
		}

		html[data-theme='alduin'] {
			--rp-base: #202020;
			--rp-surface: #2a2a2a;
			--rp-overlay: #3c3836;
			--rp-muted: #928374;
			--rp-subtle: #a89984;
			--rp-text: #ebdbb2;
			--rp-love: #cc241d;
			--rp-gold: #d79921;
			--rp-rose: #d65d0e;
			--rp-pine: #689d6a;
			--rp-foam: #458588;
			--rp-iris: #b16286;
			--rp-highlight-low: #2a2a2a;
			--rp-highlight-med: #3c3836;
			--rp-highlight-high: #504945;
		}

		html[data-theme='angr'] {
			--rp-base: #1c1c1c;
			--rp-surface: #2e2e2e;
			--rp-overlay: #444444;
			--rp-muted: #888888;
			--rp-subtle: #aaaaaa;
			--rp-text: #f8f8f2;
			--rp-love: #ff6c6b;
			--rp-gold: #f0c674;
			--rp-rose: #d08770;
			--rp-pine: #98c379;
			--rp-foam: #61afef;
			--rp-iris: #c678dd;
			--rp-highlight-low: #2e2e2e;
			--rp-highlight-med: #3f3f3f;
			--rp-highlight-high: #5c5c5c;
		}

		html[data-theme='ayu'] {
			--rp-base: #0f1419;
			--rp-surface: #1f2429;
			--rp-overlay: #2d3237;
			--rp-muted: #5c6773;
			--rp-subtle: #738091;
			--rp-text: #e6e1cf;
			--rp-love: #f07178;
			--rp-gold: #ffb454;
			--rp-rose: #ffa759;
			--rp-pine: #aad94c;
			--rp-foam: #7fd5f5;
			--rp-iris: #c397d8;
			--rp-highlight-low: #1a1f24;
			--rp-highlight-med: #2d343a;
			--rp-highlight-high: #3e4a56;
		}

		html[data-theme='carbonized'] {
			--rp-base: #111111;
			--rp-surface: #222222;
			--rp-overlay: #333333;
			--rp-muted: #888888;
			--rp-subtle: #aaaaaa;
			--rp-text: #dddddd;
			--rp-love: #ff5f5f;
			--rp-gold: #ffd700;
			--rp-rose: #ff875f;
			--rp-pine: #5fffaf;
			--rp-foam: #5fafff;
			--rp-iris: #af5fff;
			--rp-highlight-low: #1a1a1a;
			--rp-highlight-med: #2e2e2e;
			--rp-highlight-high: #444444;
		}

		html[data-theme='gotham'] {
			--rp-base: #0c1014;
			--rp-surface: #11151c;
			--rp-overlay: #1a1f26;
			--rp-muted: #2f3541;
			--rp-subtle: #4e5a65;
			--rp-text: #d3d7de;
			--rp-love: #c23127;
			--rp-gold: #ffdd33;
			--rp-rose: #ff5f87;
			--rp-pine: #2aa198;
			--rp-foam: #26c6da;
			--rp-iris: #9c6cd3;
			--rp-highlight-low: #11151c;
			--rp-highlight-med: #1a1f26;
			--rp-highlight-high: #2f3541;
		}

		html[data-theme='iceberg'] {
			--rp-base: #161821;
			--rp-surface: #1e2132;
			--rp-overlay: #2e3340;
			--rp-muted: #6b7089;
			--rp-subtle: #a1aab8;
			--rp-text: #d2d4de;
			--rp-love: #e27878;
			--rp-gold: #e9b189;
			--rp-rose: #e98989;
			--rp-pine: #84a0c6;
			--rp-foam: #89b8c2;
			--rp-iris: #b4be82;
			--rp-highlight-low: #1e2132;
			--rp-highlight-med: #2e3340;
			--rp-highlight-high: #3e4452;
		}

		html[data-theme='papercolor'] {
			--rp-base: #eeeeee;
			--rp-surface: #ffffff;
			--rp-overlay: #dddddd;
			--rp-muted: #888888;
			--rp-subtle: #aaaaaa;
			--rp-text: #000000;
			--rp-love: #af0000;
			--rp-gold: #af8700;
			--rp-rose: #ff8700;
			--rp-pine: #008700;
			--rp-foam: #005f87;
			--rp-iris: #875f87;
			--rp-highlight-low: #dddddd;
			--rp-highlight-med: #cccccc;
			--rp-highlight-high: #bbbbbb;
		}

		html[data-theme='jellybeans'] {
			--rp-base: #1c1c1c;
			--rp-surface: #262626;
			--rp-overlay: #303030;
			--rp-muted: #808080;
			--rp-subtle: #a0a0a0;
			--rp-text: #e8e8d3;
			--rp-love: #cf6a4c;
			--rp-gold: #fad07a;
			--rp-rose: #f08080;
			--rp-pine: #99ad6a;
			--rp-foam: #8fbfdc;
			--rp-iris: #8197bf;
			--rp-highlight-low: #262626;
			--rp-highlight-med: #303030;
			--rp-highlight-high: #444444;
		}

		html[data-theme='materialbox'] {
			--rp-base: #263238;
			--rp-surface: #2e3c43;
			--rp-overlay: #314549;
			--rp-muted: #546e7a;
			--rp-subtle: #90a4ae;
			--rp-text: #eceff1;
			--rp-love: #ff5370;
			--rp-gold: #ffcb6b;
			--rp-rose: #f07178;
			--rp-pine: #c3e88d;
			--rp-foam: #89ddff;
			--rp-iris: #c792ea;
			--rp-highlight-low: #2e3c43;
			--rp-highlight-med: #314549;
			--rp-highlight-high: #37474f;
		}

		html[data-theme='onedark'] {
			--rp-base: #282c34;
			--rp-surface: #353b45;
			--rp-overlay: #3e4451;
			--rp-muted: #5c6370;
			--rp-subtle: #abb2bf;
			--rp-text: #bbc2cf;
			--rp-love: #e06c75;
			--rp-gold: #e5c07b;
			--rp-rose: #d19a66;
			--rp-pine: #98c379;
			--rp-foam: #56b6c2;
			--rp-iris: #c678dd;
			--rp-highlight-low: #353b45;
			--rp-highlight-med: #3e4451;
			--rp-highlight-high: #4b5263;
		}

		html[data-theme='pink-moon'] {
			--rp-base: #2e1a2f;
			--rp-surface: #3b253b;
			--rp-overlay: #4a2c4a;
			--rp-muted: #b588a0;
			--rp-subtle: #e0a0c0;
			--rp-text: #f9d6e8;
			--rp-love: #ff5f87;
			--rp-gold: #f5b78a;
			--rp-rose: #ffa5c3;
			--rp-pine: #c7d2fe;
			--rp-foam: #b2f0e6;
			--rp-iris: #d0b0ff;
			--rp-highlight-low: #3b253b;
			--rp-highlight-med: #4a2c4a;
			--rp-highlight-high: #5c3a5c;
		}

		html[data-theme='tokyo-night'] {
			--rp-base: #1a1b26;
			--rp-surface: #1f2335;
			--rp-overlay: #2a2f48;
			--rp-muted: #565f89;
			--rp-subtle: #7aa2f7;
			--rp-text: #c0caf5;
			--rp-love: #f7768e;
			--rp-gold: #e0af68;
			--rp-rose: #ff9e64;
			--rp-pine: #9ece6a;
			--rp-foam: #7dcfff;
			--rp-iris: #bb9af7;
			--rp-highlight-low: #1f2335;
			--rp-highlight-med: #2a2f48;
			--rp-highlight-high: #3b4261;
		}
	}

	::-webkit-scrollbar {
		width: 12px;
		height: 12px;
	}

	::-webkit-scrollbar-track {
		background-color: var(--rp-base);
	}

	::-webkit-scrollbar-thumb {
		background-color: var(--rp-foam);
		border-radius: 8px;
		border: 2px solid var(--rose-pine-wood);
	}

	::-webkit-scrollbar-button {
		display: none;
		width: 0;
		height: 0;
	}

	::-webkit-scrollbar-corner {
		display: none;
	}

	* {
		scrollbar-width: none;
		scrollbar-color: var(--rose-pine-foam) var(--rose-pine-crust);
	}

	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}

	select {
		background-color: var(--rp-surface);
		color: var(--rp-text);
		border: 1px solid var(--rp-highlight);
		border-radius: 6px;
		padding: 0.5em 1em;
		font-family: 'JetBrains Mono', monospace;
		appearance: none;
		cursor: pointer;
		outline: none;
		box-shadow: 0 0 0 1px var(--rp-highlight);
	}

	/* Option styling — note: limited styling possible across browsers */
	option {
		background-color: var(--rp-base);
		color: var(--rp-text);
	}

	/* Focus and hover state for the select */
	select:focus {
		border-color: var(--rp-gold);
		box-shadow: 0 0 0 2px var(--rp-gold);
	}

	:global(body) {
		margin: 0;
		font-family: 'Inter', sans-serif;
		background-color: var(--rp-base);
		color: var(--rp-text);
		line-height: 1.6;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	:global(
		.quick-buttons button,
		.theme-switcher select,
		.theme-switcher button,
		.lang-switcher-aligned select,
		.lang-switcher-aligned button
	) {
		background-color: var(--rp-surface);
		color: var(--rp-text);
		border: 2px solid var(--rp-highlight-low);
		border-radius: 9999px;
		box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.8);
		padding: 0.75rem 1.25rem;
		font-size: 0.875rem;
		cursor: pointer;
		width: fit-content;
		height: fit-content;
		outline: none;
		transition: all var(--transition-speed) var(--transition-ease);
		/* Consistent shadow */
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		white-space: nowrap;

		@media (max-width: 920px) {
			align-items: center;
		}
	}

	.theme-switcher select {
		width: 13rem;
	}

	.theme-switcher select::-ms-expand {
		display: none;
	}

	:global(
		.quick-buttons button:hover,
		.theme-switcher select:hover,
		.lang-switcher-aligned select:hover
	) {
		background-color: var(--rp-overlay);
		border-color: var(--rp-iris);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
		transform: translateY(-2px);
	}

	.home_button {
		width: auto;
		padding: 0.75rem 1rem;
		scale: 100%;
	}

	:global(.home_button svg) {
		width: 1.25em;
		height: 1.25em;
		stroke: var(--rp-text);
	}

	:global(.home_button:hover svg) {
		stroke: var(--rp-iris);
	}

	.home_button:active {
		transform: translateY(0);
	}

	.lang-switcher-aligned {
		margin-left: auto;
		z-index: 1;
	}

	.theme-switcher select {
		background-repeat: no-repeat;
		background-position: right 0.75rem center;
		background-size: 1.25em;
	}

	.theme-switcher select option {
		background-color: var(--rp-surface);
		color: var(--rp-text);
		padding: 0.5rem 1rem;
	}

	.quick-buttons {
		position: fixed;
		top: 1rem;
		right: 1rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.75rem;
		z-index: 1000;

		@media (max-width: 768px) {
			top: 0.5rem;
			right: 0.5rem;
			gap: 0.5rem;
		}
	}

	.menu-toggle {
		background-color: var(--rp-surface);
		color: var(--rp-text);
		border: 2px solid var(--rp-highlight-low);
		border-radius: 9999px;
		box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.8);
		padding: 0.75rem;
		cursor: pointer;
		outline: none;
		transition: all var(--transition-speed) var(--transition-ease);
		display: flex;
		align-items: center;
		justify-content: center;
		width: auto;
	}

	:global(.menu-toggle .menu-icon) {
		width: 16px;
		height: 16px;
	}

	.menu-toggle:hover {
		background-color: var(--rp-overlay);
		border-color: var(--rp-iris);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
		transform: translateY(-2px);
	}

	.menu-items {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.75rem;
		opacity: 0;
		visibility: hidden;
		transform: translateX(-10px);
		transition: all 0.3s ease;
		pointer-events: none;
	}

	.menu-items.open {
		opacity: 1;
		visibility: visible;
		transform: translateX(0);
		pointer-events: auto;
	}

	@media (max-width: 768px) {
		.quick-buttons button,
		.theme-switcher select {
			font-size: 0.75rem;
			padding: 0.6rem 1rem;
		}

		.theme-switcher select {
			padding-right: 2rem;
			background-position: right 0.5rem center;
		}

		.home_button {
			padding: 0.6rem 0.8rem;
		}

		:global(.home_button svg) {
			width: 1em;
			height: 1em;
		}

		.menu-toggle {
			padding: 0.4rem;
		}

		:global(.menu-toggle .menu-icon) {
			width: 14px;
			height: 14px;
		}

		.menu-items {
			gap: 0.5rem;
		}
	}
</style>
