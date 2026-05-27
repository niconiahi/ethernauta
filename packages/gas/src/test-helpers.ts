// Test-only helpers: not bundled, imported by *.test.ts files.
import type { Call, Response } from "@ethernauta/transport"

export function stub_http(
  response_result: unknown,
): (_call: Call) => Promise<Response> {
  return async (_call: Call): Promise<Response> => ({
    id: "test",
    jsonrpc: "2.0",
    result: response_result,
  })
}

// Per-method stub for orchestrators that issue multiple distinct
// JSON-RPC calls. Keyed on the method name; throws on unknown
// methods so tests fail loudly when a new dependency sneaks in.
export function stub_http_by_method(
  results: Record<string, unknown>,
): (_call: Call) => Promise<Response> {
  return async (_call: Call): Promise<Response> => {
    const method = _call[0]
    if (!(method in results)) {
      throw new Error(
        `stub_http_by_method: no fixture for "${method}"`,
      )
    }
    return {
      id: "test",
      jsonrpc: "2.0",
      result: results[method],
    }
  }
}
