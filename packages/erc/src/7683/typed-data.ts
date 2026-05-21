// https://eips.ethereum.org/EIPS/eip-7683 — gasless order signing.

import type {
  TypedData,
  TypedDataDomain,
  TypedDataField,
} from "@ethernauta/eip/712"

import type { GaslessCrossChainOrder } from "./types"

// Canonical type ordering as defined in the ERC. Wallets and
// settlers must agree byte-for-byte on this list — any
// reordering changes the typeHash and breaks signature
// recovery.
export const GASLESS_CROSS_CHAIN_ORDER_FIELDS: readonly TypedDataField[] =
  [
    { name: "originSettler", type: "address" },
    { name: "user", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "originChainId", type: "uint256" },
    { name: "openDeadline", type: "uint32" },
    { name: "fillDeadline", type: "uint32" },
    { name: "orderDataType", type: "bytes32" },
    { name: "orderData", type: "bytes" },
  ]

export const GASLESS_PRIMARY_TYPE = "GaslessCrossChainOrder"

export function make_gasless_order_typed_data({
  order,
  domain,
}: {
  order: GaslessCrossChainOrder
  domain: TypedDataDomain
}): TypedData {
  return {
    domain,
    primaryType: GASLESS_PRIMARY_TYPE,
    types: {
      [GASLESS_PRIMARY_TYPE]: [
        ...GASLESS_CROSS_CHAIN_ORDER_FIELDS,
      ],
    },
    message: order as unknown as Record<string, unknown>,
  }
}
