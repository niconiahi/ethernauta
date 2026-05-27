export function bigint_to_hex(
  value: bigint,
): `0x${string}` {
  return value === 0n ? "0x0" : `0x${value.toString(16)}`
}
