// https://eips.ethereum.org/EIPS/eip-3668
//
// Template substitution per the spec:
//   - `{sender}` -> the lowercased hex address of the contract
//   - `{data}`   -> the 0x-prefixed hex of the contract's callData
//
// Per the spec, `{sender}` MUST be lowercased before substitution
// so URLs do not depend on EIP-55 checksum casing. `{data}` is
// expected to already be 0x-prefixed lowercase hex (the format
// every `Bytes` value in `@ethernauta/core` is normalized to).

import type { Address, Bytes } from "@ethernauta/core"

export function substitute_url(
  _url_template: string,
  _sender: Address,
  _call_data: Bytes,
): string {
  const sender = _sender.toLowerCase()
  return _url_template
    .replaceAll("{sender}", sender)
    .replaceAll("{data}", _call_data)
}
