import mdx from "@mdx-js/rollup"
import { cloudflare } from "@cloudflare/vite-plugin"
import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

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
          { theme: "github-light", keepBackground: false },
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
