import preact from "@preact/preset-vite"
import tsconfigPaths from "vite-tsconfig-paths"
import { readFileSync } from "node:fs"
import { defineConfig } from "vite"

const package_json = JSON.parse(
  readFileSync("./package.json", "utf-8"),
)
export default defineConfig(({ command }) => {
  console.log("command", command)
  return {
    plugins: [preact(), tsconfigPaths()],
    root: "src",
    publicDir: "../public",
    build: {
      outDir: "../dist",
      // emptyOutDir: true,
      rollupOptions: {
        output: {
          format: "es",
          entryFileNames:
            command === "build"
              ? "assets/[name].mjs"
              : "assets/[name]-[hash].mjs",
          chunkFileNames:
            command === "build"
              ? "assets/[name].mjs"
              : "assets/[name]-[hash].mjs",
          assetFileNames:
            command === "build"
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
  }
})
