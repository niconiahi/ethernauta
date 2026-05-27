import { sveltekit } from "@sveltejs/kit/vite"
import { existsSync, statSync } from "node:fs"
import { readFile } from "node:fs/promises"
import { extname, resolve } from "node:path"
import { defineConfig } from "vite"

function serve_pagefind() {
  const mime = {
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".wasm": "application/wasm",
    ".pagefind": "application/octet-stream",
    ".pf_meta": "application/octet-stream",
    ".pf_index": "application/octet-stream",
    ".pf_fragment": "application/octet-stream",
  }
  return {
    name: "serve-pagefind-from-build",
    configureServer(server) {
      const root = server.config.root
      const dir = resolve(root, "build/pagefind")
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/pagefind/")) {
          next()
          return
        }
        const path_only = req.url.split("?")[0]
        const relative = path_only.slice(
          "/pagefind/".length,
        )
        const file = resolve(dir, relative)
        if (!file.startsWith(`${dir}/`)) {
          next()
          return
        }
        if (!existsSync(file) || !statSync(file).isFile()) {
          next()
          return
        }
        try {
          const data = await readFile(file)
          const ext = extname(file)
          res.setHeader(
            "Content-Type",
            mime[ext] ?? "application/octet-stream",
          )
          res.setHeader("Cache-Control", "no-cache")
          res.end(data)
        } catch {
          next()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [sveltekit(), serve_pagefind()],
  server: {
    port: 4321,
    strictPort: true,
  },
})
