// https://eips.ethereum.org/EIPS/eip-1271

import { Bytes4Schema } from "@ethernauta/core"
import { parse } from "valibot"

// `bytes4(keccak256("isValidSignature(bytes32,bytes)"))`.
// Returned by a compliant contract when the supplied
// signature is valid; also doubles as the function
// selector for the call itself.
export const MAGIC_VALUE = parse(Bytes4Schema, "0x1626ba7e")
