import type { Http, Readable } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, tuple, union } from "valibot"

import {
  addressSchema,
  uint256Schema,
  type Hash32,
} from "../../../core/base"
import { eth_sendRawTransaction } from "../../submit"

const parametersSchema = union([
  tuple([addressSchema, uint256Schema]),
  object({
    to: addressSchema,
    value: uint256Schema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function transfer(
  _parameters: Parameters,
): Readable<Hash32> {
  return async (transports: Http[]): Promise<Hash32> => {
    const method = "transfer"
    const signed_transaction = await window.wallet.sign(
      method,
      _parameters,
    )
    const writable = eth_sendRawTransaction([
      signed_transaction,
    ])
    const hash = await writable(transports)
    return hash
  }
}
