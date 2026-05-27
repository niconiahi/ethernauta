import { array, length, parse, pipe } from "valibot"

import type { AbiCodec } from "./abi-codec"
import {
  decode_sequence,
  encode_sequence,
} from "./sequence"

// Fixed-length array T[K]. Per the solidity ABI spec, T[K] is dynamic
// iff T is dynamic. There is no length prefix on the wire — K is
// implicit from the type. Encoding is just `encode_sequence` over K
// copies of the element codec; same head/tail rule as a tuple.
//
// The runtime schema is `array(elem.schema) | length(K)` so the
// codec can validate input length. The generator emits a stricter
// Valibot `tuple([elem, elem, ...])` (K entries) at call sites so
// users see the exact `[T, T, T]` tuple type.
export function fixed_array<T>(
  _element: AbiCodec<T>,
  _length: number,
): AbiCodec<T[]> {
  const signature = `${_element.signature}[${_length}]`
  const codecs: AbiCodec<T>[] = Array(_length).fill(_element)
  const element_schema = pipe(
    array(_element.schema),
    length(_length),
  )
  return {
    signature,
    is_dynamic: _element.is_dynamic,
    schema: element_schema,
    encode(_values) {
      const items = parse(element_schema, _values)
      return encode_sequence(codecs, items)
    },
    decode(_data, _pos) {
      const values = decode_sequence(codecs, _data, _pos)
      return parse(element_schema, values)
    },
  }
}
