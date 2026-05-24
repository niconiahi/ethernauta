import { invariant } from "@ethernauta/utils"

import type { AbiCodec } from "./abi-codec"
import { array } from "./array"
import {
  address,
  bool,
  bytes,
  bytes4,
  bytes8,
  bytes32,
  bytes48,
  bytes65,
  bytes256,
  hash32,
  string_,
  uint,
  uint8,
  uint16,
  uint24,
  uint32,
  uint40,
  uint48,
  uint56,
  uint64,
  uint96,
  uint128,
  uint160,
  uint192,
  uint224,
  uint256,
} from "./leaves"

// Each leaf factory carries its canonical solidity type name in
// the codec's `signature` field — no parallel switch needed. New
// leaves auto-register by being added to this list. `uint` is the
// solidity alias for `uint256`; both factories produce signature
// "uint256" and the Map dedup picks one (semantically identical).
const LEAF_FACTORIES: ReadonlyArray<() => AbiCodec<unknown>> = [
  address,
  bool,
  string_,
  bytes,
  bytes4,
  bytes8,
  bytes32,
  bytes48,
  bytes65,
  bytes256,
  hash32,
  uint,
  uint8,
  uint16,
  uint24,
  uint32,
  uint40,
  uint48,
  uint56,
  uint64,
  uint96,
  uint128,
  uint160,
  uint192,
  uint224,
  uint256,
]

const FACTORY_BY_SIGNATURE: ReadonlyMap<
  string,
  () => AbiCodec<unknown>
> = new Map(LEAF_FACTORIES.map((f) => [f().signature, f]))

// Build an AbiCodec from a canonical solidity type name. Used by
// runtime decoders that only carry type-name strings (e.g. the
// wallet sign view reading types from the ERC selector registry
// or from a sidecar). Tuples and nested struct types are NOT
// supported — the registry's flat `types` array doesn't carry
// sub-component shape; the caller should fall back to the raw-hex
// render on throw.
export function codec_for_type(
  _name: string,
): AbiCodec<unknown> {
  const arr_match = /^(.+)\[\]$/.exec(_name)
  if (arr_match) {
    const [, inner] = arr_match
    invariant(
      inner !== undefined,
      `codec_for_type: regex matched without group for "${_name}"`,
    )
    return array(codec_for_type(inner))
  }
  const factory = FACTORY_BY_SIGNATURE.get(_name)
  if (!factory) {
    throw new Error(
      `codec_for_type: unsupported solidity type "${_name}" — tuples and nested struct types require codec composition, not name lookup.`,
    )
  }
  return factory()
}
