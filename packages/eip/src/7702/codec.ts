// https://eips.ethereum.org/EIPS/eip-7702
// Wire codec for type-4 (SetCode) transactions. Bridges the
// JSON-RPC / 1193 shape (`transaction.ts`) and the bytes
// `eth_sendRawTransaction` accepts. The schema is the single
// source of truth — RLP only enters this file.

import {
  type Address,
  addressSchema,
  byteSchema,
  bytesSchema,
  type Bytes,
  hash32Schema,
  type Uint,
  uintSchema,
} from "@ethernauta/core"
import type {
  AccessList,
  AccessListEntry,
} from "@ethernauta/eip/2930"
import {
  bytes_to_hex,
  bytes_to_uint,
  hex_to_bytes,
  type RlpDecoded,
  type RlpInput,
  rlp_decode,
  rlp_encode,
} from "@ethernauta/utils"
import { parse } from "valibot"
import {
  type AuthorizationList,
  type AuthorizationSigned,
  SET_CODE_TX_TYPE,
} from "./authorization"
import {
  type Transaction7702Signed,
  transaction7702SignedSchema,
  type Transaction7702Unsigned,
  transaction7702UnsignedSchema,
} from "./transaction"

const TYPE_BYTE = parse(byteSchema, "0x4")

export function encode_transaction_unsigned(
  _tx: Transaction7702Unsigned,
): Uint8Array {
  const tx = parse(transaction7702UnsignedSchema, _tx)
  return prefix_type(rlp_encode(encode_body(tx)))
}

export function encode_transaction_signed(
  _tx: Transaction7702Signed,
): Uint8Array {
  const tx = parse(transaction7702SignedSchema, _tx)
  const body = encode_body(tx)
  body.push(BigInt(tx.yParity), BigInt(tx.r), BigInt(tx.s))
  return prefix_type(rlp_encode(body))
}

export function decode_transaction_unsigned(
  bytes: Uint8Array,
): Transaction7702Unsigned {
  const items = decode_envelope(bytes)
  if (items.length !== 10) {
    throw new Error(
      `decode_transaction_unsigned: expected 10 fields, got ${items.length}`,
    )
  }
  return parse(transaction7702UnsignedSchema, {
    type: TYPE_BYTE,
    ...decode_body(items),
  })
}

export function decode_transaction_signed(
  bytes: Uint8Array,
): Transaction7702Signed {
  const items = decode_envelope(bytes)
  if (items.length !== 13) {
    throw new Error(
      `decode_transaction_signed: expected 13 fields, got ${items.length}`,
    )
  }
  return parse(transaction7702SignedSchema, {
    type: TYPE_BYTE,
    ...decode_body(items),
    yParity: parse(
      uintSchema,
      bytes_to_uint(expect_bytes(items[10])),
    ),
    r: parse(
      uintSchema,
      bytes_to_uint(expect_bytes(items[11])),
    ),
    s: parse(
      uintSchema,
      bytes_to_uint(expect_bytes(items[12])),
    ),
  })
}

function encode_body(
  tx: Transaction7702Unsigned,
): RlpInput[] {
  return [
    BigInt(tx.chainId),
    BigInt(tx.nonce),
    BigInt(tx.maxPriorityFeePerGas),
    BigInt(tx.maxFeePerGas),
    BigInt(tx.gas),
    hex_to_bytes(tx.to),
    BigInt(tx.value),
    hex_to_bytes(tx.input),
    encode_access_list(tx.accessList),
    encode_authorization_list(tx.authorizationList),
  ]
}

function encode_access_list(list: AccessList): RlpInput[] {
  return list.map((entry) => [
    hex_to_bytes(entry.address),
    entry.storageKeys.map(hex_to_bytes),
  ])
}

function encode_authorization_list(
  list: AuthorizationList,
): RlpInput[] {
  return list.map((auth: AuthorizationSigned) => [
    BigInt(auth.chainId),
    hex_to_bytes(auth.address),
    BigInt(auth.nonce),
    BigInt(auth.yParity),
    BigInt(auth.r),
    BigInt(auth.s),
  ])
}

function prefix_type(encoded: Uint8Array): Uint8Array {
  const out = new Uint8Array(encoded.length + 1)
  out[0] = SET_CODE_TX_TYPE
  out.set(encoded, 1)
  return out
}

function decode_envelope(bytes: Uint8Array): RlpDecoded[] {
  if (bytes.length === 0 || bytes[0] !== SET_CODE_TX_TYPE) {
    throw new Error(
      "decode_transaction: expected 0x04 type prefix",
    )
  }
  const body = rlp_decode(bytes.subarray(1))
  return expect_list(body)
}

function decode_body(items: RlpDecoded[]): {
  chainId: Uint
  nonce: Uint
  maxPriorityFeePerGas: Uint
  maxFeePerGas: Uint
  gas: Uint
  to: Address
  value: Uint
  input: Bytes
  accessList: AccessList
  authorizationList: AuthorizationList
} {
  return {
    chainId: parse(
      uintSchema,
      bytes_to_uint(expect_bytes(items[0])),
    ),
    nonce: parse(
      uintSchema,
      bytes_to_uint(expect_bytes(items[1])),
    ),
    maxPriorityFeePerGas: parse(
      uintSchema,
      bytes_to_uint(expect_bytes(items[2])),
    ),
    maxFeePerGas: parse(
      uintSchema,
      bytes_to_uint(expect_bytes(items[3])),
    ),
    gas: parse(
      uintSchema,
      bytes_to_uint(expect_bytes(items[4])),
    ),
    to: parse(
      addressSchema,
      bytes_to_hex(expect_bytes(items[5])),
    ),
    value: parse(
      uintSchema,
      bytes_to_uint(expect_bytes(items[6])),
    ),
    input: parse(
      bytesSchema,
      bytes_to_hex(expect_bytes(items[7])),
    ),
    accessList: decode_access_list(expect_list(items[8])),
    authorizationList: decode_authorization_list(
      expect_list(items[9]),
    ),
  }
}

function decode_access_list(
  list: RlpDecoded[],
): AccessList {
  return list.map((entry): AccessListEntry => {
    const tuple = expect_list(entry)
    if (tuple.length !== 2) {
      throw new Error(
        "decode_access_list: each entry must be a 2-tuple",
      )
    }
    return {
      address: parse(
        addressSchema,
        bytes_to_hex(expect_bytes(tuple[0])),
      ),
      storageKeys: expect_list(tuple[1]).map((key) =>
        parse(
          hash32Schema,
          bytes_to_hex(expect_bytes(key)),
        ),
      ),
    }
  })
}

function decode_authorization_list(
  list: RlpDecoded[],
): AuthorizationList {
  return list.map((entry): AuthorizationSigned => {
    const tuple = expect_list(entry)
    if (tuple.length !== 6) {
      throw new Error(
        "decode_authorization_list: each entry must be a 6-tuple",
      )
    }
    return {
      chainId: parse(
        uintSchema,
        bytes_to_uint(expect_bytes(tuple[0])),
      ),
      address: parse(
        addressSchema,
        bytes_to_hex(expect_bytes(tuple[1])),
      ),
      nonce: parse(
        uintSchema,
        bytes_to_uint(expect_bytes(tuple[2])),
      ),
      yParity: parse(
        uintSchema,
        bytes_to_uint(expect_bytes(tuple[3])),
      ),
      r: parse(
        uintSchema,
        bytes_to_uint(expect_bytes(tuple[4])),
      ),
      s: parse(
        uintSchema,
        bytes_to_uint(expect_bytes(tuple[5])),
      ),
    }
  })
}

function expect_bytes(
  value: RlpDecoded | undefined,
): Uint8Array {
  if (!(value instanceof Uint8Array)) {
    throw new Error(
      "decode_transaction: expected bytes, got list",
    )
  }
  return value
}

function expect_list(
  value: RlpDecoded | undefined,
): RlpDecoded[] {
  if (!Array.isArray(value)) {
    throw new Error(
      "decode_transaction: expected list, got bytes",
    )
  }
  return value
}
