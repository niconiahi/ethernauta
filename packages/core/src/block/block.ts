import {
  Input,
  array,
  object,
  nullable,
  union,
  literal
} from "valibot";
import {
  base16Schema,
  addressSchema,
  base20Schema,
  base8Schema,
  base32Schema,
  base256Schema,
} from "@ethernauta/core";

export type Block = Input<typeof blockSchema>
export const blockSchema = nullable(
  object({
    number: base16Schema,
    hash: base16Schema,
    parentHash: base16Schema,
    nonce: base8Schema,
    sha3Uncles: base20Schema,
    logsBloom: base256Schema,
    transactionsRoot: base20Schema,
    stateRoot: base20Schema,
    receiptsRoot: base20Schema,
    miner: addressSchema,
    difficulty: base16Schema,
    totalDifficulty: base16Schema,
    extraData: base16Schema,
    size: base16Schema,
    gasLimit: base16Schema,
    gasUsed: base16Schema,
    timestamp: base16Schema,
    transactions: array(base32Schema),
    uncles: array(base16Schema)
  })
)

export type BlockParameter = Input<typeof blockParameterSchema>
export const blockParameterSchema = union([
  base16Schema,
  literal('latest'), literal('earliest'), literal('pending')
])
