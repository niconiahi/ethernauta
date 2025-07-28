import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [tsconfigPaths()],
  root: "manifest",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    lib: {
      entry: {
        "browser.entry": "browser.entry.ts",
        cryptoman: "cryptoman.ts",
        "extension.entry": "extension.entry.ts",
      },
      formats: ["es"],
      fileName: (_, entryName) => `${entryName}.mjs`,
    },
  },
})
