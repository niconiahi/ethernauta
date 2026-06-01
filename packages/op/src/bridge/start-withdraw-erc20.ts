// L2→L1 ERC-20 withdrawal initiation through the OP-stack
// L2StandardBridge predeploy.
//
// Composes:
//   - the thin
//     `withdrawTo(address,address,uint256,uint32,bytes)`
//     Signable binding from
//     `predeploys/l2-standard-bridge/methods`, which encodes
//     calldata + signs via `eth_signTransaction`
//   - L2StandardBridge predeploy address (fixed at
//     `0x4200000000000000000000000000000000000010`)
//   - origin-side (L2) dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L2 tx hash
//
// Path-2 composition (per M3): the wallet only signs, the
// dapp broadcasts. msg.value = 0 — the L2 ERC-20 is burned via
// the bridge's internal call. The L1 counterpart is released
// later by `execute_withdraw` after the proof matures.
//
// Slice 2 of phase 05 — see tmp/plans/05_bridge_package/.

import {
  AddressSchema,
  BytesSchema,
  type Hash32,
  Uint32Schema,
  Uint256Schema,
} from "@ethernauta/core"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, optional, parse } from "valibot"
import {
  L2_STANDARD_BRIDGE_ADDRESS,
  withdrawTo,
} from "../predeploys/l2-standard-bridge"

const EMPTY_BYTES = parse(BytesSchema, "0x")

const ParametersSchema = object({
  l2_token: AddressSchema,
  to: AddressSchema,
  amount: Uint256Schema,
  min_gas_limit: Uint32Schema,
  extra_data: optional(BytesSchema),
})
type Parameters = InferOutput<typeof ParametersSchema>

export function start_withdraw_erc20(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    origin,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!origin.signer) {
      throw new Error(
        "start_withdraw_erc20 requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const extra_data = parameters.extra_data ?? EMPTY_BYTES
    const signed_transaction = await withdrawTo([
      parameters.l2_token,
      parameters.to,
      parameters.amount,
      parameters.min_gas_limit,
      extra_data,
    ])([
      origin.signer,
      {
        chain_id: origin.chain_id,
        to: L2_STANDARD_BRIDGE_ADDRESS,
      },
    ])
    return eth_sendRawTransaction([signed_transaction])([
      origin.reader,
      { chain_id: origin.chain_id },
    ])
  }
}
