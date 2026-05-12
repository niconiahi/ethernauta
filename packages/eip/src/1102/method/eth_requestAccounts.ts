// https://eips.ethereum.org/EIPS/eip-1102

import type { Signer } from "../../1193"

export async function eth_requestAccounts(
  signer: Signer,
  params: unknown,
) {
  return signer("eth_requestAccounts", params)
}
