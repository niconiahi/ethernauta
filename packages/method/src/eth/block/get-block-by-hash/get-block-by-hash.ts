import type { Block, NotFound } from '@ethernauta/core'
import { blockSchema, hash32Schema, notFoundSchema } from '@ethernauta/core'
import type { Readable, Reader } from '@ethernauta/transport'
import { callSchema } from '@ethernauta/transport'
import type { Input } from 'valibot'
import { boolean, parse, tuple, union } from 'valibot'

const parametersSchema = tuple([hash32Schema, boolean()])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns information about a transaction by block hash and transaction index position
 * @typedef {Hash32} blockHash The block hash in which to search
 * @typedef {boolean} hydratedTransactions Return transaction as objects or not
 * @typedef {[blockHash, hydratedTransactions]} Parameters
 * @param {Parameters} _parameters h The block hash in which to search
 * @returns The transaction information or null if not found
 */
export function getBlockByHash(_parameters: Parameters): Readable<Block | NotFound> {
  return async (reader: Reader): Promise<Block | NotFound> => {
    const method = 'eth_getBlockByHash'
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await reader(call)
    if ('error' in response) {
      throw new Error(response.error.message)
    }
    const result = parse(union([blockSchema, notFoundSchema]), response.result)
    return result
  }
}
