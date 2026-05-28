import { type Uint, UintSchema } from "@ethernauta/core"
import {
  eth_estimateGas,
  GenericTransactionSchema,
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

const MultiplierSchema = pipe(number(), minValue(1))

export const BufferGasLimitParametersSchema = object({
  tx: GenericTransactionSchema,
  multiplier: MultiplierSchema,
})
export type BufferGasLimitParameters = InferOutput<
  typeof BufferGasLimitParametersSchema
>

const MULTIPLIER_PRECISION = 1_000_000n

export function buffer_gas_limit(
  _parameters: BufferGasLimitParameters,
): Readable<Uint> {
  return async (
    resolved: ResolvedReader,
  ): Promise<Uint> => {
    const parameters = parse(
      BufferGasLimitParametersSchema,
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
    return parse(UintSchema, bigint_to_hex(buffered))
  }
}
