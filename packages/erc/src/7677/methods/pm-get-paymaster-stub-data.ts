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
  type PaymasterStubData,
  PaymasterStubDataSchema,
  PaymasterUserOperationSchema,
} from "../paymaster"

export const PmGetPaymasterStubDataParametersSchema =
  object({
    userOp: PaymasterUserOperationSchema,
    entryPoint: AddressSchema,
    chainId: UintSchema,
    context: optional(ContextSchema),
  })
export type PmGetPaymasterStubDataParameters = InferOutput<
  typeof PmGetPaymasterStubDataParametersSchema
>

export function pm_getPaymasterStubData(
  _parameters: PmGetPaymasterStubDataParameters,
) {
  return async (
    resolver: Http,
  ): Promise<PaymasterStubData> => {
    const parameters = parse(
      PmGetPaymasterStubDataParametersSchema,
      _parameters,
    )
    const call = parse(CallSchema, [
      "pm_getPaymasterStubData",
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
    return parse(PaymasterStubDataSchema, response.result)
  }
}
