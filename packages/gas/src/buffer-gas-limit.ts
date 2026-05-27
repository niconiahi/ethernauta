import { type Uint, uintSchema } from "@ethernauta/core"
import {
  eth_estimateGas,
  genericTransactionSchema,
} from "@ethernauta/eth"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { bigint_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  minValue,
  number,
  object,
  parse,
  pipe,
} from "valibot"

const multiplierSchema = pipe(number(), minValue(1))

export const bufferGasLimitParametersSchema = object({
  tx: genericTransactionSchema,
  multiplier: multiplierSchema,
})
export type BufferGasLimitParameters = InferOutput<
  typeof bufferGasLimitParametersSchema
>

const MULTIPLIER_PRECISION = 1_000_000n

export function buffer_gas_limit(
  _parameters: BufferGasLimitParameters,
): Readable<Uint> {
  return async (
    resolved: ResolvedReader,
  ): Promise<Uint> => {
    const parameters = parse(
      bufferGasLimitParametersSchema,
      _parameters,
    )
    const estimated = await eth_estimateGas({
      transaction: parameters.tx,
    })(resolved)
    const base = BigInt(estimated)
    const scaled_multiplier = BigInt(
      Math.round(
        parameters.multiplier *
          Number(MULTIPLIER_PRECISION),
      ),
    )
    // ceil(base × multiplier / precision) using integer math
    const numerator = base * scaled_multiplier
    const buffered =
      (numerator + MULTIPLIER_PRECISION - 1n) /
      MULTIPLIER_PRECISION
    return parse(uintSchema, bigint_to_hex(buffered))
  }
}
