import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"
import { fileURLToPath } from "node:url"
import { dirname } from "node:path"

const rootPath = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    root: rootPath,
    include: ["packages/**/*.test.ts"],
    environment: "node",
  },
})
