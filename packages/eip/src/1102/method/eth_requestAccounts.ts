// https://eips.ethereum.org/EIPS/eip-1102

import type { Signable, Signer } from "../../1193"

export function eth_requestAccounts(): Signable<string[]> {
  return (signer: Signer) =>
    signer("eth_requestAccounts", undefined).then((result) =>
      JSON.parse(result),
    )
}
