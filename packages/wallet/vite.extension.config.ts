import { readFileSync } from "node:fs"
import preact from "@preact/preset-vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const package_json = JSON.parse(
  readFileSync("./package.json", "utf-8"),
)
export default defineConfig({
  plugins: [preact(), tsconfigPaths()],
  root: "src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    // emptyOutDir: true,
    rollupOptions: {
      output: {
        format: "es",
        entryFileNames: process.argv.includes("--watch")
          ? "assets/[name].mjs"
          : "assets/[name]-[hash].mjs",
        chunkFileNames: process.argv.includes("--watch")
          ? "assets/[name].mjs"
          : "assets/[name]-[hash].mjs",
        assetFileNames: process.argv.includes("--watch")
          ? "assets/[name].[ext]"
          : "assets/[name]-[hash].[ext]",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("preact-robot"))
              return `preact-robot-${package_json.dependencies["preact-robot"]}`
            if (id.includes("preact"))
              return `preact-${package_json.dependencies.preact}`
            if (id.includes("robot3"))
              return `robot3-${package_json.dependencies.robot3}`
            return "vendor"
          }
        },
      },
    },
  },
})
