// https://eips.ethereum.org/EIPS/eip-1102

import type { Addresses } from "@ethernauta/core"
import { AddressesSchema } from "@ethernauta/core"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { parse } from "valibot"

export function eth_requestAccounts(): Signable<Addresses> {
  return ([signer, _context]: ResolvedSigner) =>
    signer("eth_requestAccounts", undefined).then(
      (result) => parse(AddressesSchema, JSON.parse(result)),
    )
}
