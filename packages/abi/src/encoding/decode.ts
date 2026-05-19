import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"

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

function read_uint256(
  data: Uint8Array,
  pos: number,
): bigint {
  let value = 0n
  for (let i = 0; i < 32; i++) {
    value = (value << 8n) | BigInt(data[pos + i] as number)
  }
  return value
}

function read_uint256_hex(
  data: Uint8Array,
  pos: number,
): `0x${string}` {
  return bytes_to_hex(data.slice(pos, pos + 32))
}

function decode_address(
  data: Uint8Array,
  pos: number,
): `0x${string}` {
  return bytes_to_hex(data.slice(pos + 12, pos + 32))
}

function decode_bool(
  data: Uint8Array,
  pos: number,
): boolean {
  return read_uint256(data, pos) === 1n
}

function decode_bytes_fixed(
  data: Uint8Array,
  pos: number,
  size: number,
): `0x${string}` {
  return bytes_to_hex(data.slice(pos, pos + size))
}

function decode_string(
  data: Uint8Array,
  offset: number,
): string {
  const length = Number(read_uint256(data, offset))
  const start = offset + 32
  return new TextDecoder().decode(
    data.slice(start, start + length),
  )
}

function decode_bytes_dynamic(
  data: Uint8Array,
  offset: number,
): `0x${string}` {
  const length = Number(read_uint256(data, offset))
  const start = offset + 32
  return bytes_to_hex(data.slice(start, start + length))
}

function decode_static(
  type: AbiType,
  data: Uint8Array,
  pos: number,
): unknown {
  switch (type) {
    case "address":
    case "hash32":
      return decode_address(data, pos)
    case "bool":
      return decode_bool(data, pos)
    case "bytes4":
      return decode_bytes_fixed(data, pos, 4)
    case "bytes8":
      return decode_bytes_fixed(data, pos, 8)
    case "bytes32":
      return decode_bytes_fixed(data, pos, 32)
    case "bytes48":
      return decode_bytes_fixed(data, pos, 48)
    case "bytes65":
      return decode_bytes_fixed(data, pos, 65)
    case "bytes256":
      return decode_bytes_fixed(data, pos, 256)
    case "uint":
    case "uint8":
    case "uint64":
    case "uint256":
      return read_uint256_hex(data, pos)
    default:
      throw new Error(
        `decode_static called for dynamic type ${type}`,
      )
  }
}

function decode_dynamic(
  type: AbiType,
  data: Uint8Array,
  offset: number,
): unknown {
  switch (type) {
    case "string":
      return decode_string(data, offset)
    case "bytes":
      return decode_bytes_dynamic(data, offset)
    default:
      throw new Error(
        `decode_dynamic called for static type ${type}`,
      )
  }
}

export function decode_function_result(
  output_types: AbiType[],
  hex: `0x${string}`,
): unknown[] {
  const data = hex_to_bytes(hex)
  const out: unknown[] = []
  let pos = 0
  for (const type of output_types) {
    if (is_static(type)) {
      out.push(decode_static(type, data, pos))
      pos += 32
    } else {
      const offset = Number(read_uint256(data, pos))
      out.push(decode_dynamic(type, data, offset))
      pos += 32
    }
  }
  return out
}

export function decode_function_call(
  input_types: AbiType[],
  hex: `0x${string}`,
): { selector: `0x${string}`; args: unknown[] } {
  const bytes = hex_to_bytes(hex)
  if (bytes.length < 4) {
    throw new Error(
      `calldata too short: ${bytes.length} bytes`,
    )
  }
  const selector = bytes_to_hex(bytes.slice(0, 4))
  const payload = bytes_to_hex(bytes.slice(4))
  const args = decode_function_result(input_types, payload)
  return { selector, args }
}
