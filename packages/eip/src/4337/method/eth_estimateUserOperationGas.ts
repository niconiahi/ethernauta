// https://eips.ethereum.org/EIPS/eip-4337
// Bundler RPC: estimate gas for a draft UserOperation.

import type { Address } from "@ethernauta/core"
import {
  CallSchema,
  type Readable,
  type ResolvedReader,
} from "@ethernauta/transport"
import { parse } from "valibot"

import {
  type EstimateUserOperationGasResult,
  EstimateUserOperationGasResultSchema,
  type UserOperation,
  UserOperationSchema,
} from "../types"

export function eth_estimateUserOperationGas({
  op,
  entryPoint,
}: {
  op: UserOperation
  entryPoint: Address
}): Readable<EstimateUserOperationGasResult> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<EstimateUserOperationGasResult> => {
    const method = "eth_estimateUserOperationGas"
    const validated = parse(UserOperationSchema, op)
    const call = parse(CallSchema, [
      method,
      [validated, entryPoint],
    ])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(
      EstimateUserOperationGasResultSchema,
      response.result,
    )
  }
}
