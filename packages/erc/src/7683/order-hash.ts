// https://eips.ethereum.org/EIPS/eip-7683 — order id derivation.
//
// The spec doesn't mandate one derivation for `orderId` — each
// settler picks. The canonical reference implementation
// (and most production settlers, including Across) uses the
// EIP-712 hash of the gasless order under the settler's
// domain. Confirm against the target settler before treating
// the returned bytes32 as the on-chain orderId.

import { type Hash32, Hash32Schema } from "@ethernauta/core"
import {
  hash_typed_data,
  type TypedDataDomain,
} from "@ethernauta/eip/712"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

import { make_gasless_order_typed_data } from "./typed-data"
import type { GaslessCrossChainOrder } from "./types"

export function hash_gasless_order({
  order,
  domain,
}: {
  order: GaslessCrossChainOrder
  domain: TypedDataDomain
}): Hash32 {
  const typed_data = make_gasless_order_typed_data({
    order,
    domain,
  })
  const digest = hash_typed_data(typed_data)
  return parse(Hash32Schema, bytes_to_hex(digest))
}
