import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["./src/index.ts", "./src/vitest/setup.ts"],
  clean: true,
  format: ["esm"],
  dts: { sourcemap: true },
  sourcemap: true,
  outDir: "./dist",
  unbundle: true,
  minify: false,
  external: [
    /^valibot(\/.*)?$/,
    /^@ethernauta\//,
    /^vitest(\/.*)?$/,
    /^node:.*/,
    /^devalue$/,
  ],
  tsconfig: "./tsconfig.json",
})
