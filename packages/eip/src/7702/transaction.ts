// https://eips.ethereum.org/EIPS/eip-7702
// Type-4 (SetCode) transaction:
//
//   0x04 || rlp([
//     chain_id, nonce, max_priority_fee_per_gas,
//     max_fee_per_gas, gas_limit, to, value, data,
//     access_list, authorization_list,
//     y_parity, r, s
//   ])

import {
  hex_to_bytes,
  type RlpInput,
  rlp_encode,
} from "@ethernauta/utils"
import type {
  AuthorizationList,
  AuthorizationSigned,
} from "./authorization"
import { SET_CODE_TX_TYPE } from "./authorization"

export type AccessListItem = {
  address: `0x${string}`
  storageKeys: `0x${string}`[]
}

export type SetCodeTransactionUnsigned = {
  chainId: bigint
  nonce: bigint
  maxPriorityFeePerGas: bigint
  maxFeePerGas: bigint
  gasLimit: bigint
  to: `0x${string}`
  value: bigint
  data: Uint8Array
  accessList: AccessListItem[]
  authorizationList: AuthorizationList
}

export type SetCodeTransactionSigned =
  SetCodeTransactionUnsigned & {
    yParity: bigint
    r: bigint
    s: bigint
  }

function encode_access_list(
  list: AccessListItem[],
): RlpInput[] {
  return list.map((item) => [
    hex_to_bytes(item.address),
    item.storageKeys.map(hex_to_bytes),
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

function encode_body(
  tx: SetCodeTransactionUnsigned,
): RlpInput[] {
  return [
    tx.chainId,
    tx.nonce,
    tx.maxPriorityFeePerGas,
    tx.maxFeePerGas,
    tx.gasLimit,
    hex_to_bytes(tx.to),
    tx.value,
    tx.data,
    encode_access_list(tx.accessList),
    encode_authorization_list(tx.authorizationList),
  ]
}

function prefix_type(encoded: Uint8Array): Uint8Array {
  const out = new Uint8Array(encoded.length + 1)
  out[0] = SET_CODE_TX_TYPE
  out.set(encoded, 1)
  return out
}

export function encode_set_code_unsigned(
  tx: SetCodeTransactionUnsigned,
): Uint8Array {
  return prefix_type(rlp_encode(encode_body(tx)))
}

export function encode_set_code_signed(
  tx: SetCodeTransactionSigned,
): Uint8Array {
  const body = encode_body(tx)
  body.push(tx.yParity, tx.r, tx.s)
  return prefix_type(rlp_encode(body))
}
