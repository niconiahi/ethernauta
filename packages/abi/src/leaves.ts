import {
  type Address,
  addressSchema,
  type Bytes,
  bytesSchema,
  type Bytes4,
  bytes4Schema,
  type Bytes8,
  bytes8Schema,
  type Bytes32,
  bytes32Schema,
  type Bytes48,
  bytes48Schema,
  type Bytes65,
  bytes65Schema,
  type Bytes256,
  bytes256Schema,
  type Hash32,
  hash32Schema,
  type Uint256,
  uint256Schema,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { boolean, string } from "valibot"

import type { AbiCodec } from "./abi-codec"

function read_uint256(
  _data: Uint8Array,
  _pos: number,
): bigint {
  let value = 0n
  for (let i = 0; i < 32; i++) {
    value =
      (value << 8n) | BigInt(_data[_pos + i] as number)
  }
  return value
}

function write_uint256(_value: bigint): Uint8Array {
  const result = new Uint8Array(32)
  let v = _value
  for (let i = 31; i >= 0; i--) {
    result[i] = Number(v & 0xffn)
    v >>= 8n
  }
  return result
}

function to_bigint(_value: string): bigint {
  return _value.startsWith("0x")
    ? BigInt(_value)
    : BigInt(_value)
}

function pad_left_32(
  _bytes: Uint8Array,
  _size: number,
): Uint8Array {
  if (_bytes.length !== _size) {
    throw new Error(
      `expected ${_size} bytes, got ${_bytes.length}`,
    )
  }
  const out = new Uint8Array(32)
  out.set(_bytes, 32 - _size)
  return out
}

function pad_right_32(_bytes: Uint8Array): Uint8Array {
  const padded_len = Math.ceil(_bytes.length / 32) * 32
  const out = new Uint8Array(padded_len)
  out.set(_bytes, 0)
  return out
}

// ---------------------------------------------------------------- address

export function address(): AbiCodec<Address> {
  return {
    signature: "address",
    is_dynamic: false,
    schema: addressSchema,
    encode: (_value) => {
      const hex = _value.slice(2)
      const bytes = new Uint8Array(20)
      for (let i = 0; i < 20; i++) {
        bytes[i] = Number.parseInt(
          hex.slice(i * 2, i * 2 + 2),
          16,
        )
      }
      return pad_left_32(bytes, 20)
    },
    decode: (_data, _pos) => {
      const slice = _data.slice(_pos + 12, _pos + 32)
      return bytes_to_hex(slice) as Address
    },
  }
}

// ---------------------------------------------------------------- bool

export function bool(): AbiCodec<boolean> {
  return {
    signature: "bool",
    is_dynamic: false,
    schema: boolean(),
    encode: (_value) => write_uint256(_value ? 1n : 0n),
    decode: (_data, _pos) =>
      read_uint256(_data, _pos) === 1n,
  }
}

// ---------------------------------------------------------------- string

export function string_(): AbiCodec<string> {
  return {
    signature: "string",
    is_dynamic: true,
    schema: string(),
    encode: (_value) => {
      const utf8 = new TextEncoder().encode(_value)
      const out = new Uint8Array(
        32 + pad_right_32(utf8).length,
      )
      out.set(write_uint256(BigInt(utf8.length)), 0)
      out.set(utf8, 32)
      return out
    },
    decode: (_data, _pos) => {
      const len = Number(read_uint256(_data, _pos))
      return new TextDecoder().decode(
        _data.slice(_pos + 32, _pos + 32 + len),
      )
    },
  }
}

// ---------------------------------------------------------------- bytes (dynamic)

export function bytes(): AbiCodec<Bytes> {
  return {
    signature: "bytes",
    is_dynamic: true,
    schema: bytesSchema,
    encode: (_value) => {
      const buf = hex_to_bytes(_value)
      const padded = pad_right_32(buf)
      const out = new Uint8Array(32 + padded.length)
      out.set(write_uint256(BigInt(buf.length)), 0)
      out.set(buf, 32)
      return out
    },
    decode: (_data, _pos) => {
      const len = Number(read_uint256(_data, _pos))
      return bytes_to_hex(
        _data.slice(_pos + 32, _pos + 32 + len),
      ) as Bytes
    },
  }
}

// ---------------------------------------------------------------- bytesN (fixed)

function make_bytes_fixed<T extends `0x${string}`>(
  _size: number,
  _signature: string,
  _schema: AbiCodec<T>["schema"],
): AbiCodec<T> {
  return {
    signature: _signature,
    is_dynamic: false,
    schema: _schema,
    encode: (_value) => {
      const hex = _value.slice(2)
      if (hex.length !== _size * 2) {
        throw new Error(
          `expected ${_signature} (${_size * 2} hex chars), got ${hex.length}`,
        )
      }
      const bytes = new Uint8Array(_size)
      for (let i = 0; i < _size; i++) {
        bytes[i] = Number.parseInt(
          hex.slice(i * 2, i * 2 + 2),
          16,
        )
      }
      // bytesN is left-aligned: data in first N bytes, right-padded zeros.
      // For _size > 32 (bytes48, bytes65, bytes256), the value spans
      // ceil(_size / 32) slots.
      const slot_count = Math.ceil(_size / 32)
      const out = new Uint8Array(slot_count * 32)
      out.set(bytes, 0)
      return out
    },
    decode: (_data, _pos) => {
      return bytes_to_hex(
        _data.slice(_pos, _pos + _size),
      ) as T
    },
  }
}

export function bytes4(): AbiCodec<Bytes4> {
  return make_bytes_fixed(4, "bytes4", bytes4Schema)
}

export function bytes8(): AbiCodec<Bytes8> {
  return make_bytes_fixed(8, "bytes8", bytes8Schema)
}

export function bytes32(): AbiCodec<Bytes32> {
  return make_bytes_fixed(32, "bytes32", bytes32Schema)
}

export function bytes48(): AbiCodec<Bytes48> {
  return make_bytes_fixed(48, "bytes48", bytes48Schema)
}

export function bytes65(): AbiCodec<Bytes65> {
  return make_bytes_fixed(65, "bytes65", bytes65Schema)
}

export function bytes256(): AbiCodec<Bytes256> {
  return make_bytes_fixed(256, "bytes256", bytes256Schema)
}

export function hash32(): AbiCodec<Hash32> {
  return make_bytes_fixed(32, "hash32", hash32Schema)
}

// ---------------------------------------------------------------- uintN

function make_uint(_signature: string): AbiCodec<Uint256> {
  return {
    signature: _signature,
    is_dynamic: false,
    schema: uint256Schema,
    encode: (_value) => write_uint256(to_bigint(_value)),
    decode: (_data, _pos) => {
      return bytes_to_hex(
        _data.slice(_pos, _pos + 32),
      ) as Uint256
    },
  }
}

export function uint8(): AbiCodec<Uint256> {
  return make_uint("uint8")
}

export function uint32(): AbiCodec<Uint256> {
  return make_uint("uint32")
}

export function uint64(): AbiCodec<Uint256> {
  return make_uint("uint64")
}

export function uint256(): AbiCodec<Uint256> {
  return make_uint("uint256")
}

export function uint(): AbiCodec<Uint256> {
  return make_uint("uint256")
}
