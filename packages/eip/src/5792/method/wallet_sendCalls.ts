// https://eips.ethereum.org/EIPS/eip-5792

import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { parse } from "valibot"
import {
  type SendCallsParameters,
  sendCallsParametersSchema,
} from "../capabilities"

export function wallet_sendCalls(
  _parameters: SendCallsParameters,
): Signable<string> {
  return async ([signer]: ResolvedSigner) => {
    const parameters = parse(
      sendCallsParametersSchema,
      _parameters,
    )
    const result = await signer(
      "wallet_sendCalls",
      parameters,
    )
    return result
  }
}
