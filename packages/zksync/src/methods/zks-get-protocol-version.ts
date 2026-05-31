// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-getprotocolversion
// `#[deprecated]` upstream in favour of `en_getProtocolVersionInfo`,
// but the method is still served by every public mainnet/Sepolia
// node — keep the binding and surface the deprecation in the JSDoc.

import { Uint64Schema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  nullable,
  object,
  optional,
  parse,
  tuple,
  union,
} from "valibot"

import type { ProtocolVersion } from "../core"
import { ProtocolVersionSchema } from "../core"

const ParametersSchema = union([
  tuple([Uint64Schema]),
  tuple([]),
  object({ versionId: optional(Uint64Schema) }),
])
type Parameters = InferOutput<typeof ParametersSchema>

/**
 * @deprecated Upstream marks `zks_getProtocolVersion` as deprecated
 * in favour of the `en_getProtocolVersionInfo` external-node method
 * (see `core/lib/web3_decl/src/namespaces/zks.rs`). Public nodes
 * still serve it for back-compat; new code should prefer the `en_*`
 * variant once we bind it.
 */
export function zks_getProtocolVersion(
  _parameters?: Parameters,
): Readable<ProtocolVersion | null> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<ProtocolVersion | null> => {
    const method = "zks_getProtocolVersion"
    const parameters =
      _parameters === undefined
        ? []
        : parse(ParametersSchema, _parameters)
    const positional = Array.isArray(parameters)
      ? parameters
      : parameters.versionId === undefined
        ? []
        : [parameters.versionId]
    const call = parse(CallSchema, [method, positional])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(
      nullable(ProtocolVersionSchema),
      response.result,
    )
  }
}
