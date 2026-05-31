// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-getfeeparams
// Operator-chosen fee-model parameters currently active on the
// chain. Externally tagged on the wire: `{ "V1": { ... } }` or
// `{ "V2": { ... } }`.

import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { parse } from "valibot"

import type { FeeParams } from "../core"
import { FeeParamsSchema } from "../core"

export function zks_getFeeParams(): Readable<FeeParams> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<FeeParams> => {
    const method = "zks_getFeeParams"
    const call = parse(CallSchema, [method])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(FeeParamsSchema, response.result)
  }
}
