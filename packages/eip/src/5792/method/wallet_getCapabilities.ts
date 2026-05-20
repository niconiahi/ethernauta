// https://eips.ethereum.org/EIPS/eip-5792

import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import type { Capabilities } from "../capabilities"

export function wallet_getCapabilities(): Signable<
  Capabilities
> {
  return async ([signer]: ResolvedSigner) => {
    const result = await signer(
      "wallet_getCapabilities",
      undefined,
    )
    return JSON.parse(result) as Capabilities
  }
}
