import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

// `browser.entry.ts` is loaded as an MV3 content script,
// which Chrome runs as a classic script (no way to mark
// content scripts as ES modules in MV3). The constraint
// isn't really "must be classic" — it's "must have no
// top-level `import` statements," because that's the only
// place classic-script parsing diverges from ESM parsing.
//
// Single-entry `lib` mode with `formats: ['es']` gives us
// exactly that: Rollup has no other entry to share with, so
// it inlines every dependency into one chunk. The output
// stays modern ESM (no IIFE wrapper, no var/function tricks)
// but contains zero top-level imports — loads identically
// in both module and classic contexts.
export default defineConfig({
  plugins: [tsconfigPaths()],
  root: "manifest",
  build: {
    outDir: "../dist",
    lib: {
      entry: "browser.entry.ts",
      formats: ["es"],
      fileName: () => "browser.entry.mjs",
    },
    rollupOptions: {
      output: {
        // Defensive — single-entry implies no dynamic
        // imports get split out either.
        inlineDynamicImports: true,
      },
    },
  },
})
