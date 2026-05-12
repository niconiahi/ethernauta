// https://eips.ethereum.org/EIPS/eip-1102

import type { Signer } from "../../1193"

export function eth_requestAccounts() {
  return (signer: Signer) =>
    signer("eth_requestAccounts", undefined)
}
