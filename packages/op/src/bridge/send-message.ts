// L1→L2 arbitrary message through the OP-stack OptimismPortal.
//
// Composes:
//   - the thin
//     `depositTransaction(address,uint256,uint64,bool,bytes)`
//     Signable binding from `optimism-portal/methods`, which
//     encodes calldata + signs via `eth_signTransaction`
//   - OptimismPortalProxy address lookup by destination
//     L2 chain id
//   - origin-side (L1) dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L1 tx hash
//
// Path-2 composition (per M3): the wallet only signs, the
// dapp broadcasts. msg.value mirrors the `_value` ABI
// parameter — the L1 ETH locked equals the L2 mint amount,
// which is the standard case. For a pure no-value message,
// pass `value: 0x0`.
//
// Slice 2 of phase 05 — see tmp/plans/05_bridge_package/.

import {
  AddressSchema,
  BytesSchema,
  type Hash32,
  Uint64Schema,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { boolean, object, parse } from "valibot"
import { require_deploy_addresses } from "../lib/deploy"
import { depositTransaction } from "./optimism-portal"

const ParametersSchema = object({
  to: AddressSchema,
  value: Uint256Schema,
  gas_limit: Uint64Schema,
  is_creation: boolean(),
  data: BytesSchema,
})
type Parameters = InferOutput<typeof ParametersSchema>

export function send_message(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    signer,
    l1,
    l2,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!signer) {
      throw new Error(
        "send_message requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const portal_address = require_deploy_addresses(
      l2.chain_id,
    ).contracts.OptimismPortalProxy
    const signed_transaction = await depositTransaction([
      parameters.to,
      parameters.value,
      parameters.gas_limit,
      parameters.is_creation,
      parameters.data,
    ])([
      signer,
      {
        chain_id: l1.chain_id,
        to: portal_address,
        value: parse(UintSchema, parameters.value),
      },
    ])
    return eth_sendRawTransaction([signed_transaction])([
      l1.reader,
      { chain_id: l1.chain_id },
    ])
  }
}
