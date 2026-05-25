// https://eips.ethereum.org/EIPS/eip-2255

import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { array, parse } from "valibot"

import {
  type Permission,
  permissionSchema,
} from "../permission"

export function wallet_getPermissions(): Signable<
  Permission[]
> {
  return async ([signer]: ResolvedSigner) => {
    const result = await signer(
      "wallet_getPermissions",
      undefined,
    )
    return parse(
      array(permissionSchema),
      JSON.parse(result),
    )
  }
}
