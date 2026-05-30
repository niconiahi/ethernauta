// https://eips.ethereum.org/EIPS/eip-3668
//
// Decode the `OffchainLookup` custom error from raw revert bytes.
//
// Solidity signature:
//   error OffchainLookup(
//     address sender,
//     string[] urls,
//     bytes callData,
//     bytes4 callbackFunction,
//     bytes extraData
//   )
//
// Selector = keccak256("OffchainLookup(address,string[],bytes,bytes4,bytes)")[0..4]
//          = 0x556f1830  (per the spec)
//
// Returns the parsed error or `null` (NotFound) when the revert is
// anything else (empty revert, Error(string), Panic(uint256), or a
// different custom error), or when the payload after the selector
// is malformed.

import {
  address,
  array,
  bytes,
  bytes4,
  decode_revert_reason,
  string_,
  tuple,
} from "@ethernauta/abi"
import {
  type Bytes,
  BytesSchema,
  type NotFound,
} from "@ethernauta/core"
import { hex_to_bytes } from "@ethernauta/utils"
import { parse } from "valibot"

import {
  type OffchainLookupError,
  OffchainLookupErrorSchema,
} from "./schemas"

const OFFCHAIN_LOOKUP_SELECTOR = parse(
  BytesSchema,
  "0x556f1830",
)

const offchain_lookup_codec = tuple({
  sender: address(),
  urls: array(string_()),
  callData: bytes(),
  callbackFunction: bytes4(),
  extraData: bytes(),
})

export function parse_offchain_lookup_revert(
  _revert_data: Bytes | undefined | null,
): OffchainLookupError | NotFound {
  const reason = decode_revert_reason(_revert_data ?? null)
  if (reason.kind !== "custom") return null
  if (reason.selector !== OFFCHAIN_LOOKUP_SELECTOR)
    return null
  try {
    const decoded = offchain_lookup_codec.decode(
      hex_to_bytes(reason.data),
      0,
    )
    return parse(OffchainLookupErrorSchema, decoded)
  } catch {
    return null
  }
}
