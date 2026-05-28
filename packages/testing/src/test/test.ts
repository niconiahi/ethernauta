import { parse } from "valibot"

import type { TestConfig } from "./config"
import { TestConfigSchema } from "./config"
import { get_endpoint } from "./endpoint-store"

// `test(config?)` is the consumer-facing handle to the
// per-worker anvil instance. It returns the endpoint URL that
// `http(...)` consumes, so a test file composes it straight into
// the resolver factories:
//
//   create_reader([{ chainId, transports: [http(test())] }])
//
// The `config` argument is `parse`d at the boundary so a
// malformed value throws immediately rather than silently
// rolling through; in v1 the validated value is reserved for
// future per-call overrides (Phase 4 fork mode, Phase 7 anvil
// CLI flags). For now the worker's anvil is shared and the
// config has no functional effect beyond shape validation.

export function test(_config: TestConfig = {}): string {
  parse(TestConfigSchema, _config)
  return get_endpoint()
}
