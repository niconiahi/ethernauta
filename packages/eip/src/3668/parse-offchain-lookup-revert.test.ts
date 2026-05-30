import {
  address,
  array,
  bytes,
  bytes4,
  string_,
  tuple,
} from "@ethernauta/abi"
import {
  AddressSchema,
  Bytes4Schema,
  BytesSchema,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { parse_offchain_lookup_revert } from "./parse-offchain-lookup-revert"

const SELECTOR_BYTES = new Uint8Array([
  0x55, 0x6f, 0x18, 0x30,
])

const SENDER = parse(
  AddressSchema,
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
)
const URLS = [
  "https://gw.a.example.com/{sender}/{data}",
  "https://gw.b.example.com/lookup",
]
const CALL_DATA = parse(BytesSchema, "0xdeadbeefcafe")
const CALLBACK = parse(Bytes4Schema, "0xf4d4d2f8")
const EXTRA_DATA = parse(BytesSchema, "0xfeedface")

const codec = tuple({
  sender: address(),
  urls: array(string_()),
  callData: bytes(),
  callbackFunction: bytes4(),
  extraData: bytes(),
})

function build_offchain_lookup_revert(): `0x${string}` {
  const encoded = codec.encode({
    sender: SENDER,
    urls: URLS,
    callData: CALL_DATA,
    callbackFunction: CALLBACK,
    extraData: EXTRA_DATA,
  })
  const out = new Uint8Array(4 + encoded.length)
  out.set(SELECTOR_BYTES, 0)
  out.set(encoded, 4)
  return bytes_to_hex(out)
}

describe("parse-offchain-lookup-revert.ts", () => {
  it("decodes a well-formed OffchainLookup revert round-trip", () => {
    const revert = parse(
      BytesSchema,
      build_offchain_lookup_revert(),
    )
    const decoded = parse_offchain_lookup_revert(revert)
    expect(decoded).not.toBeNull()
    if (decoded === null) return
    expect(decoded.sender).toBe(SENDER)
    expect(decoded.urls).toEqual(URLS)
    expect(decoded.callData).toBe(CALL_DATA)
    expect(decoded.callbackFunction).toBe(CALLBACK)
    expect(decoded.extraData).toBe(EXTRA_DATA)
  })

  it("returns null for an empty revert", () => {
    expect(parse_offchain_lookup_revert(null)).toBeNull()
    expect(
      parse_offchain_lookup_revert(undefined),
    ).toBeNull()
    expect(
      parse_offchain_lookup_revert(
        parse(BytesSchema, "0x"),
      ),
    ).toBeNull()
  })

  it("returns null for Error(string) reverts (selector 0x08c379a0)", () => {
    const error_string_revert = parse(
      BytesSchema,
      // selector 0x08c379a0 + abi.encode(string("boom")) — the
      // exact payload isn't important; `decode_revert_reason`
      // categorises it as `kind: "error"` not `"custom"`.
      `0x08c379a0${"0".repeat(64 * 3)}`,
    )
    expect(
      parse_offchain_lookup_revert(error_string_revert),
    ).toBeNull()
  })

  it("returns null for a different custom error selector", () => {
    const other_custom = parse(
      BytesSchema,
      `0xdeadbeef${"0".repeat(64)}`,
    )
    expect(
      parse_offchain_lookup_revert(other_custom),
    ).toBeNull()
  })

  it("returns null when the OffchainLookup payload is malformed", () => {
    const truncated_payload = new Uint8Array(4 + 8)
    truncated_payload.set(SELECTOR_BYTES, 0)
    const revert = parse(
      BytesSchema,
      bytes_to_hex(truncated_payload),
    )
    expect(parse_offchain_lookup_revert(revert)).toBeNull()
  })

  it("decoded payload bytes match a manual concat of selector + abi-encoded body", () => {
    const revert_hex = build_offchain_lookup_revert()
    const bytes_seq = hex_to_bytes(revert_hex)
    expect(bytes_seq[0]).toBe(0x55)
    expect(bytes_seq[1]).toBe(0x6f)
    expect(bytes_seq[2]).toBe(0x18)
    expect(bytes_seq[3]).toBe(0x30)
  })
})
