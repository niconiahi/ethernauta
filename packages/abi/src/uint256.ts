// Big-endian 32-byte reader / writer used by every codec that
// touches the ABI head/tail wire format (`sequence`, `array`,
// `leaves`'s uint/address/bool). Internal to `@ethernauta/abi` —
// not re-exported from the package barrel.

export function read_uint256(
  _data: Uint8Array,
  _pos: number,
): bigint {
  const bytes = _data.subarray(_pos, _pos + 32)
  if (bytes.length !== 32) {
    throw new Error("uint256 read out of bounds")
  }
  let value = 0n
  for (const byte of bytes) {
    value = (value << 8n) | BigInt(byte)
  }
  return value
}

export function write_uint256(_value: bigint): Uint8Array {
  const result = new Uint8Array(32)
  let v = _value
  for (let i = 31; i >= 0; i--) {
    result[i] = Number(v & 0xffn)
    v >>= 8n
  }
  return result
}
