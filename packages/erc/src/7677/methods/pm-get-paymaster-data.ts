// https://eips.ethereum.org/EIPS/eip-7677

import { AddressSchema, UintSchema } from "@ethernauta/core"
import {
  CallSchema,
  type Http,
  RpcRequestError,
} from "@ethernauta/transport"
import {
  type InferOutput,
  object,
  optional,
  parse,
} from "valibot"

import {
  ContextSchema,
  type PaymasterData,
  PaymasterDataSchema,
  PaymasterUserOperationSchema,
} from "../paymaster"

export const PmGetPaymasterDataParametersSchema = object({
  userOp: PaymasterUserOperationSchema,
  entryPoint: AddressSchema,
  chainId: UintSchema,
  context: optional(ContextSchema),
})
export type PmGetPaymasterDataParameters = InferOutput<
  typeof PmGetPaymasterDataParametersSchema
>

export function pm_getPaymasterData(
  _parameters: PmGetPaymasterDataParameters,
) {
  return async (resolver: Http): Promise<PaymasterData> => {
    const parameters = parse(
      PmGetPaymasterDataParametersSchema,
      _parameters,
    )
    const call = parse(CallSchema, [
      "pm_getPaymasterData",
      [
        parameters.userOp,
        parameters.entryPoint,
        parameters.chainId,
        parameters.context ?? {},
      ],
    ])
    const response = await resolver(call)
    if ("error" in response) {
      throw new RpcRequestError(response.error)
    }
    return parse(PaymasterDataSchema, response.result)
  }
}
