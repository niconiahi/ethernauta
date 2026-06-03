// https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/common/l2-helpers/L2ContractAddresses.sol
// L2_BASE_TOKEN_SYSTEM_CONTRACT_ADDR =
//   SYSTEM_CONTRACTS_OFFSET (0x8000) + 0x0a = 0x800a.
// Holds the L2 ETH balance for ETH-base-token chains; its
// `withdraw(address)` payable entrypoint burns L2 ETH and
// emits the L2→L1 log the L1 verifier replays at finalize time.

import { AddressSchema } from "@ethernauta/core"
import { parse } from "valibot"

export const L2_BASE_TOKEN_ADDRESS = parse(
  AddressSchema,
  "0x000000000000000000000000000000000000800a",
)
