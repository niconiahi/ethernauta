import { hash32Schema } from "@ethernauta/core"
import {
  eth_blockNumber,
  eth_getTransactionReceipt,
  receiptInfoSchema,
} from "@ethernauta/eth"
import { hex_to_number } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  number,
  object,
  optional,
  parse,
  pipe,
  tuple,
  union,
} from "valibot"

import type { Trackable } from "./tracker"

const optionsSchema = object({
  confirmations: optional(pipe(number())),
  poll_interval_ms: optional(pipe(number())),
  timeout_ms: optional(pipe(number())),
})
type Options = InferOutput<typeof optionsSchema>

const parametersSchema = union([
  tuple([hash32Schema]),
  tuple([hash32Schema, optionsSchema]),
  object({
    hash: hash32Schema,
    options: optional(optionsSchema),
  }),
])
type Parameters = InferOutput<typeof parametersSchema>

export const confirmedReceiptSchema = object({
  ...receiptInfoSchema.entries,
  confirmations: number(),
})
export type ConfirmedReceipt = InferOutput<
  typeof confirmedReceiptSchema
>

/**
 * Block until a transaction receipt is available and the
 * caller's confirmation threshold has been reached, then
 * return the receipt enriched with the live confirmation
 * count. Throws if `timeout_ms` elapses first.
 *
 * Does not write to the store — pair with `register_transaction`
 * + `set_transaction` (or `watch_transaction`) if you need
 * the lifecycle persisted alongside the wait.
 */
export function wait_for_receipt(
  _parameters: Parameters,
): Trackable<ConfirmedReceipt> {
  return async ([
    transports,
    context,
  ]): Promise<ConfirmedReceipt> => {
    const parameters = parse(parametersSchema, _parameters)
    const { hash, options } = normalize(parameters)
    const required = options.confirmations ?? 1
    const poll_ms = options.poll_interval_ms ?? 2000
    const deadline = options.timeout_ms
      ? Date.now() + options.timeout_ms
      : null

    while (true) {
      if (deadline !== null && Date.now() > deadline) {
        throw new Error(
          `wait_for_receipt: timeout waiting for ${hash}`,
        )
      }
      const receipt = await eth_getTransactionReceipt([
        hash,
      ])([transports, context])
      if (receipt !== null) {
        const current_hex = await eth_blockNumber()([
          transports,
          context,
        ])
        const current = hex_to_number(current_hex)
        const mined = hex_to_number(receipt.blockNumber)
        const have = current - mined + 1
        if (have >= required) {
          return parse(confirmedReceiptSchema, {
            ...receipt,
            confirmations: have,
          })
        }
      }
      await sleep(poll_ms)
    }
  }
}

function normalize(_parameters: Parameters): {
  hash: `0x${string}`
  options: Options
} {
  if (Array.isArray(_parameters)) {
    const [hash, options] = _parameters
    return { hash, options: options ?? {} }
  }
  return {
    hash: _parameters.hash,
    options: _parameters.options ?? {},
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
