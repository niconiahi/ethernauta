import {
  address,
  encode_function_call,
  string_,
} from "@ethernauta/abi"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import {
  type Address,
  AddressSchema,
  UintSchema,
} from "@ethernauta/core"
import type {
  HDKey,
  RecoveredSignature,
} from "@ethernauta/crypto"
import { keccak_256, sign_digest } from "@ethernauta/crypto"
import {
  encode_rlp,
  eth_getTransactionCount,
  GenericTransactionSchema,
} from "@ethernauta/eth"
import type { ResolvedReader } from "@ethernauta/transport"
import { hex_to_bytes } from "@ethernauta/utils"
import {
  array,
  bigint,
  custom,
  type InferOutput,
  object,
  parse,
  string,
  tuple,
} from "valibot"
import { get_private_key, hex_to_big } from "./crypto"
import type { Transaction } from "./transaction"

export const AccessListItemSchema = object({
  address: AddressSchema,
  storage_keys: array(string()),
})
export type AccessListItem = InferOutput<
  typeof AccessListItemSchema
>

// Post-parse tightening of `GenericTransactionSchema` for the
// `eth_signTransaction` boundary: `to` is required (a Signable
// can't broadcast to "no address" — that's `eth_sendTransaction`
// contract-deployment territory, which Ethernauta routes via
// EIP-1014's deploy flow, not this signer).
const SignableTransactionSchema = object({
  ...GenericTransactionSchema.entries,
  to: AddressSchema,
})

export const Eip1559TransactionUnsignedSchema = object({
  chain_id: bigint(),
  nonce: bigint(),
  max_priority_fee_per_gas: bigint(),
  max_fee_per_gas: bigint(),
  gas_limit: bigint(),
  to: AddressSchema,
  value: bigint(),
  data: custom<Uint8Array>(
    (value) => value instanceof Uint8Array,
  ),
  access_list: array(AccessListItemSchema),
})
export type Eip1559TransactionUnsigned = InferOutput<
  typeof Eip1559TransactionUnsignedSchema
>

export type Eip1559TransactionSigned =
  Eip1559TransactionUnsigned & {
    y_parity: bigint
    r: bigint
    s: bigint
  }
type EncodedAccessListItem = [Uint8Array, Uint8Array[]]
type EncodedAccessList = EncodedAccessListItem[]
type Field = Uint8Array<ArrayBufferLike> | EncodedAccessList

export function big_to_bytes(
  big: bigint,
): Uint8Array<ArrayBufferLike> {
  if (big === 0n) {
    return new Uint8Array([])
  }
  const hex = big.toString(16)
  const padded_hex = hex.padStart(
    hex.length + (hex.length % 2),
    "0",
  )
  return hex_to_bytes(padded_hex)
}

export function compose_y_parity(
  recovery_id: number,
): bigint {
  return BigInt(recovery_id)
}

export async function get_nonce(
  address: Address,
  resolved: ResolvedReader,
): Promise<bigint> {
  const readable = eth_getTransactionCount([
    address,
    "latest",
  ])
  const transaction_count = await readable(resolved)
  return hex_to_big(transaction_count)
}

function get_chain_id(): bigint {
  return BigInt(eip155_11155111.chainId) // Sepolia chain ID
}

function get_gas_limit(): bigint {
  // testnet: ceiling. unused gas is refunded under EIP-1559.
  // revisit once eth_estimateGas is wired through the wallet.
  return 1_000_000n
}

function get_access_list(): AccessListItem[] {
  return [] // empty access list
}

function get_max_fee_per_gas(): bigint {
  return 20_000_000_000n // 20 gwei
}

function get_max_priority_fee_per_gas(): bigint {
  return 2_000_000_000n // 2 gwei
}

function get_fields_from_transaction(
  method: Transaction["method"],
  params: Transaction["params"],
  to?: string,
): {
  to: Address
  data: Uint8Array<ArrayBufferLike>
  value: bigint
} {
  switch (method) {
    case "eth_signTransaction": {
      const raw = Array.isArray(params)
        ? params[0]
        : params.transaction
      const tx = parse(SignableTransactionSchema, raw)
      const value_hex = tx.value ?? "0x0"
      const input_hex = tx.input ?? "0x"
      const data =
        input_hex === "0x"
          ? new Uint8Array([])
          : hex_to_bytes(input_hex)
      return {
        to: tx.to,
        value: hex_to_big(value_hex),
        data,
      }
    }
    case "transfer": {
      const [transfer_to, value_hex] = parse(
        tuple([AddressSchema, UintSchema]),
        params,
      )
      return {
        to: transfer_to,
        value: hex_to_big(value_hex),
        data: new Uint8Array([]),
      }
    }
    case "safeMint": {
      const contract = parse(AddressSchema, to)
      const [nft_recipient, uri] = parse(
        tuple([AddressSchema, string()]),
        params,
      )
      return {
        to: contract,
        value: 0n,
        data: encode_function_call({
          name: "safeMint",
          args: [address(), string_()] as const,
          values: [nft_recipient, uri],
        }),
      }
    }
  }
  throw new Error(
    `there is no support for the sent ${method} method`,
  )
}

export async function sign_transaction({
  key,
  nonce,
  method,
  params,
  to,
}: {
  key: HDKey
  nonce: bigint
  method: Transaction["method"]
  params: Transaction["params"]
  to?: string
}) {
  const {
    to: resolved_to,
    value,
    data,
  } = get_fields_from_transaction(method, params, to)
  const transaction: Eip1559TransactionUnsigned = {
    to: resolved_to,
    data,
    value,
    nonce,
    chain_id: get_chain_id(),
    gas_limit: get_gas_limit(),
    access_list: get_access_list(),
    max_fee_per_gas: get_max_fee_per_gas(),
    max_priority_fee_per_gas:
      get_max_priority_fee_per_gas(),
  }
  const private_key = get_private_key(key)
  const encoded = encode_eip155_transaction_unsigned(
    transaction,
    private_key,
  )
  return encoded
}

export function make_transaction_hash(
  type_prefix: Uint8Array,
  encoded_fields: Uint8Array<ArrayBufferLike>,
) {
  const message_to_sign = concat_bytes(
    type_prefix,
    encoded_fields,
  )
  return keccak_256(message_to_sign)
}

export function encode_eip155_transaction_unsigned(
  transaction: Eip1559TransactionUnsigned,
  private_key: Uint8Array,
): Uint8Array<ArrayBufferLike> {
  // step 1: prepare transaction fields in EIP-1559 order
  const unsigned_fields = make_unsigned_fields(transaction)
  // step 2: RLP encode the unsigned transaction
  const encoded_unsigned_fields =
    encode_fields(unsigned_fields)
  // step 3: compute message hash with type prefix (0x02 for EIP-1559)
  const type_prefix = new Uint8Array([0x02])
  const transaction_hash = make_transaction_hash(
    type_prefix,
    encoded_unsigned_fields,
  )
  // step 4: sign with ECDSA (secp256k1)
  const signature = sign_digest(
    transaction_hash,
    private_key,
  )
  // step 5: add signature fields to create complete signed transaction
  const signed_fields = make_signed_fields(
    unsigned_fields,
    signature,
  )
  // step 6: RLP encode the signed transaction
  const encoded_signed_fields = encode_fields(signed_fields)
  // step 7: prepend type byte to create final raw transaction
  return concat_bytes(type_prefix, encoded_signed_fields)
}

export function concat_bytes(
  ...arrays: Uint8Array[]
): Uint8Array<ArrayBufferLike> {
  let total_length = 0
  for (const arr of arrays) {
    total_length += arr.length
  }
  const result = new Uint8Array(total_length)
  let offset = 0
  for (const arr of arrays) {
    result.set(arr, offset)
    offset += arr.length
  }
  return result
}

export function encode_access_list(
  access_list: AccessListItem[],
): EncodedAccessList {
  return access_list.map((item) => [
    hex_to_bytes(item.address),
    item.storage_keys.map((storage_key) =>
      hex_to_bytes(storage_key),
    ),
  ])
}

// EIP-1559 unsigned transaction has exactly 9 RLP fields per
// the spec; `make_signed_fields` appends y_parity + r + s for the
// 12-field signed form. Expressing the count in the tuple type
// (instead of `Field[]` + a runtime invariant) makes the precondition
// statically enforced — TS narrows each index without an explicit
// guard.
export type UnsignedFields = [
  Field,
  Field,
  Field,
  Field,
  Field,
  Field,
  Field,
  Field,
  Field,
]

export function make_signed_fields(
  unsigned_fields: UnsignedFields,
  signature: RecoveredSignature,
): Field[] {
  const y_parity = compose_y_parity(signature.recovery)
  return [
    ...unsigned_fields,
    big_to_bytes(y_parity),
    big_to_bytes(signature.r),
    big_to_bytes(signature.s),
  ]
}

export function make_unsigned_fields(
  transaction: Eip1559TransactionUnsigned,
): UnsignedFields {
  return [
    big_to_bytes(transaction.chain_id),
    big_to_bytes(transaction.nonce),
    big_to_bytes(transaction.max_priority_fee_per_gas),
    big_to_bytes(transaction.max_fee_per_gas),
    big_to_bytes(transaction.gas_limit),
    hex_to_bytes(transaction.to),
    big_to_bytes(transaction.value),
    transaction.data,
    encode_access_list([]),
  ]
}

export function encode_fields(fields: Field[]) {
  return encode_rlp(fields)
}
