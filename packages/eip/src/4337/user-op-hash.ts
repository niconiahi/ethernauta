// https://eips.ethereum.org/EIPS/eip-4337
// EntryPoint v0.7 getUserOpHash derivation. The on-chain
// EntryPoint computes:
//
//   inner   = keccak256(abi.encode(
//               sender, nonce,
//               keccak256(initCode), keccak256(callData),
//               accountGasLimits, preVerificationGas, gasFees,
//               keccak256(paymasterAndData)
//             ))
//   userOpHash = keccak256(abi.encode(inner, entryPoint, chainId))
//
// The signature field is excluded — the userOpHash is what
// the account signs over.

import type {
  Address,
  Bytes,
  Hash32,
  Uint,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"

import { pack_user_operation } from "./packing"
import type {
  PackedUserOperation,
  UserOperation,
} from "./types"

function concat(...arrays: Uint8Array[]): Uint8Array {
  let total = 0
  for (const a of arrays) total += a.length
  const out = new Uint8Array(total)
  let pos = 0
  for (const a of arrays) {
    out.set(a, pos)
    pos += a.length
  }
  return out
}

function pad32(input: Uint8Array): Uint8Array {
  if (input.length === 32) return input
  if (input.length > 32) {
    throw new Error(
      `pad32: input exceeds 32 bytes (${input.length})`,
    )
  }
  const out = new Uint8Array(32)
  out.set(input, 32 - input.length)
  return out
}

function uint_to_32(value: Uint | bigint): Uint8Array {
  const v =
    typeof value === "bigint" ? value : BigInt(value)
  const out = new Uint8Array(32)
  let n = v
  for (let i = 31; i >= 0; i--) {
    out[i] = Number(n & 0xffn)
    n >>= 8n
  }
  return out
}

function bytes32_to_32(value: Hash32 | string): Uint8Array {
  const bytes = hex_to_bytes(value as `0x${string}`)
  if (bytes.length !== 32) {
    throw new Error(
      `bytes32_to_32: expected 32, got ${bytes.length}`,
    )
  }
  return bytes
}

function address_to_32(value: Address): Uint8Array {
  return pad32(hex_to_bytes(value))
}

function keccak_bytes(value: Bytes | string): Uint8Array {
  return keccak_256(hex_to_bytes(value as `0x${string}`))
}

export function inner_user_op_hash(
  op: PackedUserOperation,
): Hash32 {
  const encoded = concat(
    address_to_32(op.sender),
    uint_to_32(op.nonce),
    keccak_bytes(op.initCode),
    keccak_bytes(op.callData),
    bytes32_to_32(op.accountGasLimits),
    uint_to_32(op.preVerificationGas),
    bytes32_to_32(op.gasFees),
    keccak_bytes(op.paymasterAndData),
  )
  return bytes_to_hex(keccak_256(encoded)) as Hash32
}

export function get_user_op_hash({
  op,
  entryPoint,
  chainId,
}: {
  op: PackedUserOperation | UserOperation
  entryPoint: Address
  chainId: Uint | bigint
}): Hash32 {
  const packed =
    "accountGasLimits" in op ? op : pack_user_operation(op)
  const inner = inner_user_op_hash(packed)
  const encoded = concat(
    bytes32_to_32(inner),
    address_to_32(entryPoint),
    uint_to_32(chainId),
  )
  return bytes_to_hex(keccak_256(encoded)) as Hash32
}
