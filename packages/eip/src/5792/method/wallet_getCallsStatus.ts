// https://eips.ethereum.org/EIPS/eip-5792

import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import type { CallsStatus } from "../capabilities"

export function wallet_getCallsStatus(
  _parameters: [string],
): Signable<CallsStatus> {
  return async ([signer]: ResolvedSigner) => {
    const result = await signer(
      "wallet_getCallsStatus",
      _parameters,
    )
    return JSON.parse(result) as CallsStatus
  }
}
