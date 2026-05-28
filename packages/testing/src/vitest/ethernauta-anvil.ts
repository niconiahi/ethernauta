import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { stringify as devalue_stringify } from "devalue"
import { parse } from "valibot"
import type { Plugin } from "vitest/config"

import type { TestConfig } from "../test/config"
import { TestConfigSchema } from "../test/config"

import { OPTIONS_ENV_VAR } from "./constants"

// `ethernauta_anvil()` is the only consumer-facing entry to the
// vitest plugin. It validates options at the boundary, stashes
// them in an env var (devalue-encoded so bigint fields like
// `base_fee` and `fork.block_number` survive the worker-boundary
// roundtrip), and injects the worker-scoped `setup.js` file
// into vitest's `setupFiles`. The setup file then spawns one
// anvil per worker, sets the endpoint, and registers the
// default-on snapshot / revert isolation.
//
// The plugin runs in the main vitest process at config time;
// the setup file runs once per worker. Workers inherit the
// parent's env vars, so the channel works.

const here = dirname(fileURLToPath(import.meta.url))

// `here` resolves to `dist/vitest` post-build; the sibling
// `setup.js` is what vitest needs to import. During in-repo
// development against the source tree, tsdown's incremental
// build produces the same layout under `dist/`.
const SETUP_FILE = join(here, "setup.js")

export function ethernauta_anvil(
  _options: TestConfig = {},
): Plugin {
  const options = parse(TestConfigSchema, _options)
  process.env[OPTIONS_ENV_VAR] = devalue_stringify(options)
  return {
    name: "ethernauta-anvil",
    config(userConfig) {
      const current = userConfig.test?.setupFiles
      const existing =
        current === undefined
          ? []
          : Array.isArray(current)
            ? current
            : [current]
      return {
        test: {
          setupFiles: [...existing, SETUP_FILE],
        },
      }
    },
  }
}
