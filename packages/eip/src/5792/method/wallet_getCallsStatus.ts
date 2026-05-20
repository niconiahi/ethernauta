// https://eips.ethereum.org/EIPS/eip-5792

import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { parse } from "valibot"
import {
  type CallsStatus,
  callsStatusSchema,
} from "../capabilities"

export function wallet_getCallsStatus(
  _parameters: [string],
): Signable<CallsStatus> {
  return async ([signer]: ResolvedSigner) => {
    const result = await signer(
      "wallet_getCallsStatus",
      _parameters,
    )
    return parse(callsStatusSchema, JSON.parse(result))
  }
}
