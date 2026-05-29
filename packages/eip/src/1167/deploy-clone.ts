// https://eips.ethereum.org/EIPS/eip-1167

import {
  type Address,
  AddressSchema,
  type Bytes,
  BytesSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

import {
  INIT_PREFIX,
  RUNTIME_PREFIX,
  RUNTIME_SUFFIX,
} from "./bytecode"

// Returns the creation bytecode (init code + runtime) for an
// EIP-1167 minimal proxy pointing at `target`. The caller
// composes this with `eth_signTransaction` + `eth_sendRawTransaction`
// (path 2) or `eth_sendTransaction` (path 1) to actually deploy.
export function deploy_clone(_target: Address): Bytes {
  const target = parse(AddressSchema, _target)
  const target_hex = target.slice(2).toLowerCase()
  return parse(
    BytesSchema,
    `${INIT_PREFIX}${RUNTIME_PREFIX.slice(2)}${target_hex}${RUNTIME_SUFFIX}`,
  )
}
