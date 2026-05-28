// https://eips.ethereum.org/EIPS/eip-6492

import { Bytes32Schema } from "@ethernauta/core"
import { parse } from "valibot"

// 32-byte suffix appended to an ERC-6492-wrapped signature.
// Spec: "magicBytes, which MUST be defined as
// 0x6492649264926492649264926492649264926492649264926492649264926492".
// A signature ending in these bytes is interpreted as a
// pre-deploy wrapper; anything else is a standard 1271 or
// EOA signature.
export const MAGIC_BYTES = parse(
  Bytes32Schema,
  "0x6492649264926492649264926492649264926492649264926492649264926492",
)
