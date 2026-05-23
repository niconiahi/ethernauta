import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["./src/index.ts"],
  clean: true,
  format: ["esm"],
  dts: { sourcemap: true },
  sourcemap: true,
  outDir: "./dist",
  unbundle: true,
  minify: false,
  external: [/^@ethernauta\//],
  tsconfig: "./tsconfig.json",
})
