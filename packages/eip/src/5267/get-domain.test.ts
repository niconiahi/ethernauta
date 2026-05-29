import {
  address,
  array,
  bytes1,
  bytes32,
  encode_function_call,
  string_,
  uint256,
} from "@ethernauta/abi"
import {
  AddressSchema,
  ByteSchema,
  Bytes32Schema,
  BytesSchema,
  Uint256Schema,
} from "@ethernauta/core"
import { contract } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  FIELD_CHAIN_ID,
  FIELD_NAME,
  FIELD_SALT,
  FIELD_VERIFYING_CONTRACT,
  FIELD_VERSION,
  decode_fields,
} from "./fields"
import { get_domain } from "./get-domain"

const TOKEN = parse(
  AddressSchema,
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
)
const VERIFYING = parse(
  AddressSchema,
  "0x43506849d7c04f9138d1a2050bbf3a0c054402dd",
)
const SALT = parse(Bytes32Schema, `0x${"7".repeat(64)}`)
const ZERO_ADDR = parse(
  AddressSchema,
  `0x${"0".repeat(40)}`,
)
const ZERO_BYTES32 = parse(
  Bytes32Schema,
  `0x${"0".repeat(64)}`,
)

const OUTPUT_CODECS = [
  bytes1(),
  string_(),
  string_(),
  uint256(),
  address(),
  bytes32(),
  array(uint256()),
] as const

function encode_eip712_domain_response(input: {
  fields: string
  name: string
  version: string
  chainId: string
  verifyingContract: string
  salt: string
  extensions: readonly string[]
}): `0x${string}` {
  // encode_function_call emits selector || encoded sequence.
  // We want only the encoded sequence, so strip the selector.
  const values = [
    parse(ByteSchema, input.fields),
    input.name,
    input.version,
    parse(Uint256Schema, input.chainId),
    parse(AddressSchema, input.verifyingContract),
    parse(Bytes32Schema, input.salt),
    input.extensions.map((value) =>
      parse(Uint256Schema, value),
    ),
  ] as const
  const full = encode_function_call({
    name: "encode_response",
    args: OUTPUT_CODECS,
    values,
  })
  return bytes_to_hex(full.slice(4))
}

describe("decode_fields", () => {
  it("decodes a full domain (all 5 bits set)", () => {
    const fields = decode_fields("0x1f")
    expect(fields.name).toBe(true)
    expect(fields.version).toBe(true)
    expect(fields.chainId).toBe(true)
    expect(fields.verifyingContract).toBe(true)
    expect(fields.salt).toBe(true)
  })

  it("decodes individual flags", () => {
    expect(decode_fields("0x01").name).toBe(true)
    expect(decode_fields("0x01").version).toBe(false)
    expect(decode_fields("0x02").version).toBe(true)
    expect(decode_fields("0x04").chainId).toBe(true)
    expect(decode_fields("0x08").verifyingContract).toBe(true)
    expect(decode_fields("0x10").salt).toBe(true)
  })

  it("bit constants match the spec", () => {
    expect(FIELD_NAME).toBe(0x01)
    expect(FIELD_VERSION).toBe(0x02)
    expect(FIELD_CHAIN_ID).toBe(0x04)
    expect(FIELD_VERIFYING_CONTRACT).toBe(0x08)
    expect(FIELD_SALT).toBe(0x10)
  })
})

describe("get_domain", () => {
  it("builds the eip712Domain() selector calldata", () => {
    const callable = get_domain()(
      contract({ chain_id: "eip155:1", to: TOKEN }),
    )
    // selector(bytes4) = keccak256("eip712Domain()").slice(0, 4)
    // == 0x84b0196e
    expect(callable.data).toBe("0x84b0196e")
    expect(callable.to).toBe(TOKEN)
    expect(callable.chain_id).toBe("eip155:1")
  })

  it("decodes a full domain (all five members set)", () => {
    const callable = get_domain()(
      contract({ chain_id: "eip155:1", to: TOKEN }),
    )
    const response = encode_eip712_domain_response({
      fields: "0x1f",
      name: "USD Coin",
      version: "2",
      chainId: "0x1",
      verifyingContract: VERIFYING,
      salt: SALT,
      extensions: [],
    })
    const result = callable.decode(
      parse(BytesSchema, response),
    )
    expect(result.domain.name).toBe("USD Coin")
    expect(result.domain.version).toBe("2")
    expect(result.domain.chainId).toBe(
      `0x${"0".repeat(63)}1`,
    )
    expect(result.domain.verifyingContract).toBe(VERIFYING)
    expect(result.domain.salt).toBe(SALT)
    expect(result.extensions).toEqual([])
  })

  it("omits domain members the bitmap excludes", () => {
    const callable = get_domain()(
      contract({ chain_id: "eip155:1", to: TOKEN }),
    )
    // Only name + version + chainId + verifyingContract; salt absent.
    // bitmap = 0x0f
    const response = encode_eip712_domain_response({
      fields: "0x0f",
      name: "Permit",
      version: "1",
      chainId: "0x1",
      verifyingContract: VERIFYING,
      salt: ZERO_BYTES32,
      extensions: [],
    })
    const result = callable.decode(
      parse(BytesSchema, response),
    )
    expect(result.domain.name).toBe("Permit")
    expect(result.domain.version).toBe("1")
    expect(result.domain.chainId).toBe(
      `0x${"0".repeat(63)}1`,
    )
    expect(result.domain.verifyingContract).toBe(VERIFYING)
    expect("salt" in result.domain).toBe(false)
  })

  it("surfaces extensions when present", () => {
    const callable = get_domain()(
      contract({ chain_id: "eip155:1", to: TOKEN }),
    )
    const response = encode_eip712_domain_response({
      fields: "0x0d", // name + chainId + verifyingContract
      name: "X",
      version: "",
      chainId: "0x1",
      verifyingContract: VERIFYING,
      salt: ZERO_BYTES32,
      extensions: ["0x52a8"],
    })
    const result = callable.decode(
      parse(BytesSchema, response),
    )
    expect(result.extensions).toHaveLength(1)
    expect(result.extensions[0]).toBe(
      `0x${"0".repeat(60)}52a8`,
    )
    expect("version" in result.domain).toBe(false)
  })

  it("drops every member when the bitmap is zero", () => {
    const callable = get_domain()(
      contract({ chain_id: "eip155:1", to: TOKEN }),
    )
    const response = encode_eip712_domain_response({
      fields: "0x00",
      name: "",
      version: "",
      chainId: "0x0",
      verifyingContract: ZERO_ADDR,
      salt: ZERO_BYTES32,
      extensions: [],
    })
    const result = callable.decode(
      parse(BytesSchema, response),
    )
    expect(Object.keys(result.domain)).toHaveLength(0)
  })
})
