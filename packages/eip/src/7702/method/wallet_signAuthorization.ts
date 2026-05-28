// https://eips.ethereum.org/EIPS/eip-7702
//
// Standalone signature primitive. The dapp hands the wallet a
// fully specified `(chain_id, address, nonce)` tuple and gets
// back the signed authorization (`y_parity, r, s` added).
//
// Used by sponsored / relayed flows where the dapp — not the
// signer's wallet — assembles and broadcasts the type-4 tx.
// For the common case where the signer also broadcasts, use
// `wallet_sendSetCodeTransaction` instead.

import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { parse } from "valibot"
import {
  type AuthorizationParameter,
  type AuthorizationSigned,
  AuthorizationSignedSchema,
} from "../authorization"

export function wallet_signAuthorization(
  _parameters: AuthorizationParameter,
): Signable<AuthorizationSigned> {
  return async ([signer]: ResolvedSigner) => {
    const result = await signer(
      "wallet_signAuthorization",
      _parameters,
    )
    return parse(
      AuthorizationSignedSchema,
      JSON.parse(result),
    )
  }
}
