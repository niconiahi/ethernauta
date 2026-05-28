import { parse } from "valibot"

import type { TestConfig } from "./config"
import { TestConfigSchema } from "./config"
import { get_endpoint } from "./endpoint-store"

// `anvil(config?)` is the consumer-facing handle to the
// per-worker anvil instance. It returns the endpoint URL,
// which both `http(...)` (path-2 reader composition) and
// `create_provider(...)` (path-1 wallet-shape composition)
// accept directly:
//
//   create_reader([{ chainId, transports: [http(anvil())] }])
//   create_provider(anvil())
//
// The URL is the protocol-level primitive; the 1193 Provider
// is a wrapping convention that `create_provider` builds
// internally when given a URL. Same information, two seams.
//
// The `config` argument is `parse`d at the boundary so a
// malformed value throws immediately rather than silently
// rolling through. In v1 the validated value is reserved for
// future per-call overrides (Phase 7 anvil CLI flags); the
// worker's anvil is shared and the config has no functional
// effect beyond shape validation.

export function anvil(_config: TestConfig = {}): string {
  parse(TestConfigSchema, _config)
  return get_endpoint()
}
