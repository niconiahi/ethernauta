// Integration project for the @ethernauta/testing vitest plugin.
// Loads the built dist plugin (matching what published consumers
// see) and runs `integration.test.ts` against a live anvil
// instance the plugin spawned in its setup file. Driven by the
// gated `pnpm test:integration` script.

import { ethernautaAnvil } from "../dist/vitest/index.js"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [ethernautaAnvil()],
  test: {
    include: ["./integration/integration.spec.ts"],
    testTimeout: 30_000,
  },
})
