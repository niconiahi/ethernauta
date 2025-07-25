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
        injected: "injected.ts",
        content: "content.ts",
      },
      formats: ["es"],
      fileName: "[name]",
    },
  },
})
