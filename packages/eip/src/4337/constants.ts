// https://eips.ethereum.org/EIPS/eip-4337
//
// Canonical EntryPoint v0.7 deployment. Same address on
// every chain via CREATE2 + a deterministic deployer salt.

import { AddressSchema } from "@ethernauta/core"
import { parse } from "valibot"

export const ENTRY_POINT_V07_ADDRESS = parse(
  AddressSchema,
  "0x0000000071727De22E5E9d8BAf0edAc6f37da032",
)

export const ENTRY_POINT_V06_ADDRESS = parse(
  AddressSchema,
  "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
)
