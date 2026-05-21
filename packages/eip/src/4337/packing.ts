// https://eips.ethereum.org/EIPS/eip-4337
// v0.7 packing rules — see EntryPoint.sol#UserOperationLib.

import type {
  Address,
  Bytes,
  Bytes32,
  Uint,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"

import type {
  PackedUserOperation,
  UserOperation,
} from "./types"

const ZERO_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as Bytes32
const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000" as Address

function pack_uint128(value: bigint): Uint8Array {
  if (value < 0n || value >= 1n << 128n) {
    throw new Error(
      `uint128 out of range: ${value.toString()}`,
    )
  }
  const out = new Uint8Array(16)
  let v = value
  for (let i = 15; i >= 0; i--) {
    out[i] = Number(v & 0xffn)
    v >>= 8n
  }
  return out
}

function to_bigint(hex: Uint): bigint {
  return BigInt(hex)
}

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

export function pack_account_gas_limits(
  verificationGasLimit: Uint,
  callGasLimit: Uint,
): Bytes32 {
  const packed = concat(
    pack_uint128(to_bigint(verificationGasLimit)),
    pack_uint128(to_bigint(callGasLimit)),
  )
  return bytes_to_hex(packed) as Bytes32
}

export function pack_gas_fees(
  maxPriorityFeePerGas: Uint,
  maxFeePerGas: Uint,
): Bytes32 {
  const packed = concat(
    pack_uint128(to_bigint(maxPriorityFeePerGas)),
    pack_uint128(to_bigint(maxFeePerGas)),
  )
  return bytes_to_hex(packed) as Bytes32
}

export function pack_init_code(
  factory?: Address,
  factoryData?: Bytes,
): Bytes {
  if (!factory || factory === ZERO_ADDRESS) {
    return "0x" as Bytes
  }
  const data = factoryData ?? ("0x" as Bytes)
  const bytes = concat(
    hex_to_bytes(factory),
    hex_to_bytes(data),
  )
  return bytes_to_hex(bytes) as Bytes
}

export function pack_paymaster_and_data(input: {
  paymaster?: Address
  paymasterVerificationGasLimit?: Uint
  paymasterPostOpGasLimit?: Uint
  paymasterData?: Bytes
}): Bytes {
  if (
    !input.paymaster ||
    input.paymaster === ZERO_ADDRESS
  ) {
    return "0x" as Bytes
  }
  const verification = pack_uint128(
    to_bigint(
      input.paymasterVerificationGasLimit ??
        ("0x0" as Uint),
    ),
  )
  const post_op = pack_uint128(
    to_bigint(
      input.paymasterPostOpGasLimit ?? ("0x0" as Uint),
    ),
  )
  const data = input.paymasterData ?? ("0x" as Bytes)
  return bytes_to_hex(
    concat(
      hex_to_bytes(input.paymaster),
      verification,
      post_op,
      hex_to_bytes(data),
    ),
  ) as Bytes
}

export function pack_user_operation(
  op: UserOperation,
): PackedUserOperation {
  return {
    sender: op.sender,
    nonce: op.nonce,
    initCode: pack_init_code(op.factory, op.factoryData),
    callData: op.callData,
    accountGasLimits: pack_account_gas_limits(
      op.verificationGasLimit,
      op.callGasLimit,
    ),
    preVerificationGas: op.preVerificationGas,
    gasFees: pack_gas_fees(
      op.maxPriorityFeePerGas,
      op.maxFeePerGas,
    ),
    paymasterAndData: pack_paymaster_and_data({
      paymaster: op.paymaster,
      paymasterVerificationGasLimit:
        op.paymasterVerificationGasLimit,
      paymasterPostOpGasLimit: op.paymasterPostOpGasLimit,
      paymasterData: op.paymasterData,
    }),
    signature: op.signature,
  }
}

export function unpack_uint128_pair(packed: Bytes32): {
  hi: Uint
  lo: Uint
} {
  if (packed === ZERO_BYTES32) {
    return { hi: "0x0" as Uint, lo: "0x0" as Uint }
  }
  const bytes = hex_to_bytes(packed)
  if (bytes.length !== 32) {
    throw new Error(
      `expected 32 bytes, got ${bytes.length}`,
    )
  }
  return {
    hi: bytes_to_hex(bytes.slice(0, 16)) as Uint,
    lo: bytes_to_hex(bytes.slice(16, 32)) as Uint,
  }
}
