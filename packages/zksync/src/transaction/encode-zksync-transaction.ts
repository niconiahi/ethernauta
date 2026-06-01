// https://docs.zksync.io/zksync-protocol/rollup/transaction-lifecycle#eip-712-0x71-transactions
// 0x71 envelope encoder and the typed-data builder that feeds
// it. The envelope is `0x71 ‖ rlp([16 fields])`; the digest is
// EIP-712 over the `Transaction` struct from `eip-712-domain.ts`.
//
// `factoryDeps` lives in two forms inside the same transaction:
// `bytes32[]` of zkSync `BytecodeHash`-flavoured digests inside
// the EIP-712 message, and raw bytecodes inside the RLP envelope.
// Callers always pass raw bytecodes; `build_zksync_typed_data`
// hashes them, `encode_zksync_transaction` inlines them.

import {
  type Address,
  AddressSchema,
  type Bytes,
  BytesSchema,
} from "@ethernauta/core"
import {
  hash_typed_data,
  type TypedData,
} from "@ethernauta/eip/712"
import { encode_rlp } from "@ethernauta/eth"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { sha256 } from "@noble/hashes/sha2"
import {
  array,
  bigint,
  type InferOutput,
  number,
  object,
  optional,
  parse,
} from "valibot"

import {
  build_zksync_domain,
  ZKSYNC_TX_TYPE,
  ZKSYNC_TYPED_DATA_TYPES,
} from "./eip-712-domain"

const ZERO_ADDRESS: Address = parse(
  AddressSchema,
  "0x0000000000000000000000000000000000000000",
)

const EMPTY_BYTES: Bytes = parse(BytesSchema, "0x")

export const ZksyncTransactionRequestSchema = object({
  chain_id: bigint(),
  nonce: bigint(),
  from: AddressSchema,
  to: AddressSchema,
  gas_limit: bigint(),
  gas_per_pubdata_byte_limit: bigint(),
  max_fee_per_gas: bigint(),
  max_priority_fee_per_gas: bigint(),
  value: bigint(),
  data: BytesSchema,
  paymaster: optional(AddressSchema),
  paymaster_input: optional(BytesSchema),
  factory_deps: optional(array(BytesSchema)),
  custom_signature: optional(BytesSchema),
})
export type ZksyncTransactionRequest = InferOutput<
  typeof ZksyncTransactionRequestSchema
>

export const ZksyncTransactionSignatureSchema = object({
  r: bigint(),
  s: bigint(),
  recovery: number(),
})
export type ZksyncTransactionSignature = InferOutput<
  typeof ZksyncTransactionSignatureSchema
>

// zkSync EraVM `BytecodeHash` — sha256 of the raw bytecode with
// the first four bytes overwritten:
//   [0] = 0x01 (version: EraVM contract)
//   [1] = 0x00
//   [2..4] = bytecode length in 32-byte words, big-endian u16
//   [4..32] = sha256 tail
// Bytecode must be a positive multiple of 32 bytes AND have an
// odd number of words (zkSync invariant — even-word bytecodes
// are unrepresentable here).
export function hash_bytecode(
  bytecode: Uint8Array,
): Uint8Array {
  if (bytecode.length === 0) {
    throw new Error("zksync bytecode must be non-empty")
  }
  if (bytecode.length % 32 !== 0) {
    throw new Error(
      `zksync bytecode length must be a multiple of 32, got ${bytecode.length}`,
    )
  }
  const words = bytecode.length / 32
  if (words % 2 === 0) {
    throw new Error(
      `zksync bytecode must have an odd number of 32-byte words, got ${words}`,
    )
  }
  if (words > 0xffff) {
    throw new Error(
      `zksync bytecode is too long (${words} words exceeds u16)`,
    )
  }
  const hash = sha256(bytecode)
  hash[0] = 0x01
  hash[1] = 0x00
  hash[2] = (words >> 8) & 0xff
  hash[3] = words & 0xff
  return hash
}

export function build_zksync_typed_data(
  _request: ZksyncTransactionRequest,
): TypedData {
  const request = parse(
    ZksyncTransactionRequestSchema,
    _request,
  )
  const paymaster = request.paymaster ?? ZERO_ADDRESS
  const paymaster_input =
    request.paymaster_input ?? EMPTY_BYTES
  const factory_deps = request.factory_deps ?? []
  const factory_deps_hashes = factory_deps.map((dep) =>
    bytes_to_hex(hash_bytecode(hex_to_bytes(dep))),
  )
  return {
    domain: build_zksync_domain(request.chain_id),
    types: ZKSYNC_TYPED_DATA_TYPES,
    primaryType: "Transaction",
    message: {
      txType: ZKSYNC_TX_TYPE,
      from: request.from,
      to: request.to,
      gasLimit: request.gas_limit,
      gasPerPubdataByteLimit:
        request.gas_per_pubdata_byte_limit,
      maxFeePerGas: request.max_fee_per_gas,
      maxPriorityFeePerGas:
        request.max_priority_fee_per_gas,
      paymaster,
      nonce: request.nonce,
      value: request.value,
      data: request.data,
      factoryDeps: factory_deps_hashes,
      paymasterInput: paymaster_input,
    },
  }
}

export function hash_zksync_transaction(
  request: ZksyncTransactionRequest,
): Uint8Array {
  return hash_typed_data(build_zksync_typed_data(request))
}

// `0x71 ‖ rlp([16 fields])` — the post-2718 envelope:
//   [ nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit,
//     to, value, data, v, r, s, chainId, from,
//     gasPerPubdataByteLimit, factoryDeps,
//     customSignature, paymasterParams ]
// v is the EIP-2098 parity bit (0/1), not 27/28; r/s are
// big-endian uints. `paymasterParams` is an empty list when no
// paymaster is set, otherwise `[paymaster, paymasterInput]`.
export function encode_zksync_transaction(
  _request: ZksyncTransactionRequest,
  signature: ZksyncTransactionSignature,
): Uint8Array {
  const request = parse(
    ZksyncTransactionRequestSchema,
    _request,
  )
  const paymaster = request.paymaster ?? ZERO_ADDRESS
  const paymaster_input =
    request.paymaster_input ?? EMPTY_BYTES
  const factory_deps = request.factory_deps ?? []
  const custom_signature =
    request.custom_signature ?? EMPTY_BYTES

  const paymaster_params =
    paymaster === ZERO_ADDRESS &&
    paymaster_input === EMPTY_BYTES
      ? []
      : [
          hex_to_bytes(paymaster),
          hex_to_bytes(paymaster_input),
        ]

  const fields = [
    big_to_bytes(request.nonce),
    big_to_bytes(request.max_priority_fee_per_gas),
    big_to_bytes(request.max_fee_per_gas),
    big_to_bytes(request.gas_limit),
    hex_to_bytes(request.to),
    big_to_bytes(request.value),
    hex_to_bytes(request.data),
    big_to_bytes(BigInt(signature.recovery)),
    big_to_bytes(signature.r),
    big_to_bytes(signature.s),
    big_to_bytes(request.chain_id),
    hex_to_bytes(request.from),
    big_to_bytes(request.gas_per_pubdata_byte_limit),
    factory_deps.map((dep) => hex_to_bytes(dep)),
    hex_to_bytes(custom_signature),
    paymaster_params,
  ]

  const rlp = encode_rlp(fields)
  const out = new Uint8Array(1 + rlp.length)
  out[0] = 0x71
  out.set(rlp, 1)
  return out
}

function big_to_bytes(big: bigint): Uint8Array {
  if (big === 0n) return new Uint8Array([])
  const hex = big.toString(16)
  const padded = hex.padStart(
    hex.length + (hex.length % 2),
    "0",
  )
  return hex_to_bytes(padded)
}
