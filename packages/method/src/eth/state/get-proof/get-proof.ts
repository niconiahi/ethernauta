import type { AccountProof } from "@ethernauta/core"
import { accountProofSchema, addressSchema, blockNumberOrTagOrHashSchema, bytesMax32Schema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { Input } from "valibot"
import { array, object, parse, tuple, union } from "valibot"

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
