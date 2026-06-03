// https://specs.optimism.io/protocol/deposits.html#the-deposited-transaction-type
//
// Inverse of `encode_deposit_tx`. Strips the 0x7e prefix,
// RLP-decodes the eight-field payload, and rehydrates the
// `DepositTx` shape:
//   - `source_hash`, `from`, `data` ride through as bytes
//   - `to` becomes `null` for the empty-byte-string creation
//     form, an address otherwise
//   - `mint`, `value`, `gas` come back as minimal big-endian
//     and are renormalized through `UintSchema`
//   - `is_system_tx` decodes the boolean byte (RLP encodes
//     `false`/`0` as the empty string)

import {
  AddressSchema,
  type Bytes,
  BytesSchema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import {
  bigint_to_hex,
  bytes_to_hex,
  hex_to_bytes,
  type RlpDecoded,
  rlp_decode,
} from "@ethernauta/utils"
import { parse } from "valibot"

import {
  type DepositTx,
  DepositTxSchema,
} from "../core/deposit-tx"

const DEPOSIT_TX_TYPE = 0x7e
const HASH32_BYTES = 32
const ADDRESS_BYTES = 20
const GAS_MAX_BYTES = 8

export function decode_deposit_tx(input: Bytes): DepositTx {
  const bytes = hex_to_bytes(input)
  if (bytes.length === 0 || bytes[0] !== DEPOSIT_TX_TYPE) {
    throw new Error(
      "decode_deposit_tx: missing 0x7e type prefix",
    )
  }
  const decoded = rlp_decode(bytes.subarray(1))
  if (!Array.isArray(decoded) || decoded.length !== 8) {
    throw new Error(
      "decode_deposit_tx: expected an eight-field rlp list",
    )
  }
  const [
    source_hash_bytes,
    from_bytes,
    to_bytes,
    mint_bytes,
    value_bytes,
    gas_bytes,
    is_system_bytes,
    data_bytes,
  ] = decoded
  expect_bytes(
    source_hash_bytes,
    HASH32_BYTES,
    "source_hash",
  )
  expect_bytes(from_bytes, ADDRESS_BYTES, "from")
  expect_byte_payload(to_bytes, "to")
  expect_max_bytes(mint_bytes, HASH32_BYTES, "mint")
  expect_max_bytes(value_bytes, HASH32_BYTES, "value")
  expect_max_bytes(gas_bytes, GAS_MAX_BYTES, "gas")
  expect_max_bytes(is_system_bytes, 1, "is_system_tx")
  expect_byte_payload(data_bytes, "data")
  if (
    to_bytes.length !== 0 &&
    to_bytes.length !== ADDRESS_BYTES
  ) {
    throw new Error(
      "decode_deposit_tx: to must be empty or 20-byte payload",
    )
  }
  return parse(DepositTxSchema, {
    source_hash: parse(
      Hash32Schema,
      bytes_to_hex(source_hash_bytes),
    ),
    from: parse(AddressSchema, bytes_to_hex(from_bytes)),
    to:
      to_bytes.length === 0
        ? null
        : parse(AddressSchema, bytes_to_hex(to_bytes)),
    mint: parse(
      UintSchema,
      bigint_to_hex(bytes_to_bigint_be(mint_bytes)),
    ),
    value: parse(
      UintSchema,
      bigint_to_hex(bytes_to_bigint_be(value_bytes)),
    ),
    gas: parse(
      UintSchema,
      bigint_to_hex(bytes_to_bigint_be(gas_bytes)),
    ),
    is_system_tx:
      bytes_to_bigint_be(is_system_bytes) !== 0n,
    data: parse(BytesSchema, bytes_to_hex(data_bytes)),
  })
}

function expect_byte_payload(
  value: RlpDecoded | undefined,
  field: string,
): asserts value is Uint8Array {
  if (!(value instanceof Uint8Array)) {
    throw new Error(
      `decode_deposit_tx: ${field} must be a byte payload, not a nested list`,
    )
  }
}

function expect_bytes(
  value: RlpDecoded | undefined,
  length: number,
  field: string,
): asserts value is Uint8Array {
  expect_byte_payload(value, field)
  if (value.length !== length) {
    throw new Error(
      `decode_deposit_tx: ${field} must be ${length}-byte payload`,
    )
  }
}

function expect_max_bytes(
  value: RlpDecoded | undefined,
  max_length: number,
  field: string,
): asserts value is Uint8Array {
  expect_byte_payload(value, field)
  if (value.length > max_length) {
    throw new Error(
      `decode_deposit_tx: ${field} must be at most ${max_length}-byte payload`,
    )
  }
}

function bytes_to_bigint_be(bytes: Uint8Array): bigint {
  let result = 0n
  for (const byte of bytes) {
    result = (result << 8n) | BigInt(byte)
  }
  return result
}
