// https://docs.arbitrum.io/build-decentralized-apps/precompiles/reference#nodeinterface
// Arbitrum's `NodeInterface` is a virtual precompile served by the
// Nitro node — bytecode at the address is just `0xfe` (INVALID) to
// satisfy extcodesize > 0; the node intercepts calls and answers
// them in Go. The address is identical on Arbitrum One and Nova.

import { type Address, addressSchema } from "@ethernauta/core"
import { parse } from "valibot"

export const NODE_INTERFACE_PREDEPLOY: Address = parse(
  addressSchema,
  "0x00000000000000000000000000000000000000C8",
)

export const ARB_GAS_INFO_PREDEPLOY: Address = parse(
  addressSchema,
  "0x000000000000000000000000000000000000006C",
)
