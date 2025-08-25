import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["./src/index.ts", "./src/bin.ts"],
  clean: true,
  format: ["esm"],
  dts: { sourcemap: true },
  sourcemap: true,
  outDir: "./dist",
  unbundle: false,
  minify: false,
  external: [/^valibot(\/.*)?$/, /^@ethernauta\//],
  tsconfig: "./tsconfig.json",
})
