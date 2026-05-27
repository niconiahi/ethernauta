import { cloudflare } from "@cloudflare/vite-plugin"
import mdx from "@mdx-js/rollup"
import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"
import { createHighlighter } from "shiki"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

// Pre-create a shiki highlighter with only the languages used
// across the .mdx examples. Without this, rehype-pretty-code
// loads every shiki grammar (~200), blowing the Worker bundle
// past Cloudflare's size limit.
const highlighter = await createHighlighter({
  themes: ["github-light"],
  langs: ["ts", "tsx", "solidity"],
})

export default defineConfig({
  plugins: [
    // mdx() must precede reactRouter() so .mdx route files are
    // compiled to JSX before RR picks them up.
    mdx({
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: "github-light",
            keepBackground: false,
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
