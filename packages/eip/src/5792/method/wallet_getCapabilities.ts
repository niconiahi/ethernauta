// https://eips.ethereum.org/EIPS/eip-5792

import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { parse } from "valibot"
import {
  type Capabilities,
  CapabilitiesSchema,
} from "../capabilities"

export function wallet_getCapabilities(): Signable<Capabilities> {
  return async ([signer]: ResolvedSigner) => {
    const result = await signer(
      "wallet_getCapabilities",
      undefined,
    )
    return parse(CapabilitiesSchema, JSON.parse(result))
  }
}
