// Integration project for the @ethernauta/testing vitest plugin.
// Loads the published package (via the workspace self-symlink)
// and runs `integration.spec.ts` against a live anvil instance
// the plugin spawned in its setup file. Driven by the gated
// `pnpm test:integration` script.
//
// Deliberately NOT using `vite-tsconfig-paths` — the integration
// suite exercises the BUILT consumer experience, so all
// `@ethernauta/*` imports resolve via the workspace symlinks to
// dist files, identical to what published consumers see.

import { ethernautaAnvil } from "@ethernauta/testing/vitest"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [ethernautaAnvil()],
  test: {
    include: ["./integration/integration.spec.ts"],
    testTimeout: 30_000,
  },
})
