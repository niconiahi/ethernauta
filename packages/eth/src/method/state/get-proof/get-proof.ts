import type { Input } from "valibot"
import { array, object, parse, tuple, union } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { addressSchema, bytesMax32Schema } from "../../../base"
import { blockNumberOrTagOrHashSchema } from "../../../block"
import { accountProofSchema } from "../../../state"
import type { AccountProof } from "../../../state"

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
export function getProof(_parameters: Parameters): Readable<AccountProof> {
  return async (reader: Reader): Promise<AccountProof> => {
    const method = "eth_getProof"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(accountProofSchema, response.result)
    return result
  }
}
