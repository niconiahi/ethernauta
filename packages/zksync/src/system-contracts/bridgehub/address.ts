// L2 BridgeHub predeploy address.
// https://github.com/matter-labs/era-contracts/blob/v0.29.2/system-contracts/contracts/Constants.sol

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const BRIDGEHUB_L2_ADDRESS: Address = parse(
  AddressSchema,
  "0x0000000000000000000000000000000000010002",
)
