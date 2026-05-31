// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-getbytecodebyhash
// Bytecode lookup by content hash. Returns null when the node has
// never observed that bytecode hash.

import type { Bytes, Hash32 } from "@ethernauta/core"
import { BytesSchema, Hash32Schema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  nullable,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const ParametersSchema = union([
  tuple([Hash32Schema]),
  object({ hash: Hash32Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function zks_getBytecodeByHash(
  _parameters: Parameters,
): Readable<Bytes | null> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Bytes | null> => {
    const method = "zks_getBytecodeByHash"
    const parameters = parse(ParametersSchema, _parameters)
    const positional: [Hash32] = Array.isArray(parameters)
      ? parameters
      : [parameters.hash]
    const call = parse(CallSchema, [method, positional])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(nullable(BytesSchema), response.result)
  }
}
