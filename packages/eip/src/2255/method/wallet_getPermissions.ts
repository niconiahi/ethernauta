// https://eips.ethereum.org/EIPS/eip-2255

import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import type { Permission } from "../permission"

export function wallet_getPermissions(): Signable<
  Permission[]
> {
  return async ([signer]: ResolvedSigner) => {
    const result = await signer(
      "wallet_getPermissions",
      undefined,
    )
    return JSON.parse(result) as Permission[]
  }
}
