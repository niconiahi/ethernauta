import { custom, parse } from "valibot"

import type { AbiCodec, InferCodec } from "./abi-codec"
import {
  decode_sequence,
  encode_sequence,
} from "./sequence"

type Fields = Record<string, AbiCodec<any>>

type TupleValue<F extends Fields> = {
  [K in keyof F]: InferCodec<F[K]>
}

// Build a strict tuple codec from a named-field object. Field order is
// the declaration order of the object's keys, which matches the solidity
// component order on the wire.
//
// Accepts two input shapes at encode time:
//   - object form: { field_a: ..., field_b: ... }   (preferred)
//   - array form:  [value_a, value_b, ...]           (positional)
//
// Strictness:
//   - Object form: extra keys throw; missing keys throw.
//   - Array form:  wrong length throws.
//   - Element values are validated by the component's schema.
//
// Decode always returns object form.
export function tuple<F extends Fields>(
  _fields: F,
): AbiCodec<TupleValue<F>> {
  const names = Object.keys(_fields)
  const codecs = names.map(
    (n) => _fields[n] as AbiCodec<unknown>,
  )
  const signature = `(${codecs.map((c) => c.signature).join(",")})`
  const is_dynamic = codecs.some((c) => c.is_dynamic)

  function normalize(_input: unknown): unknown[] {
    if (Array.isArray(_input)) {
      if (_input.length !== names.length) {
        throw new Error(
          `tuple ${signature}: expected ${names.length} positional values, got ${_input.length}`,
        )
      }
      return _input.map((v, i) =>
        parse((codecs[i] as AbiCodec<unknown>).schema, v),
      )
    }
    if (_input === null || typeof _input !== "object") {
      throw new Error(
        `tuple ${signature}: expected object or array, got ${typeof _input}`,
      )
    }
    const obj = _input as Record<string, unknown>
    const obj_keys = Object.keys(obj)
    for (const k of obj_keys) {
      if (!names.includes(k)) {
        throw new Error(
          `tuple ${signature}: unexpected key "${k}"`,
        )
      }
    }
    return names.map((n, i) => {
      if (!(n in obj)) {
        throw new Error(
          `tuple ${signature}: missing required key "${n}"`,
        )
      }
      return parse(
        (codecs[i] as AbiCodec<unknown>).schema,
        obj[n],
      )
    })
  }

  return {
    signature,
    is_dynamic,
    schema: custom<TupleValue<F>>((_input) => {
      try {
        normalize(_input)
        return true
      } catch {
        return false
      }
    }),
    encode: (_value) => {
      const positional = normalize(_value)
      return encode_sequence(codecs, positional)
    },
    decode: (_data, _pos) => {
      const values = decode_sequence(codecs, _data, _pos)
      const out = {} as Record<string, unknown>
      names.forEach((n, i) => {
        out[n] = values[i]
      })
      return out as TupleValue<F>
    },
  }
}
