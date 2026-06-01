// https://github.com/matter-labs/era-contracts/blob/v0.29.2/system-contracts/contracts/Constants.sol

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const CONTRACT_DEPLOYER_ADDRESS: Address = parse(
  AddressSchema,
  "0x0000000000000000000000000000000000008006",
)
