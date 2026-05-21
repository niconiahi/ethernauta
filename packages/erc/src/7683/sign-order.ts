// https://eips.ethereum.org/EIPS/eip-7683 — gasless order signing.

import type { Bytes } from "@ethernauta/core"
import {
  eth_signTypedData_v4,
  type TypedDataDomain,
} from "@ethernauta/eip/712"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"

import { make_gasless_order_typed_data } from "./typed-data"
import type { GaslessCrossChainOrder } from "./types"

export function sign_gasless_order({
  order,
  domain,
}: {
  order: GaslessCrossChainOrder
  domain: TypedDataDomain
}): Signable<Bytes> {
  return async (resolved: ResolvedSigner) => {
    const typed_data = make_gasless_order_typed_data({
      order,
      domain,
    })
    return eth_signTypedData_v4([order.user, typed_data])(
      resolved,
    )
  }
}
