/// <reference types='vitest' />
import * as path from "node:path"

import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  cacheDir: "../node_modules/.vite/connector",

  plugins: [
    nxViteTsPaths(),
    dts({
      entryRoot: "src",
      tsConfigFilePath: path.join(__dirname, "tsconfig.lib.json"),
      skipDiagnostics: true,
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    lib: {
      entry: "src/index.ts",
      name: "connector",
      fileName: (format) => {
        return `index.${format === "es" ? "js" : "cjs"}`
      },
      // Don't forget to update your package.json as well.
      formats: ["es", "cjs"],
    },
    minify: false,
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [],
    },
  },

  test: {
    globals: true,
    cache: {
      dir: "../node_modules/.vitest",
    },
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
})
