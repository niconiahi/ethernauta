import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfigPaths()],
  root: "manifest",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    lib: {
      entry: {
        wallet: "wallet.ts",
        "browser.entry": "browser.entry.ts",
        "extension.entry": "extension.entry.ts",
      },
      formats: ["es"],
      fileName: (_, entryName) => `${entryName}.mjs`,
    },
  },
})
