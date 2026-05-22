import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    // KZG pairings + 4096-point MSM are legit-slow in pure JS;
    // under concurrent workspace load some valid-blob cases exceed
    // the default 5s timeout. Bump to 60s for this package.
    testTimeout: 60_000,
  },
})
