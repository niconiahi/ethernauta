// https://specs.optimism.io/protocol/predeploys.html#l2-erc721-bridge

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const L2_ERC721_BRIDGE_ADDRESS: Address = parse(
  AddressSchema,
  "0x4200000000000000000000000000000000000014",
)
