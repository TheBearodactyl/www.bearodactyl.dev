import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: vitePreprocess(),
    onwarn: (warning, handler) => {
        if (warning.code.includes("css")) {
            return;
        }

        handler(warning);
    },
    compilerOptions: {
        runes: true,
    },
    kit: {
        adapter: adapter(),
        prerender: {
            entries: ["*"]
        }
     },
};

export default config;
