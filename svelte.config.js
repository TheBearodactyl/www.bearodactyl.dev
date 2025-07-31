import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  onwarn: (warning, handler) => {
    if (warning.code.startsWith("css_unused")) {
      return;
    }

    handler(warning);
  },
  kit: {
    adapter: adapter({
      fallback: "404.html"
    }),
    prerender: {
      entries: ["*"]
    }
  }
};

export default config;
