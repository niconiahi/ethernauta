import { setTimeout as sleep } from "node:timers/promises"

import type { SpawnHandle } from "./spawn-anvil"

// Poll `eth_blockNumber` against the local endpoint until the
// node responds. On timeout, kill the subprocess and throw with
// the accumulated stderr so the caller knows why anvil never
// became ready (wrong fork URL, port collision, missing binary
// permissions, …).

// allow-violation: R1-capability-shape
export type AwaitReadyOptions = {
  handle: SpawnHandle
  timeout_ms?: number
  poll_ms?: number
}

export async function await_ready(
  options: AwaitReadyOptions,
): Promise<void> {
  const handle = options.handle
  const timeout_ms = options.timeout_ms ?? 10_000
  const poll_ms = options.poll_ms ?? 50
  const deadline = Date.now() + timeout_ms
  const url = `http://127.0.0.1:${handle.port}`
  while (Date.now() < deadline) {
    if (handle.child.exitCode !== null) {
      throw new Error(
        `anvil exited before becoming ready (code ${handle.child.exitCode})\n` +
          handle.stderr(),
      )
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_blockNumber",
          params: [],
        }),
      })
      if (response.ok) return
    } catch {
      // anvil not yet up; loop
    }
    await sleep(poll_ms)
  }
  handle.kill()
  throw new Error(
    `anvil did not become ready on port ${handle.port} within ${timeout_ms}ms\n` +
      handle.stderr(),
  )
}
