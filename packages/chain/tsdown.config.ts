import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["./src/index.ts"],
  clean: true,
  format: ["esm"],
  dts: { sourcemap: true, tsgo: true },
  sourcemap: true,
  outDir: "./dist",
  unbundle: true,
  minify: false,
  deps: {
    neverBundle: [/^valibot(\/.*)?$/, /^@ethernauta\//],
  },
  tsconfig: "./tsconfig.json",
})
