// https://eips.ethereum.org/EIPS/eip-191
// personal_sign prepends the byte 0x19, the string
// "Ethereum Signed Message:\n", and the message length
// (decimal ASCII) before hashing with keccak256.

import { bytes_to_hex, hex_to_bytes } from "@ethernauta/utils"

const PREFIX = "\x19Ethereum Signed Message:\n"

function utf8_to_bytes(text: string): Uint8Array {
  return new TextEncoder().encode(text)
}

function is_hex(value: string): value is `0x${string}` {
  return (
    value.startsWith("0x") &&
    value.length % 2 === 0 &&
    /^0x[0-9a-fA-F]*$/.test(value)
  )
}

function to_message_bytes(
  message: string | Uint8Array,
): Uint8Array {
  if (typeof message !== "string") return message
  if (is_hex(message))
    return hex_to_bytes(message as `0x${string}`)
  return utf8_to_bytes(message)
}

export function build_personal_message(
  message: string | Uint8Array,
): Uint8Array {
  const body = to_message_bytes(message)
  const header = utf8_to_bytes(
    `${PREFIX}${body.length}`,
  )
  const out = new Uint8Array(header.length + body.length)
  out.set(header, 0)
  out.set(body, header.length)
  return out
}

export function build_personal_message_hex(
  message: string | Uint8Array,
): `0x${string}` {
  return bytes_to_hex(
    build_personal_message(message),
  ) as `0x${string}`
}
