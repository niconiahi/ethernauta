import {
  type Address,
  AddressSchema,
  type Bytes,
  type Bytes4,
  Bytes4Schema,
  type Bytes8,
  Bytes8Schema,
  type Bytes32,
  Bytes32Schema,
  type Bytes48,
  Bytes48Schema,
  type Bytes65,
  Bytes65Schema,
  type Bytes256,
  Bytes256Schema,
  BytesSchema,
  type Uint8,
  Uint8Schema,
  type Uint16,
  Uint16Schema,
  type Uint24,
  Uint24Schema,
  type Uint32,
  Uint32Schema,
  type Uint40,
  Uint40Schema,
  type Uint48,
  Uint48Schema,
  type Uint56,
  Uint56Schema,
  type Uint64,
  Uint64Schema,
  type Uint96,
  Uint96Schema,
  type Uint128,
  Uint128Schema,
  type Uint160,
  Uint160Schema,
  type Uint192,
  Uint192Schema,
  type Uint224,
  Uint224Schema,
  type Uint256,
  Uint256Schema,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import {
  type BaseIssue,
  type BaseSchema,
  boolean,
  parse,
  string,
} from "valibot"

import type { AbiCodec } from "./abi-codec"
import { read_uint256, write_uint256 } from "./uint256"

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
    schema: AddressSchema,
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
      return parse(AddressSchema, bytes_to_hex(slice))
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
    schema: BytesSchema,
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
      return parse(
        BytesSchema,
        bytes_to_hex(
          _data.slice(_pos + 32, _pos + 32 + len),
        ),
      )
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
      return parse(
        _schema,
        bytes_to_hex(_data.slice(_pos, _pos + _size)),
      )
    },
  }
}

export function bytes4(): AbiCodec<Bytes4> {
  return make_bytes_fixed(4, "bytes4", Bytes4Schema)
}

export function bytes8(): AbiCodec<Bytes8> {
  return make_bytes_fixed(8, "bytes8", Bytes8Schema)
}

export function bytes32(): AbiCodec<Bytes32> {
  return make_bytes_fixed(32, "bytes32", Bytes32Schema)
}

export function bytes48(): AbiCodec<Bytes48> {
  return make_bytes_fixed(48, "bytes48", Bytes48Schema)
}

export function bytes65(): AbiCodec<Bytes65> {
  return make_bytes_fixed(65, "bytes65", Bytes65Schema)
}

export function bytes256(): AbiCodec<Bytes256> {
  return make_bytes_fixed(256, "bytes256", Bytes256Schema)
}

// ---------------------------------------------------------------- uintN

function make_uint<T extends `0x${string}`>(
  _signature: string,
  _schema: BaseSchema<unknown, T, BaseIssue<unknown>>,
): AbiCodec<T> {
  return {
    signature: _signature,
    is_dynamic: false,
    schema: _schema,
    encode: (_value) => write_uint256(to_bigint(_value)),
    decode: (_data, _pos) => {
      return parse(
        _schema,
        bytes_to_hex(_data.slice(_pos, _pos + 32)),
      )
    },
  }
}

export function uint8(): AbiCodec<Uint8> {
  return make_uint("uint8", Uint8Schema)
}

export function uint16(): AbiCodec<Uint16> {
  return make_uint("uint16", Uint16Schema)
}

export function uint24(): AbiCodec<Uint24> {
  return make_uint("uint24", Uint24Schema)
}

export function uint32(): AbiCodec<Uint32> {
  return make_uint("uint32", Uint32Schema)
}

export function uint40(): AbiCodec<Uint40> {
  return make_uint("uint40", Uint40Schema)
}

export function uint48(): AbiCodec<Uint48> {
  return make_uint("uint48", Uint48Schema)
}

export function uint56(): AbiCodec<Uint56> {
  return make_uint("uint56", Uint56Schema)
}

export function uint64(): AbiCodec<Uint64> {
  return make_uint("uint64", Uint64Schema)
}

export function uint96(): AbiCodec<Uint96> {
  return make_uint("uint96", Uint96Schema)
}

export function uint128(): AbiCodec<Uint128> {
  return make_uint("uint128", Uint128Schema)
}

export function uint160(): AbiCodec<Uint160> {
  return make_uint("uint160", Uint160Schema)
}

export function uint192(): AbiCodec<Uint192> {
  return make_uint("uint192", Uint192Schema)
}

export function uint224(): AbiCodec<Uint224> {
  return make_uint("uint224", Uint224Schema)
}

export function uint256(): AbiCodec<Uint256> {
  return make_uint("uint256", Uint256Schema)
}

export function uint(): AbiCodec<Uint256> {
  return make_uint("uint256", Uint256Schema)
}
