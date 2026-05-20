// EIP-712 hashing.
// Spec: keccak("\x19\x01" || domainSeparator || hashStruct(message))
// where hashStruct(s) = keccak(typeHash || encodeData(s))
// and typeHash = keccak(encodeType(typeOf(s))).

import { hex_to_bytes } from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"

import type {
  TypedData,
  TypedDataDomain,
  TypedDataField,
  TypedDataTypes,
} from "./typed-data"

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

function find_dependencies(
  primary: string,
  types: TypedDataTypes,
  found: Set<string>,
): void {
  if (found.has(primary)) return
  if (!types[primary]) return
  found.add(primary)
  for (const field of types[primary] as TypedDataField[]) {
    const base = field.type.replace(/(\[\d*\])+$/, "")
    if (types[base]) find_dependencies(base, types, found)
  }
}

export function encode_type(
  primary: string,
  types: TypedDataTypes,
): string {
  const found = new Set<string>()
  find_dependencies(primary, types, found)
  found.delete(primary)
  const sorted = [primary, ...[...found].sort()]
  return sorted
    .map((name) => {
      const fields = (types[name] ?? []) as TypedDataField[]
      return `${name}(${fields
        .map((f) => `${f.type} ${f.name}`)
        .join(",")})`
    })
    .join("")
}

export function hash_type(
  primary: string,
  types: TypedDataTypes,
): Uint8Array {
  return keccak_256(
    new TextEncoder().encode(encode_type(primary, types)),
  )
}

function encode_uint256(big: bigint): Uint8Array {
  const out = new Uint8Array(32)
  // two's complement for negative ints
  let v = big < 0n ? (1n << 256n) + big : big
  for (let i = 31; i >= 0; i--) {
    out[i] = Number(v & 0xffn)
    v >>= 8n
  }
  return out
}

function to_bigint(value: unknown): bigint {
  if (typeof value === "bigint") return value
  if (typeof value === "number") return BigInt(value)
  if (typeof value === "string") return BigInt(value)
  throw new Error(
    `cannot coerce ${typeof value} to bigint for 712 numeric type`,
  )
}

function encode_value(
  type: string,
  value: unknown,
  types: TypedDataTypes,
): Uint8Array {
  const array_match = /(.*)\[(\d*)\]$/.exec(type)
  if (array_match) {
    const base = array_match[1] as string
    const arr = value as unknown[]
    const parts = arr.map((v) =>
      encode_value(base, v, types),
    )
    return keccak_256(concat(...parts))
  }
  if (types[type]) {
    return hash_struct(
      type,
      types,
      value as Record<string, unknown>,
    )
  }
  if (type === "string") {
    return keccak_256(
      new TextEncoder().encode(value as string),
    )
  }
  if (type === "bytes") {
    return keccak_256(hex_to_bytes(value as string))
  }
  if (type === "address") {
    const out = new Uint8Array(32)
    const bytes = hex_to_bytes(value as string)
    out.set(bytes, 12)
    return out
  }
  if (type === "bool") {
    const out = new Uint8Array(32)
    out[31] = value ? 1 : 0
    return out
  }
  const fixed_bytes = /^bytes(\d+)$/.exec(type)
  if (fixed_bytes) {
    const out = new Uint8Array(32)
    const bytes = hex_to_bytes(value as string)
    out.set(bytes, 0)
    return out
  }
  if (/^u?int(\d+)?$/.test(type)) {
    return encode_uint256(to_bigint(value))
  }
  throw new Error(`unsupported 712 type: ${type}`)
}

export function encode_data(
  primary: string,
  types: TypedDataTypes,
  message: Record<string, unknown>,
): Uint8Array {
  const fields = types[primary]
  if (!fields)
    throw new Error(
      `712: type ${primary} not defined in types`,
    )
  const parts: Uint8Array[] = [hash_type(primary, types)]
  for (const f of fields as TypedDataField[]) {
    parts.push(encode_value(f.type, message[f.name], types))
  }
  return concat(...parts)
}

export function hash_struct(
  primary: string,
  types: TypedDataTypes,
  message: Record<string, unknown>,
): Uint8Array {
  return keccak_256(encode_data(primary, types, message))
}

function domain_fields(
  domain: TypedDataDomain,
): TypedDataField[] {
  const fields: TypedDataField[] = []
  if (domain.name !== undefined)
    fields.push({ name: "name", type: "string" })
  if (domain.version !== undefined)
    fields.push({ name: "version", type: "string" })
  if (domain.chainId !== undefined)
    fields.push({ name: "chainId", type: "uint256" })
  if (domain.verifyingContract !== undefined)
    fields.push({
      name: "verifyingContract",
      type: "address",
    })
  if (domain.salt !== undefined)
    fields.push({ name: "salt", type: "bytes32" })
  return fields
}

export function hash_domain(
  domain: TypedDataDomain,
): Uint8Array {
  const fields = domain_fields(domain)
  const types: TypedDataTypes = { EIP712Domain: fields }
  return hash_struct(
    "EIP712Domain",
    types,
    domain as unknown as Record<string, unknown>,
  )
}

export function hash_typed_data(
  typed_data: TypedData,
): Uint8Array {
  const domain_sep = hash_domain(typed_data.domain)
  const message_hash = hash_struct(
    typed_data.primaryType,
    typed_data.types,
    typed_data.message,
  )
  const data = new Uint8Array(2 + 32 + 32)
  data[0] = 0x19
  data[1] = 0x01
  data.set(domain_sep, 2)
  data.set(message_hash, 34)
  return keccak_256(data)
}
