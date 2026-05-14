import { keccak_256 } from "@noble/hashes/sha3"

export function to_selector(signature: string): Uint8Array {
  return keccak_256(
    new TextEncoder().encode(signature),
  ).slice(0, 4)
}

export function encode_address(
  value: `0x${string}`,
): Uint8Array {
  const result = new Uint8Array(32)
  const hex = value.slice(2)
  for (let i = 0; i < 20; i++) {
    result[12 + i] = Number.parseInt(
      hex.slice(i * 2, i * 2 + 2),
      16,
    )
  }
  return result
}

export function encode_uint256(value: bigint): Uint8Array {
  const result = new Uint8Array(32)
  let v = value
  for (let i = 31; i >= 0; i--) {
    result[i] = Number(v & 0xffn)
    v >>= 8n
  }
  return result
}

export function encode_bool(value: boolean): Uint8Array {
  return encode_uint256(value ? 1n : 0n)
}

export function encode_bytes_fixed(
  value: `0x${string}`,
  size: number,
): Uint8Array {
  const result = new Uint8Array(32)
  const hex = value.slice(2)
  if (hex.length !== size * 2) {
    throw new Error(
      `expected bytes${size} (${size * 2} hex chars), got ${hex.length}`,
    )
  }
  for (let i = 0; i < size; i++) {
    result[i] = Number.parseInt(
      hex.slice(i * 2, i * 2 + 2),
      16,
    )
  }
  return result
}

export function encode_string(value: string): Uint8Array {
  const bytes = new TextEncoder().encode(value)
  return encode_bytes_dynamic(bytes)
}

export function encode_bytes_dynamic(
  bytes: Uint8Array,
): Uint8Array {
  const padded_length = Math.ceil(bytes.length / 32) * 32
  const result = new Uint8Array(32 + padded_length)
  result.set(encode_uint256(BigInt(bytes.length)), 0)
  result.set(bytes, 32)
  return result
}

type AbiType =
  | "address"
  | "bool"
  | "string"
  | "bytes"
  | "bytes4"
  | "bytes8"
  | "bytes32"
  | "bytes48"
  | "bytes65"
  | "bytes256"
  | "uint"
  | "uint8"
  | "uint64"
  | "uint256"
  | "hash32"

const STATIC_TYPES = new Set<AbiType>([
  "address",
  "bool",
  "bytes4",
  "bytes8",
  "bytes32",
  "bytes48",
  "bytes65",
  "bytes256",
  "uint",
  "uint8",
  "uint64",
  "uint256",
  "hash32",
])

function is_static(type: AbiType): boolean {
  return STATIC_TYPES.has(type)
}

function encode_value(
  type: AbiType,
  value: unknown,
): Uint8Array {
  switch (type) {
    case "address":
    case "hash32":
      return encode_address(value as `0x${string}`)
    case "bool":
      return encode_bool(value as boolean)
    case "bytes4":
      return encode_bytes_fixed(value as `0x${string}`, 4)
    case "bytes8":
      return encode_bytes_fixed(value as `0x${string}`, 8)
    case "bytes32":
      return encode_bytes_fixed(value as `0x${string}`, 32)
    case "bytes48":
      return encode_bytes_fixed(value as `0x${string}`, 48)
    case "bytes65":
      return encode_bytes_fixed(value as `0x${string}`, 65)
    case "bytes256":
      return encode_bytes_fixed(value as `0x${string}`, 256)
    case "uint":
    case "uint8":
    case "uint64":
    case "uint256":
      return encode_uint256(to_bigint(value))
    case "string":
      return encode_string(value as string)
    case "bytes":
      return encode_bytes_dynamic(
        typeof value === "string"
          ? hex_string_to_bytes(value)
          : (value as Uint8Array),
      )
  }
}

function to_bigint(value: unknown): bigint {
  if (typeof value === "bigint") return value
  if (typeof value === "number") return BigInt(value)
  if (typeof value === "string") {
    return value.startsWith("0x")
      ? BigInt(value)
      : BigInt(value)
  }
  throw new Error(
    `cannot coerce value to bigint: ${typeof value}`,
  )
}

function hex_string_to_bytes(hex: string): Uint8Array {
  const data = hex.startsWith("0x") ? hex.slice(2) : hex
  const result = new Uint8Array(data.length / 2)
  for (let i = 0; i < data.length; i += 2) {
    result[i / 2] = Number.parseInt(
      data.slice(i, i + 2),
      16,
    )
  }
  return result
}

export function encode_function_call(
  signature: string,
  param_types: AbiType[],
  values: unknown[],
): Uint8Array {
  if (param_types.length !== values.length) {
    throw new Error(
      `param count mismatch: ${param_types.length} vs ${values.length}`,
    )
  }
  const selector = to_selector(signature)
  const head_size = param_types.length * 32
  const heads: Uint8Array[] = []
  const tails: Uint8Array[] = []
  for (let i = 0; i < param_types.length; i++) {
    const type = param_types[i] as AbiType
    const value = values[i]
    if (is_static(type)) {
      heads.push(encode_value(type, value))
      tails.push(new Uint8Array(0))
    } else {
      heads.push(new Uint8Array(32))
      tails.push(encode_value(type, value))
    }
  }
  let offset = head_size
  for (let i = 0; i < param_types.length; i++) {
    const type = param_types[i] as AbiType
    if (!is_static(type)) {
      heads[i] = encode_uint256(BigInt(offset))
      offset += (tails[i] as Uint8Array).length
    }
  }
  const total =
    4 +
    head_size +
    tails.reduce((sum, t) => sum + t.length, 0)
  const result = new Uint8Array(total)
  result.set(selector, 0)
  let pos = 4
  for (const head of heads) {
    result.set(head, pos)
    pos += 32
  }
  for (const tail of tails) {
    if (tail.length === 0) continue
    result.set(tail, pos)
    pos += tail.length
  }
  return result
}

export function build_signature(
  name: string,
  param_types: AbiType[],
): string {
  return `${name}(${param_types.join(",")})`
}

export function encode_call(
  signature: string,
  params: [`0x${string}`, string],
): Uint8Array {
  return encode_function_call(
    signature,
    ["address", "string"],
    params,
  )
}
