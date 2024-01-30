import type { Input } from "valibot"
import { array, boolean, literal, null_, number, object, optional, parse, string, tuple, union } from "valibot"

import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { base58Schema, base64Schema, commitmentSchema } from "../../core"

const encodedTransactionSchema = union([base64Schema, base58Schema])
const encodingSchema = union([
  literal("base58"),
  literal("base64"),
])
const accountSchema = object({
  addresses: array(base58Schema),
  encoding: union([
    literal("base58"),
    literal("base64"),
    literal("base64+zstd"),
    literal("jsonParsed"),
  ]),
})
const configurationSchema = object({
  commitment: optional(commitmentSchema),
  sigVerify: optional(boolean()),
  replaceRecentBlockhash: optional(boolean()),
  minContextSlot: optional(number()),
  encoding: optional(encodingSchema),
  innerInstructions: optional(boolean()),
  accounts: optional(accountSchema),
})
const parametersSchema = union([
  tuple([encodedTransactionSchema, configurationSchema]),
  tuple([encodedTransactionSchema]),
  object({ transaction: base64Schema, configuration: optional(configurationSchema) }),
])
const contextSchema = object({ apiVersion: string(), slot: number() })
const valueSchema = object({
  err: union([null_(), string()]),
  logs: union([null_(), array(string())]),
  accounts: union([
    null_(),
    union([
      null_(),
      object({
        lamports: number(),
        owner: base58Schema,
        // https://github.com/solana-labs/solana-web3.js/blob/master/packages/library-legacy/src/connection.ts#L928C4-L928C18
        data: array(string()),
        executable: boolean(),
        rentEpoch: optional(number()),
      }),
    ]),
  ]),
  unitsConsumed: optional(number()),
  returnData: optional(
    union([
      null_(),
      object({
        programId: string(),
        data: tuple([string(), literal("base64")]),
      }),
    ]),
  ),
})
const resultSchema = object({
  context: contextSchema,
  value: valueSchema,
})
type Result = Input<typeof resultSchema>
type Parameters = Input<typeof parametersSchema>
/**
 * @returns The account's balance
 */
export function simulateTransaction(_parameters: Parameters): Readable<Result> {
  return async (transports: Http[]): Promise<Result> => {
    const method = "sendTransaction"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map(transport => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(resultSchema, response.result)
  }
}
