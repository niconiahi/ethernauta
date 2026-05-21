// https://eips.ethereum.org/EIPS/eip-4337
// Bundler RPC: estimate gas for a draft UserOperation.

import type { Address } from "@ethernauta/core"
import {
  type Readable,
  type ResolvedReader,
  callSchema,
} from "@ethernauta/transport"
import { parse } from "valibot"

import {
  type EstimateUserOperationGasResult,
  estimateUserOperationGasResultSchema,
  type UserOperation,
  userOperationSchema,
} from "../types"

export function eth_estimateUserOperationGas({
  op,
  entryPoint,
}: {
  op: UserOperation
  entryPoint: Address
}): Readable<EstimateUserOperationGasResult> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<EstimateUserOperationGasResult> => {
    const method = "eth_estimateUserOperationGas"
    const validated = parse(userOperationSchema, op)
    const call = parse(callSchema, [
      method,
      [validated, entryPoint],
    ])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(
      estimateUserOperationGasResultSchema,
      response.result,
    )
  }
}
