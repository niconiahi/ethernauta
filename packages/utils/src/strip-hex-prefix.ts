export function strip_hex_prefix(hex: string): string {
  return hex.startsWith("0x") ? hex.substring(2) : hex
}
