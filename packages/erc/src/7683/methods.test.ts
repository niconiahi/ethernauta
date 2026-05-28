import { to_selector } from "@ethernauta/abi"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Uint32Schema,
  Uint256Schema,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  FILL_SIGNATURE,
  fill,
} from "./extensions/destination-settler/methods/fill"
import {
  OPEN_SIGNATURE,
  open,
} from "./extensions/origin-settler/methods/open"
import {
  OPEN_FOR_SIGNATURE,
  openFor,
} from "./extensions/origin-settler/methods/open-for"
import {
  RESOLVE_SIGNATURE,
  resolve,
} from "./extensions/origin-settler/methods/resolve"
import {
  RESOLVE_FOR_SIGNATURE,
  resolveFor,
} from "./extensions/origin-settler/methods/resolve-for"

const CONTRACT = parse(
  AddressSchema,
  "0x3333333333333333333333333333333333333333",
)
const FILL_DEADLINE = parse(Uint32Schema, "0x65b3b3b3")
const ORDER_DATA_TYPE = parse(
  Bytes32Schema,
  "0x0000000000000000000000000000000000000000000000000000000000000001",
)
const ORDER_DATA = parse(BytesSchema, "0xdeadbeef")
const EMPTY_BYTES = parse(BytesSchema, "0x")

const ORDER = {
  fillDeadline: FILL_DEADLINE,
  orderDataType: ORDER_DATA_TYPE,
  orderData: ORDER_DATA,
}

const GASLESS_ORDER = {
  originSettler: parse(
    AddressSchema,
    "0x1111111111111111111111111111111111111111",
  ),
  user: parse(
    AddressSchema,
    "0x2222222222222222222222222222222222222222",
  ),
  nonce: parse(Uint256Schema, "0x1"),
  originChainId: parse(Uint256Schema, "0x1"),
  openDeadline: parse(Uint32Schema, "0x65b3b3b3"),
  fillDeadline: FILL_DEADLINE,
  orderDataType: ORDER_DATA_TYPE,
  orderData: ORDER_DATA,
}

describe("ERC-7683 generated bindings — canonical signatures", () => {
  // Signatures recurse through `components` and parenthesize tuple types.
  // These are what `to_selector(name + canonical-args)` keccak-hashes, so
  // any drift here breaks every dapp call to a real contract.

  it("open: tuple input is expanded to its component types", () => {
    expect(OPEN_SIGNATURE.signature).toBe(
      "open((uint32,bytes32,bytes))",
    )
    expect(OPEN_SIGNATURE.names).toEqual(["order"])
  })

  it("openFor: a tuple input alongside primitive inputs keeps the right order", () => {
    expect(OPEN_FOR_SIGNATURE.signature).toBe(
      "openFor((address,address,uint256,uint256,uint32,uint32,bytes32,bytes),bytes,bytes)",
    )
    expect(OPEN_FOR_SIGNATURE.names).toEqual([
      "order",
      "signature",
      "originFillerData",
    ])
  })

  it("resolve: the canonical signature only reflects INPUT components, not outputs", () => {
    // The selector is hashed from inputs only — return types are
    // tag-along data, not part of solidity's overload identity.
    expect(RESOLVE_SIGNATURE.signature).toBe(
      "resolve((uint32,bytes32,bytes))",
    )
  })

  it("resolveFor: same shape, with an extra bytes input", () => {
    expect(RESOLVE_FOR_SIGNATURE.signature).toBe(
      "resolveFor((address,address,uint256,uint256,uint32,uint32,bytes32,bytes),bytes)",
    )
  })

  it("fill: leaf-only inputs survive the refactor", () => {
    expect(FILL_SIGNATURE.signature).toBe(
      "fill(bytes32,bytes,bytes)",
    )
  })
})

describe("ERC-7683 resolve(tuple) — calldata selector matches canonical signature", () => {
  it("the 4-byte calldata prefix equals keccak256(canonical-signature)[0..4]", () => {
    // This is the contract-correctness invariant: the codec tree must
    // serialize to the same canonical form as the exported SIGNATURE
    // constant, otherwise the on-chain method dispatch fails.
    const call = resolve({ order: ORDER })({
      chain_id: "eip155:1",
      to: CONTRACT,
    })
    const expected_selector = bytes_to_hex(
      to_selector(RESOLVE_SIGNATURE.signature),
    )
    const actual_selector = bytes_to_hex(
      hex_to_bytes(call.data).slice(0, 4),
    )
    expect(actual_selector).toBe(expected_selector)
  })
})

describe("ERC-7683 — calldata encoding smoke tests", () => {
  // Each binding constructs valid calldata for shape-conformant input.
  // The selector test above already validates the codec-tree-vs-signature
  // agreement; these confirm dynamic-arg encoding (tuples + bytes) does
  // not throw at runtime.

  it("resolveFor accepts a gasless order + originFillerData", () => {
    const call = resolveFor({
      order: GASLESS_ORDER,
      originFillerData: EMPTY_BYTES,
    })({
      chain_id: "eip155:1",
      to: CONTRACT,
    })
    expect(call.data.startsWith("0x")).toBe(true)
    expect(
      bytes_to_hex(hex_to_bytes(call.data).slice(0, 4)),
    ).toBe(
      bytes_to_hex(
        to_selector(RESOLVE_FOR_SIGNATURE.signature),
      ),
    )
  })

  it("fill returns a Signable (function), not a Callable", () => {
    const signable = fill({
      orderId: parse(
        Bytes32Schema,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      ),
      originData: EMPTY_BYTES,
      fillerData: EMPTY_BYTES,
    })
    expect(typeof signable).toBe("function")
  })

  it("open returns a Signable that closes over an OnchainCrossChainOrder", () => {
    const signable = open({ order: ORDER })
    expect(typeof signable).toBe("function")
  })

  it("openFor returns a Signable accepting GaslessCrossChainOrder + bytes + bytes", () => {
    const signable = openFor({
      order: GASLESS_ORDER,
      signature: EMPTY_BYTES,
      originFillerData: EMPTY_BYTES,
    })
    expect(typeof signable).toBe("function")
  })
})
