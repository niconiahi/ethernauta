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

// Single source of truth for "canonical solidity type name → leaf
// codec factory". Adding a new leaf means adding one entry here; the
// overload's precise return type (CodecFor<K>) and the runtime
// dispatch map (CODEC_MAP) both derive from this object.
const CODECS = {
  address,
  bool,
  string: string_,
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
}

type CodecName = keyof typeof CODECS
type CodecFor<K extends CodecName> = ReturnType<
  (typeof CODECS)[K]
>

const CODEC_MAP: ReadonlyMap<
  string,
  () => AbiCodec<unknown>
> = new Map(Object.entries(CODECS))

// Build an AbiCodec from a canonical solidity type name. When the
// caller passes a string literal that's a known leaf name
// ("address", "uint32", …), TS picks the precise overload and the
// return is `AbiCodec<Address>` / `AbiCodec<Uint32>` / etc. — no
// widening. Dynamic callers (e.g. iterating `entry.types: string[]`
// from the ERC registry) hit the second overload and get
// `AbiCodec<unknown>`. Array suffix `T[]` recurses through array().
// Tuples and nested struct types throw — the registry's flat types
// array doesn't carry sub-component shape, and the caller should
// fall back to the raw-hex render on throw.
export function make_codec<K extends CodecName>(
  _name: K,
): CodecFor<K>
export function make_codec(_name: string): AbiCodec<unknown>
export function make_codec(
  _name: string,
): AbiCodec<unknown> {
  const arr_match = /^(.+)\[\]$/.exec(_name)
  if (arr_match) {
    const [, inner] = arr_match
    invariant(
      inner !== undefined,
      `make_codec: regex matched without group for "${_name}"`,
    )
    return array(make_codec(inner))
  }
  const factory = CODEC_MAP.get(_name)
  if (!factory) {
    throw new Error(
      `make_codec: unsupported solidity type "${_name}" — tuples and nested struct types require codec composition, not name lookup.`,
    )
  }
  return factory()
}
