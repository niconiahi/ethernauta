// https://github.com/OffchainLabs/nitro/blob/master/execution/gethexec/api.go#L86
// `timeboost_sendExpressLaneTransaction(msg)` — submits a signed
// Express Lane transaction inside a winning auction round.
// Registered execution-side on the `timeboost` namespace via
// `ArbTimeboostAPI`. The Go signature takes a
// `*timeboost.JsonExpressLaneSubmission` — a structured object
// carrying the inner L2 raw-RLP transaction plus the round / sequence
// metadata and the auctioneer signature. Returns `error`; on success
// the RPC result is `null`.

import type {
  ResolvedWriter,
  Writable,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import {
  type InferOutput,
  null_,
  object,
  parse,
  tuple,
  union,
} from "valibot"
import { JsonExpressLaneSubmissionSchema } from "../core/json-express-lane-submission"

const ParametersSchema = union([
  tuple([JsonExpressLaneSubmissionSchema]),
  object({ submission: JsonExpressLaneSubmissionSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

const ResultSchema = null_()

export function timeboost_sendExpressLaneTransaction(
  _parameters: Parameters,
): Writable<null> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedWriter): Promise<null> => {
    const method = "timeboost_sendExpressLaneTransaction"
    const parameters = parse(ParametersSchema, _parameters)
    const positional = Array.isArray(parameters)
      ? parameters
      : [parameters.submission]
    const call = parse(CallSchema, [method, positional])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(ResultSchema, response.result)
  }
}
