// https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/common/l2-helpers/L2ContractAddresses.sol
// L2_ASSET_ROUTER_ADDR =
//   USER_CONTRACTS_OFFSET (0x10000) + 0x03 = 0x10003.
// The L2 counterpart of L1AssetRouter; its
// `withdraw(bytes32 assetId, bytes assetData)` entrypoint
// burns the L2 ERC-20 balance and emits the L2→L1 log the
// L1 Nullifier replays at finalize time.

import { AddressSchema } from "@ethernauta/core"
import { parse } from "valibot"

export const L2_ASSET_ROUTER_ADDRESS = parse(
  AddressSchema,
  "0x0000000000000000000000000000000000010003",
)
