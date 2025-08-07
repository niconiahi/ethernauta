import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/**/*.ts"],
  clean: true,
  format: ["esm"],
  dts: {
    compilerOptions: {
      declarationMap: true,
    },
  },
  sourcemap: true,
  outDir: "./dist",
  bundle: false,
  minify: false,
})
