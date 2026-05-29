// https://eips.ethereum.org/EIPS/eip-3668
//
// Build the calldata for the second `eth_call` per the spec:
//
//   newCalldata = callbackFunction || abi.encode(
//     bytes response,    // the off-chain gateway response data
//     bytes extraData    // forwarded verbatim from the revert
//   )
//
// `callbackFunction` is the 4-byte selector the contract told the
// client to call back into. The two trailing `bytes` arguments are
// ABI-encoded as a head/tail pair of dynamic `bytes`. Hand-rolled
// (mirroring `6492/abi.ts` and the 4337 packer) to keep this
// package free of an `@ethernauta/abi` runtime dependency.

import { type Bytes, type Bytes4, BytesSchema } from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { parse } from "valibot"

const WORD = 32

function pad_to_word(_bytes: Uint8Array): Uint8Array {
  const padded_len = Math.ceil(_bytes.length / WORD) * WORD
  if (padded_len === _bytes.length) return _bytes
  const out = new Uint8Array(padded_len)
  out.set(_bytes, 0)
  return out
}

function write_uint256_be(
  _out: Uint8Array,
  _offset: number,
  _value: number,
): void {
  let value = _value
  for (let i = WORD - 1; i >= 0 && value > 0; i--) {
    _out[_offset + i] = value & 0xff
    value = Math.floor(value / 256)
  }
}

function encode_bytes_pair(
  _a: Uint8Array,
  _b: Uint8Array,
): Uint8Array {
  const a_body = pad_to_word(_a)
  const b_body = pad_to_word(_b)
  const head_len = WORD * 2
  const a_section_len = WORD + a_body.length
  const offset_a = head_len
  const offset_b = head_len + a_section_len
  const total =
    head_len + a_section_len + WORD + b_body.length
  const out = new Uint8Array(total)
  write_uint256_be(out, 0, offset_a)
  write_uint256_be(out, WORD, offset_b)
  write_uint256_be(out, head_len, _a.length)
  out.set(a_body, head_len + WORD)
  write_uint256_be(out, head_len + a_section_len, _b.length)
  out.set(b_body, head_len + a_section_len + WORD)
  return out
}

export function build_callback_calldata(
  _callback_function: Bytes4,
  _response: Bytes,
  _extra_data: Bytes,
): Bytes {
  const selector_bytes = hex_to_bytes(_callback_function)
  const response_bytes = hex_to_bytes(_response)
  const extra_bytes = hex_to_bytes(_extra_data)
  const args_bytes = encode_bytes_pair(
    response_bytes,
    extra_bytes,
  )
  const out = new Uint8Array(
    selector_bytes.length + args_bytes.length,
  )
  out.set(selector_bytes, 0)
  out.set(args_bytes, selector_bytes.length)
  return parse(BytesSchema, bytes_to_hex(out))
}
