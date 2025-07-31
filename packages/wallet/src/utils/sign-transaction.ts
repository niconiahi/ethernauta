import { encode } from "./rlp"
import { keccak_256 } from "@noble/hashes/sha3"
import { hex_to_bytes } from "./hex"
import invariant from "./tiny-invariant"
import * as secp from "@noble/secp256k1"
import { hmac } from "@noble/hashes/hmac"
import { sha256 } from "@noble/hashes/sha256"
import { wallet } from "./wallet"
import {
  get_private_key,
  hex_to_big,
  number_to_hex,
} from "./crypto"
import { eip155_11155111 } from "@cryptoman/chain"
import { eth_getTransactionCount } from "@cryptoman/eth"
import {
  http,
  createReader,
  encodeChainId,
  type Reader,
  type ChainId,
} from "@cryptoman/transport"
import type { Transaction } from "./transaction"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://little-bitter-wave.ethereum-sepolia.quiknode.pro/4d40a4c7ec139649d4b1f43f5d536c3756faacc9/"
const sepolia_chain_id = encodeChainId({
  namespace: NAMESPACE.ETHEREUM,
  reference: eip155_11155111.chainId,
})
const reader = createReader([
  {
    chainId: sepolia_chain_id,
    transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
  },
])

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

export function sign_transaction_hash(
  hash: Uint8Array<ArrayBufferLike>,
  private_key: Uint8Array,
): secp.RecoveredSignature {
  secp.etc.hmacSha256Sync = (k, ...m) =>
    hmac(sha256, k, secp.etc.concatBytes(...m))
  return secp.sign(hash, private_key)
}

export function compose_y_parity(
  recovery_id: number,
): bigint {
  return BigInt(recovery_id)
}

function get_to(params: Transaction["params"]): string {
  if (params.length > 0) {
    const tx_params = params[0] as any
    if (tx_params?.to) return tx_params.to
  }
  return "0x0000000000000000000000000000000000000000" // placeholder recipient
}

function get_data(
  method: Transaction["method"],
  params: Transaction["params"],
): Uint8Array<ArrayBuffer> {
  if (
    method === "eth_sendTransaction" &&
    params.length > 0
  ) {
    const tx_params = params[0] as any
    if (tx_params?.data) {
      return hex_to_bytes(
        tx_params.data.startsWith("0x")
          ? tx_params.data.slice(2)
          : tx_params.data,
      ) as Uint8Array<ArrayBuffer>
    }
  }
  return new Uint8Array([]) as Uint8Array<ArrayBuffer> // empty data for simple transfers
}

function get_value(
  method: Transaction["method"],
  params: Transaction["params"],
): bigint {
  if (
    method === "eth_sendTransaction" &&
    params.length > 0
  ) {
    const tx_params = params[0] as any
    if (tx_params?.value) {
      return typeof tx_params.value === "string"
        ? hex_to_big(tx_params.value)
        : BigInt(tx_params.value)
    }
  }
  return 0n // 0 ETH
}

async function get_nonce(
  address: `0x${string}`,
  reader: Reader,
  chain_id: ChainId,
): Promise<bigint> {
  console.log("address", address)
  const readable = eth_getTransactionCount([
    address,
    number_to_hex(8870407),
  ])
  const transaction_count = await readable(reader(chain_id))
  return hex_to_big(transaction_count)
}

function get_chain_id(): bigint {
  return BigInt(eip155_11155111.chainId) // Sepolia chain ID
}

function get_gas_limit(
  method: Transaction["method"],
  params: Transaction["params"],
): bigint {
  if (
    method === "eth_sendTransaction" &&
    params.length > 0
  ) {
    const tx_params = params[0] as any
    if (tx_params?.gas) {
      return typeof tx_params.gas === "string"
        ? hex_to_big(tx_params.gas)
        : BigInt(tx_params.gas)
    }
  }
  return 21000n // standard gas limit for ETH transfer
}

function get_access_list(
  method: Transaction["method"],
  params: Transaction["params"],
): AccessListItem[] {
  if (
    method === "eth_sendTransaction" &&
    params.length > 0
  ) {
    const tx_params = params[0] as any
    if (tx_params?.accessList) return tx_params.accessList
  }
  return [] // empty access list
}

function get_max_fee_per_gas(): bigint {
  return 20_000_000_000n // 20 gwei
}

function get_max_priority_fee_per_gas(): bigint {
  return 2_000_000_000n // 2 gwei
}

export async function sign_transaction(
  method: Transaction["method"],
  params: Transaction["params"],
) {
  const address = wallet.value.address as `0x${string}`
  console.log("address", address)
  const transaction: Eip1559TransactionUnsigned = {
    to: get_to(params),
    data: get_data(method, params),
    value: get_value(method, params),
    nonce: await get_nonce(
      address,
      reader,
      sepolia_chain_id,
    ),
    chain_id: get_chain_id(),
    gas_limit: get_gas_limit(method, params),
    access_list: get_access_list(method, params),
    max_fee_per_gas: get_max_fee_per_gas(),
    max_priority_fee_per_gas:
      get_max_priority_fee_per_gas(),
  }
  console.log("transaction", transaction)
  const private_key = get_private_key(wallet.value.key)
  console.log("private_key", private_key)
  const encoded = encode_eip155_transaction_unsigned(
    transaction,
    private_key,
  )
  // const encoded = new Uint8Array(32).fill(1)
  console.log("encoded", encoded)
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
  console.log("unsigned_fields", unsigned_fields)
  // step 2: RLP encode the unsigned transaction
  const encoded_unsigned_fields =
    encode_fields(unsigned_fields)
  console.log(
    "encoded_unsigned_fields",
    encoded_unsigned_fields,
  )
  // step 3: compute message hash with type prefix (0x02 for EIP-1559)
  const type_prefix = new Uint8Array([0x02])
  console.log("type_prefix", type_prefix)
  const transaction_hash = make_transaction_hash(
    type_prefix,
    encoded_unsigned_fields,
  )
  console.log("transaction_hash", transaction_hash)
  // step 4: sign with ECDSA (secp256k1)
  const signature = sign_transaction_hash(
    transaction_hash,
    private_key,
  )
  console.log("signature", signature)
  // step 5: add signature fields to create complete signed transaction
  const signed_fields = make_signed_fields(
    unsigned_fields,
    signature,
  )
  console.log("signed_fields", signed_fields)
  // step 6: RLP encode the signed transaction
  const encoded_signed_fields = encode_fields(signed_fields)
  console.log(
    "encoded_signed_fields",
    encoded_signed_fields,
  )
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
