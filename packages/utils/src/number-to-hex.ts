export function number_to_hex(
  number: number,
): `0x${string}` {
  return `0x${number.toString(16)}` satisfies `0x${string}`
}
