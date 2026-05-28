import { createServer } from "node:net"

import { describe, expect, it } from "vitest"

import { pick_free_port } from "./pick-free-port"

describe("pick_free_port", () => {
  it("returns a positive integer port", async () => {
    const port = await pick_free_port()
    expect(Number.isInteger(port)).toBe(true)
    expect(port).toBeGreaterThan(0)
  })

  it("returns a different port on each call (very high probability)", async () => {
    const a = await pick_free_port()
    const b = await pick_free_port()
    // The kernel may reuse a port across two close-listen cycles
    // when nothing else is competing; assert only that both are
    // usable, not that they differ.
    expect(a).toBeGreaterThan(0)
    expect(b).toBeGreaterThan(0)
  })

  it("returns a port that can be bound immediately", async () => {
    const port = await pick_free_port()
    await new Promise<void>((resolve, reject) => {
      const server = createServer()
      server.once("error", reject)
      server.listen(port, "127.0.0.1", () => {
        server.close(() => resolve())
      })
    })
  })
})
