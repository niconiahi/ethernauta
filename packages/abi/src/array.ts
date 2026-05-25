import { parse, array as v_array } from "valibot"

import type { AbiCodec, InferCodec } from "./abi-codec"
import {
  decode_sequence,
  encode_sequence,
} from "./sequence"
import { read_uint256, write_uint256 } from "./uint256"

// Dynamic array of T. Always dynamic. Wire layout:
//   - 32 bytes: array length
//   - body:     encoded via head/tail rule on a sequence of `length`
//               copies of the element codec
export function array<T>(
  _element: AbiCodec<T>,
): AbiCodec<T[]> {
  const signature = `${_element.signature}[]`
  const element_schema = v_array(_element.schema)
  return {
    signature,
    is_dynamic: true,
    schema: element_schema,
    encode(_values) {
      const items = parse(element_schema, _values)
      const codecs: AbiCodec<unknown>[] = Array(
        items.length,
      ).fill(_element)
      const length_prefix = write_uint256(
        BigInt(items.length),
      )
      const body = encode_sequence(codecs, items)
      const out = new Uint8Array(32 + body.length)
      out.set(length_prefix, 0)
      out.set(body, 32)
      return out
    },
    decode(_data, _pos) {
      const length = Number(read_uint256(_data, _pos))
      const codecs: AbiCodec<unknown>[] =
        Array(length).fill(_element)
      const values = decode_sequence(
        codecs,
        _data,
        _pos + 32,
      )
      return parse(element_schema, values)
    },
  }
}

export type InferArrayElement<C> = C extends AbiCodec<
  infer T
>
  ? InferCodec<AbiCodec<T>>
  : never
