import {
  address,
  encode_function_call,
  string_,
} from "@ethernauta/abi"
import { eip155_11155111 } from "@ethernauta/chain"
import {
  type Address,
  addressSchema,
  uintSchema,
} from "@ethernauta/core"
import {
  eth_getTransactionCount,
  genericTransactionSchema,
} from "@ethernauta/eth"
import type { ChainId, Reader } from "@ethernauta/transport"
import { hex_to_bytes, invariant } from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import type { RecoveredSignature } from "@noble/secp256k1"
import type { HDKey } from "@scure/bip32"
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
import { sign_digest } from "./ecdsa"
import { encode } from "./rlp"
import type { Transaction } from "./transaction"

export const accessListItemSchema = object({
  address: addressSchema,
  storage_keys: array(string()),
})
export type AccessListItem = InferOutput<
  typeof accessListItemSchema
>

export const eip1559TransactionUnsignedSchema = object({
  chain_id: bigint(),
  nonce: bigint(),
  max_priority_fee_per_gas: bigint(),
  max_fee_per_gas: bigint(),
  gas_limit: bigint(),
  to: addressSchema,
  value: bigint(),
  data: custom<Uint8Array>(
    (value) => value instanceof Uint8Array,
  ),
  access_list: array(accessListItemSchema),
})
export type Eip1559TransactionUnsigned = InferOutput<
  typeof eip1559TransactionUnsignedSchema
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
  address: `0x${string}`,
  reader: Reader,
  chain_id: ChainId,
): Promise<bigint> {
  const readable = eth_getTransactionCount([
    address,
    "latest",
  ])
  const transaction_count = await readable(
    reader({ chain_id }),
  )
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
      const tx = parse(genericTransactionSchema, raw)
      invariant(
        tx.to,
        "eth_signTransaction requires a `to` address",
      )
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
        tuple([addressSchema, uintSchema]),
        params,
      )
      return {
        to: transfer_to,
        value: hex_to_big(value_hex),
        data: new Uint8Array([]),
      }
    }
    case "safeMint": {
      const contract = parse(addressSchema, to)
      const [nft_recipient, uri] = parse(
        tuple([addressSchema, string()]),
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
  const encoded_list = new Array<EncodedAccessListItem>(
    access_list.length,
  )
  for (let i = 0; i < access_list.length; i++) {
    const item = access_list[i]
    invariant(item, "access list item should exist")
    const storage_keys = new Array<Uint8Array>(
      item.storage_keys.length,
    )
    for (let j = 0; j < item.storage_keys.length; j++) {
      const storage_key = item.storage_keys[j]
      invariant(storage_key, "storage key should exist")
      storage_keys[j] = hex_to_bytes(storage_key)
    }
    encoded_list[i] = [
      hex_to_bytes(item.address),
      storage_keys,
    ]
  }
  return encoded_list
}

export function make_signed_fields(
  unsigned_fields: Field[],
  signature: RecoveredSignature,
): Field[] {
  const fields = new Array<Field>(12)
  invariant(
    unsigned_fields[0] &&
      unsigned_fields[1] &&
      unsigned_fields[2] &&
      unsigned_fields[3] &&
      unsigned_fields[4] &&
      unsigned_fields[5] &&
      unsigned_fields[6] &&
      unsigned_fields[7] &&
      unsigned_fields[8],
    "all the required encoded fields must exist",
  )
  fields[0] = unsigned_fields[0]
  fields[1] = unsigned_fields[1]
  fields[2] = unsigned_fields[2]
  fields[3] = unsigned_fields[3]
  fields[4] = unsigned_fields[4]
  fields[5] = unsigned_fields[5]
  fields[6] = unsigned_fields[6]
  fields[7] = unsigned_fields[7]
  fields[8] = unsigned_fields[8]
  const y_parity = compose_y_parity(signature.recovery)
  fields[9] = big_to_bytes(y_parity)
  fields[10] = big_to_bytes(signature.r)
  fields[11] = big_to_bytes(signature.s)
  return fields
}

export function make_unsigned_fields(
  transaction: Eip1559TransactionUnsigned,
): Field[] {
  const fields = new Array<Field>(9)
  fields[0] = big_to_bytes(transaction.chain_id)
  fields[1] = big_to_bytes(transaction.nonce)
  fields[2] = big_to_bytes(
    transaction.max_priority_fee_per_gas,
  )
  fields[3] = big_to_bytes(transaction.max_fee_per_gas)
  fields[4] = big_to_bytes(transaction.gas_limit)
  fields[5] = hex_to_bytes(transaction.to)
  fields[6] = big_to_bytes(transaction.value)
  fields[7] = transaction.data
  fields[8] = encode_access_list([])
  return fields
}

export function encode_fields(fields: Field[]) {
  return encode(fields)
}
