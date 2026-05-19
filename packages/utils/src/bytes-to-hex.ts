const HEX_ALPHABET = "0123456789abcdef"

export function bytes_to_hex(
  data: Uint8Array,
): `0x${string}` {
  let result = ""
  for (let i = 0; i < data.length; i++) {
    const byte = data[i] as number
    result += HEX_ALPHABET[byte >> 4]
    result += HEX_ALPHABET[byte & 0x0f]
  }
  return `0x${result}`
}
