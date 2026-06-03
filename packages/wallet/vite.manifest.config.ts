import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

// Dev mode bundles every chain into a single `chains` chunk
// instead of code-splitting each into its own file. The
// `@ethernauta/chain` registry has ~2,600 chains; per-chain
// splitting is correct for production but in dev it means
// 2,600 chunk files emitted per watch rebuild. `wallet.ts`
// transitively imports `find_chain` → `chain-loaders.ts`'s
// `import.meta.glob`, so this config needs the same grouping
// rule as `vite.extension.config.ts`. Detect mode via the
// same `--mode development` flag the dev script passes.
const is_dev_mode =
  process.argv.includes("--mode") &&
  process.argv[
    process.argv.indexOf("--mode") + 1
  ] === "development"

export default defineConfig({
  plugins: [tsconfigPaths()],
  root: "manifest",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    chunkSizeWarningLimit: is_dev_mode ? 2000 : 500,
    // Intentionally NOT emptying — `vite.extension.config.ts`
    // emits the popup (index.html + assets) into the same
    // dir, and `pnpm dev` runs both watch builds in parallel
    // (`run-p "build:*:watch"`). A manifest-side empty would
    // race with the popup writes and produce half-states
    // where one half is current and the other is gone.
    // browser.entry.ts is loaded as an MV3 content script,
    // which is a classic script — it cannot `import` from
    // another chunk. It has its own config
    // (vite.content.config.ts) that emits a self-contained
    // IIFE. wallet.ts (page-injected via `<script
    // type="module">`) and extension.entry.ts (service
    // worker, manifest `"type": "module"`) both load as ES
    // modules and can share chunks freely.
    lib: {
      entry: {
        wallet: "wallet.ts",
        "extension.entry": "extension.entry.ts",
      },
      formats: ["es"],
      fileName: (_, entryName) => `${entryName}.mjs`,
    },
    rollupOptions: {
      output: {
        chunkFileNames: "assets/[name]-[hash].mjs",
        manualChunks(id) {
          if (
            is_dev_mode &&
            id.includes("/chain/src/chain/eip155/eip155-")
          ) {
            return "chains"
          }
        },
      },
    },
  },
})
