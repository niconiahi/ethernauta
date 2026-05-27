// https://eips.ethereum.org/EIPS/eip-1559
// Wire codec for type-2 (1559) transactions. Bridges the JSON-RPC /
// 1193 shape (`transaction-unsigned.ts`) and the bytes
// `eth_sendRawTransaction` and OP-stack `GasPriceOracle.getL1Fee`
// accept. The schema is the single source of truth — RLP only
// enters this file.

import {
  type AccessList,
  type AccessListEntry,
} from "@ethernauta/eip/2930"
import {
  hex_to_bytes,
  type RlpInput,
  rlp_encode,
} from "@ethernauta/utils"
import { parse } from "valibot"

import {
  type Transaction1559Unsigned,
  transaction1559UnsignedSchema,
} from "./transaction-unsigned"

const TX_TYPE_PREFIX = 0x02

export function encode_transaction_unsigned(
  _tx: Transaction1559Unsigned,
): Uint8Array {
  const tx = parse(transaction1559UnsignedSchema, _tx)
  return prefix_type(rlp_encode(encode_body(tx)))
}

function encode_body(
  tx: Transaction1559Unsigned,
): RlpInput[] {
  return [
    BigInt(tx.chainId),
    BigInt(tx.nonce),
    BigInt(tx.maxPriorityFeePerGas),
    BigInt(tx.maxFeePerGas),
    BigInt(tx.gas),
    tx.to === null
      ? new Uint8Array(0)
      : hex_to_bytes(tx.to),
    BigInt(tx.value),
    hex_to_bytes(tx.input),
    encode_access_list(tx.accessList),
  ]
}

function encode_access_list(
  list: AccessList,
): RlpInput[] {
  return list.map((entry: AccessListEntry) => [
    hex_to_bytes(entry.address),
    entry.storageKeys.map(hex_to_bytes),
  ])
}

function prefix_type(encoded: Uint8Array): Uint8Array {
  const out = new Uint8Array(encoded.length + 1)
  out[0] = TX_TYPE_PREFIX
  out.set(encoded, 1)
  return out
}
