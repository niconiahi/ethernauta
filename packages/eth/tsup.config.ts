import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/**/*.ts", "!./src/**/*.test.ts"],
  clean: true,
  format: ["esm"],
  dts: {
    compilerOptions: {
      declarationMap: true,
      declaration: true,
    },
  },
  sourcemap: true,
  outDir: "./dist",
  bundle: false,
  minify: false,
  tsconfig: "./tsconfig.json",
})
