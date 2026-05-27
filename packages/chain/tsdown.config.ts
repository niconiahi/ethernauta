import { defineConfig } from "tsdown"

export default defineConfig({
  // Each chain ships as its own subpath (`@ethernauta/chain/eip155-1`),
  // so every chain file is an entry — the root index only carries the
  // shared types, no chain re-exports.
  entry: [
    "./src/index.ts",
    "./src/chain/eip155/eip155-*.ts",
  ],
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
