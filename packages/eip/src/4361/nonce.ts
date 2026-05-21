// https://eips.ethereum.org/EIPS/eip-4361
//
// SIWE nonce — opaque alphanumeric, RFC-3986 unreserved
// subset, length ≥ 8. We generate 16 chars from a 64-symbol
// alphabet (~95 bits of entropy) using Web Crypto so this
// works in Node, browsers, and Cloudflare Workers.

const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

export function generate_siwe_nonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  let out = ""
  for (let i = 0; i < bytes.length; i += 1) {
    out += ALPHABET[(bytes[i] as number) % ALPHABET.length]
  }
  return out
}
