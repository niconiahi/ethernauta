import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { escapeSvelte, mdsvex } from "mdsvex";
import { createHighlighter } from "shiki";

const highlighter = await createHighlighter({
  themes: ["github-light", "github-dark"],
  langs: ["ts", "js", "tsx", "jsx", "bash", "json", "svelte", "html", "css", "md"],
});

const config = {
  extensions: [".svelte", ".md"],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: [".md"],
      highlight: {
        highlighter: (code, lang) => {
          const html = escapeSvelte(
            highlighter.codeToHtml(code, {
              lang: lang ?? "text",
              themes: { light: "github-light", dark: "github-dark" },
            }),
          );
          return `{@html \`${html}\`}`;
        },
      },
    }),
  ],
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: undefined,
      precompress: false,
      strict: true,
    }),
    alias: {
      $content: "../../docs/content",
    },
    prerender: {
      entries: ["*"],
    },
  },
};

export default config;
