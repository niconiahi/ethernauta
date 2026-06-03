import { readFileSync } from "node:fs"
import preact from "@preact/preset-vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const package_json = JSON.parse(
  readFileSync("./package.json", "utf-8"),
)
// Dev mode bundles every chain into a single `chains` chunk
// instead of code-splitting each into its own file. The
// `@ethernauta/chain` registry has ~2,600 chains; per-chain
// splitting is correct for production (lazy load, small
// initial bundle) but in dev it means 2,600 chunk files
// emitted per watch rebuild — slow and noisy. Detect mode
// via the same `--mode development` flag the wallet's dev
// script passes to `vite build --watch`.
const is_dev_mode =
  process.argv.includes("--mode") &&
  process.argv[process.argv.indexOf("--mode") + 1] ===
    "development"

export default defineConfig({
  plugins: [preact(), tsconfigPaths(), tailwindcss()],
  root: "src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    // emptyOutDir: true,
    // Dev mode bundles all chains into one chunk (~1.3 MB);
    // that's the whole point of the dev grouping. Raise the
    // soft warning limit only in dev so the build output
    // stays quiet. Prod's per-chain chunks are tiny.
    chunkSizeWarningLimit: is_dev_mode ? 2000 : 500,
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
          if (
            is_dev_mode &&
            id.includes("/chain/src/chain/eip155/eip155-")
          ) {
            return "chains"
          }
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
