// https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug
//
// Unit coverage for the debug-tracer bindings. The anvil-driven
// e2e fixture (deploy + multi-call tx → callTracer assertion)
// will land separately when the playground gets the integration
// demo, since it depends on the chain harness; here the focus is
// on the dispatch (`tag`), the wire shape per binding, and a
// round-trip through every tracer's schema.
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import type {
  Call,
  Response,
  SuccesfulResponse,
} from "@ethernauta/transport"
import { invariant } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import { CallFrameSchema } from "./call"
import { debug_traceBlockByNumber } from "./debug-trace-block-by-number"
import { debug_traceCall } from "./debug-trace-call"
import { debug_traceTransaction } from "./debug-trace-transaction"
import { FourByteTraceSchema } from "./fourbyte"
import { PreStateMapSchema, PreStateSchema } from "./prestate"
import { STRUCT_TYPE, StructLogResultSchema } from "./struct"
import { TRACER_TYPE } from "./tracer"

const FROM = parse(
  AddressSchema,
  "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
)
const TO = parse(
  AddressSchema,
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
)
const VALUE = parse(UintSchema, "0x0")
const GAS = parse(UintSchema, "0x5208")
const GAS_USED = parse(UintSchema, "0x5208")
const INPUT = parse(BytesSchema, "0xdeadbeef")
const OUTPUT = parse(BytesSchema, "0x")
const TX_HASH = parse(
  Hash32Schema,
  `0x${"a".repeat(64)}`,
)
const TX_HASH_2 = parse(
  Hash32Schema,
  `0x${"b".repeat(64)}`,
)
const SLOT = parse(Bytes32Schema, `0x${"0".repeat(64)}`)
const SLOT_VALUE = parse(
  Bytes32Schema,
  `0x${"f".repeat(64)}`,
)

function make_capturing_transport(canned: Response): {
  transport: (call: Call) => Promise<Response>
  calls: Call[]
} {
  const calls: Call[] = []
  return {
    transport: async (call: Call): Promise<Response> => {
      calls.push(call)
      return canned
    },
    calls,
  }
}

function ok(result: SuccesfulResponse["result"]): Response {
  return { id: "1", jsonrpc: "2.0", result }
}

describe("CallFrameSchema", () => {
  it("round-trips a nested two-level frame", () => {
    const inner = {
      type: "STATICCALL",
      from: TO,
      to: FROM,
      gas: GAS,
      gasUsed: GAS_USED,
      input: INPUT,
      output: OUTPUT,
    }
    const outer = {
      type: "CALL",
      from: FROM,
      to: TO,
      value: VALUE,
      gas: GAS,
      gasUsed: GAS_USED,
      input: INPUT,
      output: OUTPUT,
      calls: [inner],
    }
    expect(() => parse(CallFrameSchema, outer)).not.toThrow()
  })

  it("rejects a call type the schema doesn't list", () => {
    expect(() =>
      parse(CallFrameSchema, {
        type: "FOOCALL",
        from: FROM,
        gas: GAS,
        gasUsed: GAS_USED,
        input: INPUT,
      }),
    ).toThrow()
  })
})

describe("PreStateSchema", () => {
  it("round-trips a map shape (no diffMode)", () => {
    const map = {
      [FROM]: { balance: parse(UintSchema, "0x1") },
      [TO]: { storage: { [SLOT]: SLOT_VALUE } },
    }
    expect(() => parse(PreStateMapSchema, map)).not.toThrow()
    expect(() => parse(PreStateSchema, map)).not.toThrow()
  })

  it("round-trips a { pre, post } shape (diffMode)", () => {
    const diff = {
      pre: { [FROM]: { balance: parse(UintSchema, "0x1") } },
      post: { [FROM]: { balance: parse(UintSchema, "0x2") } },
    }
    expect(() => parse(PreStateSchema, diff)).not.toThrow()
  })
})

describe("FourByteTraceSchema", () => {
  it("round-trips a selector → count map", () => {
    expect(() =>
      parse(FourByteTraceSchema, {
        "0xa9059cbb-68": 3,
        "0x70a08231-36": 1,
      }),
    ).not.toThrow()
  })
})

describe("StructLogResultSchema", () => {
  it("round-trips an ExecutionResult wrapper", () => {
    const result = {
      gas: 21000,
      failed: false,
      returnValue: "0x",
      structLogs: [
        {
          pc: 0,
          op: "PUSH1",
          gas: 21000,
          gasCost: 3,
          depth: 1,
        },
      ],
    }
    expect(() =>
      parse(StructLogResultSchema, result),
    ).not.toThrow()
  })
})

describe("debug_traceCall — wire shape + dispatch", () => {
  it("emits [transaction, block] when no tracer config given", async () => {
    const { transport, calls } = make_capturing_transport(
      ok({
        gas: 21000,
        failed: false,
        returnValue: "0x",
        structLogs: [],
      }),
    )
    const result = await debug_traceCall([
      { to: TO, input: INPUT },
      "latest",
    ])([[transport], { chain_id: "eip155:1" }])
    expect(calls).toHaveLength(1)
    const call0 = calls[0]
    invariant(call0, "expected one captured call")
    const [method, params] = call0
    expect(method).toBe("debug_traceCall")
    expect(params).toEqual([
      { to: TO, input: INPUT },
      "latest",
    ])
    expect(result.tracer).toBe(STRUCT_TYPE.literal)
  })

  it("emits [transaction, block, tracerConfig] when tracer config given, tags callTracer result", async () => {
    const { transport, calls } = make_capturing_transport(
      ok({
        type: "CALL",
        from: FROM,
        to: TO,
        value: VALUE,
        gas: GAS,
        gasUsed: GAS_USED,
        input: INPUT,
        output: OUTPUT,
      }),
    )
    const result = await debug_traceCall([
      { to: TO, input: INPUT },
      "latest",
      { tracer: TRACER_TYPE.CALL },
    ])([[transport], { chain_id: "eip155:1" }])
    const call0 = calls[0]
    invariant(call0, "expected one captured call")
    const [, params] = call0
    expect(params).toEqual([
      { to: TO, input: INPUT },
      "latest",
      { tracer: TRACER_TYPE.CALL },
    ])
    expect(result.tracer).toBe(TRACER_TYPE.CALL)
    if (result.tracer === TRACER_TYPE.CALL) {
      expect(result.result.from).toBe(FROM)
    }
  })

  it("tags prestateTracer result", async () => {
    const { transport } = make_capturing_transport(
      ok({ [FROM]: { balance: parse(UintSchema, "0x1") } }),
    )
    const result = await debug_traceCall([
      { to: TO, input: INPUT },
      "latest",
      { tracer: TRACER_TYPE.PRESTATE },
    ])([[transport], { chain_id: "eip155:1" }])
    expect(result.tracer).toBe(TRACER_TYPE.PRESTATE)
  })

  it("tags 4byteTracer result", async () => {
    const { transport } = make_capturing_transport(
      ok({ "0xa9059cbb-68": 1 }),
    )
    const result = await debug_traceCall([
      { to: TO, input: INPUT },
      "latest",
      { tracer: TRACER_TYPE.FOURBYTE },
    ])([[transport], { chain_id: "eip155:1" }])
    expect(result.tracer).toBe(TRACER_TYPE.FOURBYTE)
  })

  it("accepts object-form parameters", async () => {
    const { transport, calls } = make_capturing_transport(
      ok({ "0xa9059cbb-68": 1 }),
    )
    await debug_traceCall({
      transaction: { to: TO, input: INPUT },
      blockNumberOrTagOrHash: "latest",
      tracerConfig: { tracer: TRACER_TYPE.FOURBYTE },
    })([[transport], { chain_id: "eip155:1" }])
    const call0 = calls[0]
    invariant(call0, "expected one captured call")
    const [, params] = call0
    expect(params).toEqual([
      { to: TO, input: INPUT },
      "latest",
      { tracer: TRACER_TYPE.FOURBYTE },
    ])
  })
})

describe("debug_traceTransaction — wire shape + dispatch", () => {
  it("emits [tx_hash] when no tracer config given", async () => {
    const { transport, calls } = make_capturing_transport(
      ok({
        gas: 21000,
        failed: false,
        returnValue: "0x",
        structLogs: [],
      }),
    )
    const result = await debug_traceTransaction([TX_HASH])([
      [transport],
      { chain_id: "eip155:1" },
    ])
    const call0 = calls[0]
    invariant(call0, "expected one captured call")
    const [method, params] = call0
    expect(method).toBe("debug_traceTransaction")
    expect(params).toEqual([TX_HASH])
    expect(result.tracer).toBe(STRUCT_TYPE.literal)
  })

  it("emits [tx_hash, tracerConfig] when given", async () => {
    const { transport, calls } = make_capturing_transport(
      ok({ "0xa9059cbb-68": 1 }),
    )
    await debug_traceTransaction([
      TX_HASH,
      { tracer: TRACER_TYPE.FOURBYTE },
    ])([[transport], { chain_id: "eip155:1" }])
    const call0 = calls[0]
    invariant(call0, "expected one captured call")
    const [, params] = call0
    expect(params).toEqual([TX_HASH, { tracer: TRACER_TYPE.FOURBYTE }])
  })
})

describe("debug_traceBlockByNumber — wire shape + per-entry dispatch", () => {
  it("returns one BlockTraceEntry per wire entry, tagged with the requested tracer", async () => {
    const block = parse(UintSchema, "0x10")
    const { transport, calls } = make_capturing_transport(
      ok([
        {
          txHash: TX_HASH,
          result: { "0xa9059cbb-68": 1 },
        },
        {
          txHash: TX_HASH_2,
          result: { "0x70a08231-36": 2 },
        },
      ]),
    )
    const entries = await debug_traceBlockByNumber([
      block,
      { tracer: TRACER_TYPE.FOURBYTE },
    ])([[transport], { chain_id: "eip155:1" }])
    const call0 = calls[0]
    invariant(call0, "expected one captured call")
    expect(call0[0]).toBe("debug_traceBlockByNumber")
    expect(entries).toHaveLength(2)
    const [entry0, entry1] = entries
    invariant(entry0, "expected entry 0")
    invariant(entry1, "expected entry 1")
    expect(entry0.txHash).toBe(TX_HASH)
    expect(entry0.trace.tracer).toBe(TRACER_TYPE.FOURBYTE)
    expect(entry1.txHash).toBe(TX_HASH_2)
  })
})
