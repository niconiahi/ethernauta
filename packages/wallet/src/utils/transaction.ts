import { signal } from "@preact/signals"
import * as v from "valibot"
import { encode } from "@ethereumjs/rlp"
import { keccak_256 } from "@noble/hashes/sha3"
import { hex_to_bytes } from "./hex"
import invariant from "./tiny-invariant"
import { secp } from "./secp"

export const TransactionSchema = v.object({
  method: v.string(),
  params: v.array(v.unknown()),
})
export const transaction = signal<Transaction>({
  method: "hello_world",
  params: [],
})
type Transaction = v.InferOutput<typeof TransactionSchema>
export interface Eip1559TransactionUnsigned {
  chain_id: bigint
  nonce: bigint
  max_priority_fee_per_gas: bigint
  max_fee_per_gas: bigint
  gas_limit: bigint
  to: string
  value: bigint
  data: Uint8Array
  access_list: AccessListItem[]
}
export interface AccessListItem {
  address: string
  storage_keys: string[]
}
export interface Eip1559TransactionSigned
  extends Eip1559TransactionUnsigned {
  y_parity: bigint
  r: bigint
  s: bigint
}
type EncodedAccessListItem = [Uint8Array, Uint8Array[]]
type EncodedAccessList = EncodedAccessListItem[]
type Field = Uint8Array<ArrayBufferLike> | EncodedAccessList

function strip_hex_prefix(hex: string): string {
  return hex.startsWith("0x") ? hex.substring(2) : hex
}

export function big_to_bytes(big: bigint): Uint8Array {
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

export function sign_transaction(
  hash: Uint8Array<ArrayBufferLike>,
  private_key: Uint8Array,
): secp.RecoveredSignature {
  return secp.sign(hash, private_key)
}

export function compose_y_parity(recovery_id: number) {
  return BigInt(recovery_id)
}

export function encode_eip155_transaction_unsigned(
  transaction: Eip1559TransactionUnsigned,
  private_key: Uint8Array,
) {
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
  const signature = sign_transaction(
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
): Uint8Array {
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
      storage_keys[j] = hex_to_bytes(
        strip_hex_prefix(storage_key),
      )
    }
    encoded_list[i] = [
      hex_to_bytes(strip_hex_prefix(item.address)),
      storage_keys,
    ]
  }
  return encoded_list
}

export function make_signed_fields(
  unsigned_fields: Field[],
  signature: secp.RecoveredSignature,
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
  fields[5] = hex_to_bytes(strip_hex_prefix(transaction.to))
  fields[6] = big_to_bytes(transaction.value)
  fields[7] = transaction.data
  fields[8] = encode_access_list([])
  return fields
}

export function encode_fields(fields: Field[]) {
  return encode(fields)
}
