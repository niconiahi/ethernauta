import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfigPaths()],
  root: "manifest",
  publicDir: "../public",
  build: {
    outDir: "../dist",
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
      },
    },
  },
})
