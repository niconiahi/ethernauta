import type { Input } from "valibot"
import { array, object, parse, tuple, union } from "valibot"

import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { addressSchema, bytesMax32Schema } from "../../../core/base"
import { blockNumberOrTagOrHashSchema } from "../../../core/block"
import { accountProofSchema } from "../../../core/state"
import type { AccountProof } from "../../../core/state"

const parametersSchema = union([
  tuple([
    addressSchema,
    array(bytesMax32Schema),
    blockNumberOrTagOrHashSchema,
  ]),
  object({
    address: addressSchema,
    storageKeys: array(bytesMax32Schema),
    blockNumberOrTagOrHash: blockNumberOrTagOrHashSchema,
  }),
])

type Parameters = Input<typeof parametersSchema>
/**
 * @returns The merkle proof for a given account and optionally some storage keys
 */
export function eth_getProof(_parameters: Parameters): Readable<AccountProof> {
  return async (transports: Http[]): Promise<AccountProof> => {
    const method = "eth_getProof"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map(transport => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(accountProofSchema, response.result)
    return result
  }
}
