import { UintSchema } from "@ethernauta/core"
import { ResponseSchema } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { await_ready } from "./await-ready"
import { detect_foundry } from "./detect-foundry"
import { pick_free_port } from "./pick-free-port"
import { spawn_anvil } from "./spawn-anvil"

// Gated by `ETHERNAUTA_TEST_ANVIL=1`. Spawn → query → kill
// round-trip — the Phase 2 exit criterion in standalone form.

const is_enabled = process.env.ETHERNAUTA_TEST_ANVIL === "1"

describe.skipIf(!is_enabled)("spawner round-trip", () => {
  it("spawns anvil, answers eth_blockNumber, and kills cleanly", async () => {
    const detection = await detect_foundry()
    if (detection.status === "missing") {
      throw new Error(
        "anvil is required for this test; set ETHERNAUTA_TEST_ANVIL=0 to skip",
      )
    }
    const port = await pick_free_port()
    const handle = spawn_anvil({
      port,
      extra_args: ["--silent"],
    })
    try {
      await await_ready({ handle, timeout_ms: 10_000 })
      const response = await fetch(
        `http://127.0.0.1:${port}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "eth_blockNumber",
            params: [],
          }),
        },
      )
      const body = parse(ResponseSchema, await response.json())
      if ("error" in body) {
        throw new Error(body.error.message)
      }
      const block_number = parse(UintSchema, body.result)
      expect(block_number.startsWith("0x")).toBe(true)
    } finally {
      handle.kill()
    }
    await new Promise<void>((resolve) => {
      handle.child.on("close", () => resolve())
    })
    expect(handle.child.killed).toBe(true)
  }, 30_000)
})
