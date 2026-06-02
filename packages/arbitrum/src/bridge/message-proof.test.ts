import {
  array,
  bytes32 as bytes32_codec,
  encode_sequence,
  function_selector,
  uint64 as uint64_codec,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  type Bytes32,
  Bytes32Schema,
  BytesSchema,
  Uint64Schema,
  Uint256Schema,
} from "@ethernauta/core"
import type {
  Call,
  Reader,
  ResolvedBridge,
  Response,
} from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { object, parse, tuple } from "valibot"
import { describe, expect, it } from "vitest"

import { fetch_message_proof } from "./message-proof"

const ARB_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "421614",
})
const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
// Arb Sepolia Outbox proxy — from packages/arbitrum/src/deploys/eip155-421614.ts
const OUTBOX = parse(
  AddressSchema,
  "0x65f07C7D521164a4d5DaC6eB8Fac8DA067A3B78F",
)
const ARB_SYS = parse(
  AddressSchema,
  "0x0000000000000000000000000000000000000064",
)
const NODE_INTERFACE = parse(
  AddressSchema,
  "0x00000000000000000000000000000000000000C8",
)
const L2_SENDER = parse(
  AddressSchema,
  "0x1111111111111111111111111111111111111111",
)
const TARGET = parse(
  AddressSchema,
  "0x2222222222222222222222222222222222222222",
)
const PROOF_A = parse(
  Bytes32Schema,
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
)
const PROOF_B = parse(
  Bytes32Schema,
  "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
)
const SEND_LEAF = parse(
  Bytes32Schema,
  "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
)
const SEND_ROOT = parse(
  Bytes32Schema,
  "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
)
const TREE_ROOT = parse(
  Bytes32Schema,
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
)
const ZERO_BYTES32 = parse(
  Bytes32Schema,
  `0x${"0".repeat(64)}`,
)
const CONFIRMED_BLOCK = parse(
  Bytes32Schema,
  `0x${"0".repeat(56)}${"abcdef00"}`,
)
const TREE_SIZE = parse(Uint64Schema, "0x10")
const MESSAGE = {
  position: parse(Uint64Schema, "0x05"),
  l2Sender: L2_SENDER,
  to: TARGET,
  l2Block: parse(Uint256Schema, "0x4d2"),
  l1Block: parse(Uint256Schema, "0x1a4"),
  l2Timestamp: parse(Uint256Schema, "0x65"),
  value: parse(Uint256Schema, "0x0de0b6b3a7640000"),
  data: parse(BytesSchema, "0xdeadbeef"),
}

const SEND_MERKLE_TREE_STATE_SELECTOR = function_selector(
  "sendMerkleTreeState",
  [],
)
const CONSTRUCT_OUTBOX_PROOF_SELECTOR = function_selector(
  "constructOutboxProof",
  [uint64_codec(), uint64_codec()],
)
const ROOTS_SELECTOR = function_selector("roots", [
  bytes32_codec(),
])

const EthCallParamsSchema = tuple([
  object({ to: AddressSchema, input: BytesSchema }),
])

function ok_response<T>(result: T): Response {
  return { jsonrpc: "2.0", id: "1", result }
}

function build_l2_reader(): {
  reader: Reader
  calls: string[]
} {
  const calls: string[] = []
  const reader: Reader = async (
    call: Call,
  ): Promise<Response> => {
    const [method, params] = call
    if (method !== "eth_call") {
      throw new Error(
        `unexpected L2 method: ${String(method)}`,
      )
    }
    const [{ to, input }] = parse(
      EthCallParamsSchema,
      params,
    )
    calls.push(`${to}:${input.slice(0, 10)}`)
    const selector = input.slice(0, 10)
    if (
      to === ARB_SYS &&
      selector === SEND_MERKLE_TREE_STATE_SELECTOR
    ) {
      const empty_partials: Bytes32[] = []
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence(
              [
                uint256_codec(),
                bytes32_codec(),
                array(bytes32_codec()),
              ],
              [
                parse(Uint256Schema, "0x10"),
                TREE_ROOT,
                empty_partials,
              ],
            ),
          ),
        ),
      )
    }
    if (
      to === NODE_INTERFACE &&
      selector === CONSTRUCT_OUTBOX_PROOF_SELECTOR
    ) {
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence(
              [
                bytes32_codec(),
                bytes32_codec(),
                array(bytes32_codec()),
              ],
              [SEND_LEAF, SEND_ROOT, [PROOF_A, PROOF_B]],
            ),
          ),
        ),
      )
    }
    throw new Error(
      `unexpected L2 call to=${to} selector=${selector}`,
    )
  }
  return { reader, calls }
}

function build_l1_reader(input: { confirmed: boolean }): {
  reader: Reader
  calls: string[]
} {
  const calls: string[] = []
  const reader: Reader = async (
    call: Call,
  ): Promise<Response> => {
    const [method, params] = call
    if (method !== "eth_call") {
      throw new Error(
        `unexpected L1 method: ${String(method)}`,
      )
    }
    const [{ to, input: data }] = parse(
      EthCallParamsSchema,
      params,
    )
    calls.push(`${to}:${data.slice(0, 10)}`)
    const selector = data.slice(0, 10)
    if (to === OUTBOX && selector === ROOTS_SELECTOR) {
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence(
              [bytes32_codec()],
              [
                input.confirmed
                  ? CONFIRMED_BLOCK
                  : ZERO_BYTES32,
              ],
            ),
          ),
        ),
      )
    }
    throw new Error(
      `unexpected L1 call to=${to} selector=${selector}`,
    )
  }
  return { reader, calls }
}

function build_resolved(input: {
  l1: Reader
  l2: Reader
}): ResolvedBridge {
  return {
    l1: { chain_id: SEPOLIA, reader: input.l1 },
    l2: { chain_id: ARB_SEPOLIA, reader: input.l2 },
  }
}

describe("fetch_message_proof", () => {
  it("composes constructOutboxProof on L2 + Outbox.roots on L1 and returns the MessageProof bundle", async () => {
    const { reader: l2_reader } = build_l2_reader()
    const { reader: l1_reader } = build_l1_reader({
      confirmed: true,
    })
    const resolved = build_resolved({
      l1: l1_reader,
      l2: l2_reader,
    })
    const proof = await fetch_message_proof({
      message: MESSAGE,
    })(resolved)
    expect(proof.message).toEqual(MESSAGE)
    expect(proof.proof).toEqual([PROOF_A, PROOF_B])
    expect(proof.sendRoot).toBe(SEND_ROOT)
    expect(proof.sendCount).toBe(TREE_SIZE)
  })

  it("throws when no confirmed Rollup assertion covers the withdrawal", async () => {
    const { reader: l2_reader } = build_l2_reader()
    const { reader: l1_reader } = build_l1_reader({
      confirmed: false,
    })
    const resolved = build_resolved({
      l1: l1_reader,
      l2: l2_reader,
    })
    await expect(
      fetch_message_proof({ message: MESSAGE })(resolved),
    ).rejects.toThrow(
      /no confirmed Rollup assertion covers/,
    )
  })
})
