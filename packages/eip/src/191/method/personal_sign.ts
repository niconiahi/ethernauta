// https://eips.ethereum.org/EIPS/eip-191
// personal_sign(message, address) — wallet-side signing of a
// human-readable message. Per metamask convention the first
// parameter is the message (hex or utf8), the second is the
// signer address.

import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"

export function personal_sign(
  _parameters: [string, string],
): Signable<`0x${string}`> {
  return async ([signer]: ResolvedSigner) => {
    const [message, address] = _parameters
    const signature = await signer("personal_sign", [
      message,
      address,
    ])
    return signature as `0x${string}`
  }
}
