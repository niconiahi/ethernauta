import type { Chain } from "@ethernauta/chain"
import type { Readable } from "@ethernauta/transport"

import {
  estimate_1559_fees,
  type Estimate1559FeesParameters,
  type Fees1559,
} from "./estimate-1559-fees"
import { gas_family } from "./families"

export function calculate_gas(
  chain: Chain,
  parameters: Estimate1559FeesParameters,
): Readable<Fees1559> {
  const family = gas_family(chain)
  switch (family) {
    case "1559":
      return estimate_1559_fees(parameters)
    case "op-stack":
      throw new Error(
        "OP-stack gas estimation not yet implemented",
      )
    case "arbitrum":
      throw new Error(
        "Arbitrum gas estimation not yet implemented",
      )
    case "zksync":
      throw new Error(
        "zkSync gas estimation not yet implemented",
      )
  }
}
