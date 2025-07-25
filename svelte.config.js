import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapterGhPages from "svelte-adapter-ghpages"

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapterGhPages()
	}
};

export default config;
