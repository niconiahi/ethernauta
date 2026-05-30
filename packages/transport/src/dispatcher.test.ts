import { describe, expect, it } from "vitest"

import type { Call } from "./call"
import {
  create_dispatcher,
  type DispatcherStrategy,
} from "./dispatcher"
import type { Http } from "./http"
import type { Response } from "./json-rpc"

function ok_transport(result: string): Http {
  return async (_call: Call): Promise<Response> => ({
    jsonrpc: "2.0",
    id: "1",
    result,
  })
}

function rejecting_transport(message: string): Http {
  return async (_call: Call): Promise<Response> => {
    throw new Error(message)
  }
}

function slow_ok_transport(
  result: string,
  delay_ms: number,
): Http {
  return async (_call: Call): Promise<Response> => {
    await new Promise((resolve) =>
      setTimeout(resolve, delay_ms),
    )
    return { jsonrpc: "2.0", id: "1", result }
  }
}

function tracking_transport(
  log: string[],
  label: string,
  outcome: "ok" | "fail",
): Http {
  return async (_call: Call): Promise<Response> => {
    log.push(label)
    if (outcome === "fail") {
      throw new Error(`${label} failed`)
    }
    return { jsonrpc: "2.0", id: "1", result: label }
  }
}

const CALL: Call = ["eth_blockNumber"]
const PARALLEL: DispatcherStrategy = { type: "parallel" }
const SEQUENTIAL: DispatcherStrategy = {
  type: "sequential",
}

describe("create_dispatcher", () => {
  describe("parallel", () => {
    it("returns the fastest successful response", async () => {
      const dispatcher = create_dispatcher(
        [
          slow_ok_transport("slow", 20),
          ok_transport("fast"),
        ],
        PARALLEL,
      )
      const response = await dispatcher(CALL)
      expect(response).toMatchObject({ result: "fast" })
    })

    it("succeeds when one transport fails but another resolves", async () => {
      const dispatcher = create_dispatcher(
        [rejecting_transport("boom"), ok_transport("ok")],
        PARALLEL,
      )
      const response = await dispatcher(CALL)
      expect(response).toMatchObject({ result: "ok" })
    })

    it("throws AggregateError when every transport rejects", async () => {
      const dispatcher = create_dispatcher(
        [
          rejecting_transport("a"),
          rejecting_transport("b"),
        ],
        PARALLEL,
      )
      await expect(dispatcher(CALL)).rejects.toBeInstanceOf(
        AggregateError,
      )
    })
  })

  describe("sequential", () => {
    it("returns the first transport's response without calling later transports", async () => {
      const log: string[] = []
      const dispatcher = create_dispatcher(
        [
          tracking_transport(log, "a", "ok"),
          tracking_transport(log, "b", "ok"),
        ],
        SEQUENTIAL,
      )
      const response = await dispatcher(CALL)
      expect(response).toMatchObject({ result: "a" })
      expect(log).toEqual(["a"])
    })

    it("falls through to the next transport when the first rejects", async () => {
      const log: string[] = []
      const dispatcher = create_dispatcher(
        [
          tracking_transport(log, "a", "fail"),
          tracking_transport(log, "b", "ok"),
          tracking_transport(log, "c", "ok"),
        ],
        SEQUENTIAL,
      )
      const response = await dispatcher(CALL)
      expect(response).toMatchObject({ result: "b" })
      expect(log).toEqual(["a", "b"])
    })

    it("throws AggregateError carrying every error when all transports fail", async () => {
      const dispatcher = create_dispatcher(
        [
          rejecting_transport("first"),
          rejecting_transport("second"),
        ],
        SEQUENTIAL,
      )
      await expect(dispatcher(CALL)).rejects.toBeInstanceOf(
        AggregateError,
      )
      await expect(dispatcher(CALL)).rejects.toMatchObject({
        errors: [
          expect.objectContaining({ message: "first" }),
          expect.objectContaining({ message: "second" }),
        ],
      })
    })
  })
})
