// https://eips.ethereum.org/EIPS/eip-1102

import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"

export function eth_requestAccounts(): Signable<string[]> {
  return ([signer, _context]: ResolvedSigner) =>
    signer("eth_requestAccounts", undefined).then(
      (result) => JSON.parse(result),
    )
}
