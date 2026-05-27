import { readFile } from "node:fs/promises"
import path from "node:path"
import { cloudflare } from "@cloudflare/vite-plugin"
import mdx from "@mdx-js/rollup"
import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"
import { createHighlighter } from "shiki"
import { defineConfig, type Plugin } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

// Pre-create a shiki highlighter with only the languages used
// across the .mdx examples. Without this, rehype-pretty-code
// loads every shiki grammar (~200), blowing the Worker bundle
// past Cloudflare's size limit.
const highlighter = await createHighlighter({
  themes: ["github-light", "github-dark"],
  langs: ["ts", "tsx", "solidity"],
})

// Resolves `import html from "./foo.tsx?highlighted"` by running the
// pre-built shiki highlighter at build time and emitting the HTML as
// a JS string. This mirrors the docs' mdsvex/shiki strategy — code is
// highlighted once, baked into a fingerprinted JS chunk, and served
// with year-long immutable cache. Zero shiki / WASM in the runtime
// client bundle. See app/components/demo-source.tsx for the consumer.
const HIGHLIGHTED_QUERY = "?highlighted"
const EXTENSION_TO_LANG: Record<string, string> = {
  ".tsx": "tsx",
  ".ts": "typescript",
  ".js": "javascript",
  ".jsx": "tsx",
  ".sol": "solidity",
}

function highlightSourcePlugin(): Plugin {
  return {
    name: "highlight-source",
    enforce: "pre",
    async resolveId(source, importer) {
      if (!source.endsWith(HIGHLIGHTED_QUERY)) return null
      const without_query = source.slice(
        0,
        -HIGHLIGHTED_QUERY.length,
      )
      const resolved = await this.resolve(
        without_query,
        importer,
        { skipSelf: true },
      )
      if (!resolved) return null
      return `${resolved.id}${HIGHLIGHTED_QUERY}`
    },
    async load(id) {
      if (!id.endsWith(HIGHLIGHTED_QUERY)) return null
      const filepath = id.slice(0, -HIGHLIGHTED_QUERY.length)
      const code = await readFile(filepath, "utf8")
      const ext = path.extname(filepath).toLowerCase()
      const lang = EXTENSION_TO_LANG[ext] ?? "text"
      const html = highlighter.codeToHtml(code, {
        lang,
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
      })
      return {
        code: `export default ${JSON.stringify(html)}`,
        map: null,
      }
    },
  }
}

export default defineConfig({
  plugins: [
    highlightSourcePlugin(),
    // mdx() must precede reactRouter() so .mdx route files are
    // compiled to JSX before RR picks them up.
    mdx({
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            // Dual-theme emits per-token CSS vars (--shiki-light /
            // --shiki-dark); the @media (prefers-color-scheme: dark)
            // rule in tokens.css swaps between them. Matches the docs
            // site's mdsvex setup.
            theme: {
              light: "github-light",
              dark: "github-dark",
            },
            keepBackground: true,
            getHighlighter: () => highlighter,
          },
        ],
      ],
    }),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    {
      name: "suppress-devtools-request",
      configureServer(server) {
        server.middlewares.use(
          "/.well-known",
          (_, response) => {
            response.statusCode = 404
            response.end()
          },
        )
      },
    },
  ],
  server: {
    middlewareMode: false,
  },
})
