// https://eips.ethereum.org/EIPS/eip-2255

import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { array, parse } from "valibot"

import {
  type Permission,
  permissionSchema,
  type RequestedPermissions,
} from "../permission"

export function wallet_requestPermissions(
  _parameters: [RequestedPermissions],
): Signable<Permission[]> {
  return async ([signer]: ResolvedSigner) => {
    const result = await signer(
      "wallet_requestPermissions",
      _parameters,
    )
    return parse(
      array(permissionSchema),
      JSON.parse(result),
    )
  }
}
