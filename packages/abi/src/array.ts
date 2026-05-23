import { parse, array as v_array } from "valibot"

import type { AbiCodec, InferCodec } from "./abi-codec"
import {
  decode_sequence,
  encode_sequence,
} from "./sequence"

// Dynamic array of T. Always dynamic. Wire layout:
//   - 32 bytes: array length
//   - body:     encoded via head/tail rule on a sequence of `length`
//               copies of the element codec
export function array<T>(
  _element: AbiCodec<T>,
): AbiCodec<T[]> {
  const signature = `${_element.signature}[]`
  return {
    signature,
    is_dynamic: true,
    schema: v_array(_element.schema),
    encode: (_values) => {
      const items = parse(
        v_array(_element.schema),
        _values,
      ) as T[]
      const codecs = Array(items.length).fill(
        _element,
      ) as AbiCodec<T>[]
      const length_prefix = write_uint256(
        BigInt(items.length),
      )
      const body = encode_sequence(
        codecs as AbiCodec<unknown>[],
        items as unknown[],
      )
      const out = new Uint8Array(32 + body.length)
      out.set(length_prefix, 0)
      out.set(body, 32)
      return out
    },
    decode: (_data, _pos) => {
      const length = Number(read_uint256(_data, _pos))
      const codecs = Array(length).fill(
        _element,
      ) as AbiCodec<unknown>[]
      const values = decode_sequence(
        codecs,
        _data,
        _pos + 32,
      )
      return values as T[]
    },
  }
}

export type InferArrayElement<C> = C extends AbiCodec<
  infer T
>
  ? InferCodec<AbiCodec<T>>
  : never

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
