// L2→L1 ETH withdrawal initiation through the OP-stack
// L2StandardBridge predeploy.
//
// Composes:
//   - the thin
//     `withdrawTo(address,address,uint256,uint32,bytes)`
//     Signable binding from
//     `predeploys/l2-standard-bridge/methods`, which encodes
//     calldata + signs via `eth_signTransaction`. The legacy
//     ETH sentinel (`0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000`)
//     rides in the `_l2Token` slot.
//   - L2StandardBridge predeploy address (fixed at
//     `0x4200000000000000000000000000000000000010`)
//   - origin-side (L2) dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L2 tx hash
//
// Path-2 composition (per M3): the wallet only signs, the
// dapp broadcasts. msg.value = `amount` — the L2 ETH is burned
// and the equivalent is later released on L1 by
// `execute_withdraw` after the proof matures.
//
// Slice 2 of phase 05 — see tmp/plans/05_bridge_package/.

import {
  AddressSchema,
  BytesSchema,
  type Hash32,
  Uint32Schema,
  Uint256Schema,
  UintSchema,
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

// https://specs.optimism.io/protocol/predeploys.html#legacy_erc20_eth
const LEGACY_ETH_TOKEN = parse(
  AddressSchema,
  "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
)

const EMPTY_BYTES = parse(BytesSchema, "0x")

const ParametersSchema = object({
  to: AddressSchema,
  amount: Uint256Schema,
  min_gas_limit: Uint32Schema,
  extra_data: optional(BytesSchema),
})
type Parameters = InferOutput<typeof ParametersSchema>

export function start_withdraw_eth(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    signer,
    l2,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!signer) {
      throw new Error(
        "start_withdraw_eth requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const extra_data = parameters.extra_data ?? EMPTY_BYTES
    const signed_transaction = await withdrawTo([
      LEGACY_ETH_TOKEN,
      parameters.to,
      parameters.amount,
      parameters.min_gas_limit,
      extra_data,
    ])([
      signer,
      {
        chain_id: l2.chain_id,
        to: L2_STANDARD_BRIDGE_ADDRESS,
        value: parse(UintSchema, parameters.amount),
      },
    ])
    return eth_sendRawTransaction([signed_transaction])([
      l2.reader,
      { chain_id: l2.chain_id },
    ])
  }
}
