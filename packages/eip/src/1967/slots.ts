// https://eips.ethereum.org/EIPS/eip-1967

import { Bytes32Schema } from "@ethernauta/core"
import { parse } from "valibot"

// `keccak256("eip1967.proxy.implementation") - 1`
export const IMPLEMENTATION_SLOT = parse(
  Bytes32Schema,
  "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",
)

// `keccak256("eip1967.proxy.admin") - 1`
export const ADMIN_SLOT = parse(
  Bytes32Schema,
  "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103",
)

// `keccak256("eip1967.proxy.beacon") - 1`
export const BEACON_SLOT = parse(
  Bytes32Schema,
  "0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50",
)
