import { hex_to_bytes } from "./hex"

type RLPInput =
  | string
  | number
  | bigint
  | Uint8Array
  | RLPInput[]

export function encode(input: RLPInput): Uint8Array {
  if (Array.isArray(input)) {
    return encode_list(input)
  }
  return encode_item(input)
}

function encode_item(
  item: string | number | bigint | Uint8Array,
): Uint8Array {
  const bytes = to_bytes(item)
  const first_byte = bytes[0]
  if (
    bytes.length === 1 &&
    first_byte !== undefined &&
    first_byte < 0x80
  ) {
    // Single byte < 0x80 encodes as itself
    return bytes
  }
  if (bytes.length <= 55) {
    // Short string: 0x80 + length + data
    const buffer = new Uint8Array(1 + bytes.length)
    buffer[0] = 0x80 + bytes.length
    buffer.set(bytes, 1)
    return buffer
  }
  // Long string: 0xb7 + length_of_length + length + data
  const length_bytes = encode_length(bytes.length)
  const buffer = new Uint8Array(
    1 + length_bytes.length + bytes.length,
  )
  buffer[0] = 0xb7 + length_bytes.length
  buffer.set(length_bytes, 1)
  buffer.set(bytes, 1 + length_bytes.length)
  return buffer
}

function encode_list(list: RLPInput[]): Uint8Array {
  const encoded_items = list.map((item) => encode(item))
  const total_length = encoded_items.reduce(
    (sum, item) => sum + item.length,
    0,
  )
  if (total_length <= 55) {
    // Short list: 0xc0 + length + items
    const result = new Uint8Array(1 + total_length)
    result[0] = 0xc0 + total_length
    let offset = 1
    for (const item of encoded_items) {
      result.set(item, offset)
      offset += item.length
    }
    return result
  }
  // Long list: 0xf7 + length_of_length + length + items
  const length_bytes = encode_length(total_length)
  const result = new Uint8Array(
    1 + length_bytes.length + total_length,
  )
  result[0] = 0xf7 + length_bytes.length
  result.set(length_bytes, 1)
  let offset = 1 + length_bytes.length
  for (const item of encoded_items) {
    result.set(item, offset)
    offset += item.length
  }
  return result
}

function to_bytes(
  input: string | number | bigint | Uint8Array,
): Uint8Array {
  if (input instanceof Uint8Array) return input
  if (typeof input === "string") {
    if (input.startsWith("0x")) {
      return hex_to_bytes(input)
    }
    return new TextEncoder().encode(input)
  }
  if (
    typeof input === "number" ||
    typeof input === "bigint"
  ) {
    return number_to_bytes(BigInt(input))
  }
  throw new Error(`cannot convert ${typeof input} to bytes`)
}

function number_to_bytes(big: bigint): Uint8Array {
  if (big === 0n) return new Uint8Array([])
  const hex = big.toString(16)
  const padded_hex = hex.padStart(
    hex.length + (hex.length % 2),
    "0",
  )
  return hex_to_bytes(padded_hex)
}

function encode_length(length: number): Uint8Array {
  if (length === 0) return new Uint8Array([])
  const bytes: number[] = []
  let temp = length
  while (temp > 0) {
    bytes.unshift(temp & 0xff)
    temp >>= 8
  }
  return new Uint8Array(bytes)
}

interface EIP1559TransactionUnsigned {
  chain_id: bigint
  nonce: bigint
  max_priority_fee_per_gas: bigint
  max_fee_per_gas: bigint
  gas_limit: bigint
  to: string | null
  value: bigint
  data: Uint8Array
  access_list: Array<{
    address: string
    storage_keys: string[]
  }>
}

interface EIP1559TransactionSigned
  extends EIP1559TransactionUnsigned {
  v: bigint
  r: bigint
  s: bigint
}

export function encode_eip_1559_unsigned(
  transaction: EIP1559TransactionUnsigned,
): Uint8Array {
  const access_list_rlp = transaction.access_list.map(
    (item) => [item.address, item.storage_keys],
  )
  const rlp_data: RLPInput[] = [
    transaction.chain_id,
    transaction.nonce,
    transaction.max_priority_fee_per_gas,
    transaction.max_fee_per_gas,
    transaction.gas_limit,
    transaction.to || "",
    transaction.value,
    transaction.data,
    access_list_rlp,
  ]
  const encoded = encode(rlp_data)
  return new Uint8Array([0x02, ...encoded])
}

export function encode_eip_1559_signed(
  transaction: EIP1559TransactionSigned,
): Uint8Array {
  const access_list_rlp = transaction.access_list.map(
    (item) => [item.address, item.storage_keys],
  )
  const rlp_data: RLPInput[] = [
    transaction.chain_id,
    transaction.nonce,
    transaction.max_priority_fee_per_gas,
    transaction.max_fee_per_gas,
    transaction.gas_limit,
    transaction.to || "",
    transaction.value,
    transaction.data,
    access_list_rlp,
    transaction.v,
    transaction.r,
    transaction.s,
  ]
  const encoded = encode(rlp_data)
  return new Uint8Array([0x02, ...encoded])
}
