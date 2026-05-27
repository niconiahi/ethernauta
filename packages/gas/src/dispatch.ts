// `calculate_gas` is the public dispatch surface. Reads the chain's
// family ("1559" / "op-stack" / "arbitrum" / "zksync") and routes
// the matching `kind`-tagged input to the family helper. The
// runtime kind/family check exists because TS can't statically
// prove the caller passed the right shape for the chain — a silent
// mismatch would feed missing fields into the wrong estimator.

import type { Chain } from "@ethernauta/chain"
import type { Readable } from "@ethernauta/transport"
import { parse } from "valibot"

import { calculate_gas_arbitrum } from "./chains/arbitrum/calculate-gas-arbitrum"
import { calculate_gas_op_stack } from "./chains/op-stack/calculate-gas-op-stack"
import { calculate_gas_zksync } from "./chains/zksync/calculate-gas-zksync"
import { estimate_1559_fees } from "./estimate-1559-fees"
import { gas_family } from "./families"
import {
  type CalculateGasFees,
  calculateGasFeesSchema,
} from "./fees"
import type { CalculateGasParameters } from "./parameters"

export function calculate_gas(
  chain: Chain,
  parameters: CalculateGasParameters,
): Readable<CalculateGasFees> {
  const family = gas_family(chain)
  switch (family) {
    case "1559": {
      if (parameters.kind !== "1559")
        throw new Error(
          `1559 family requires kind: "1559", got "${parameters.kind}"`,
        )
      return async (resolved) => {
        const fees = await estimate_1559_fees(parameters)(
          resolved,
        )
        return parse(calculateGasFeesSchema, {
          kind: "1559",
          ...fees,
        })
      }
    }
    case "op-stack": {
      if (parameters.kind !== "op-stack")
        throw new Error(
          `op-stack family requires kind: "op-stack", got "${parameters.kind}"`,
        )
      return calculate_gas_op_stack(parameters)
    }
    case "arbitrum": {
      if (parameters.kind !== "arbitrum")
        throw new Error(
          `arbitrum family requires kind: "arbitrum", got "${parameters.kind}"`,
        )
      return calculate_gas_arbitrum(parameters)
    }
    case "zksync": {
      if (parameters.kind !== "zksync")
        throw new Error(
          `zksync family requires kind: "zksync", got "${parameters.kind}"`,
        )
      return calculate_gas_zksync(parameters)
    }
  }
}
