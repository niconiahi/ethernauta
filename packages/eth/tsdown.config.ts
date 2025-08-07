import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["./src/**/*.ts", "!./src/**/*.test.ts"],
  clean: true,
  format: ["esm"],
  dts: { sourcemap: true },
  sourcemap: true,
  outDir: "./dist",
  bundle: false,
  minify: false,
  tsconfig: "./tsconfig.json",
})
