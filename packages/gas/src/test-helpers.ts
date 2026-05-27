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
