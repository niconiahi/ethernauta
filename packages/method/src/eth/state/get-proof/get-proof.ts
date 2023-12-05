import type { AccountProof } from "@ethernauta/core"
import { accountProofSchema, addressSchema, blockNumberOrTagOrHash, bytesMax32Schema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { Input } from "valibot"
import { array, parse, tuple } from "valibot"

const parametersSchema = tuple([
  addressSchema,
  array(bytesMax32Schema),
  blockNumberOrTagOrHash,
])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns the merkle proof for a given account and optionally some storage keys.
 * @param address The address being requested
 * @param storageKeys The storage slot being requested
 * @param blockNumberOrTagOrHash The block number or tag or hash being requested
 * @returns The account's balance
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
