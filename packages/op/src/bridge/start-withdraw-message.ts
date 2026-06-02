// L2→L1 arbitrary message initiation through the OP-stack
// L2ToL1MessagePasser predeploy.
//
// Composes:
//   - the thin `initiateWithdrawal(address,uint256,bytes)`
//     Signable binding from
//     `l2-to-l1-message-passer/methods`, which encodes
//     calldata + signs via `eth_signTransaction`
//   - L2ToL1MessagePasser predeploy address (fixed at
//     `0x4200000000000000000000000000000000000016`)
//   - origin-side (L2) dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L2 tx hash
//
// Path-2 composition (per M3): the wallet only signs, the
// dapp broadcasts. msg.value mirrors the `value` parameter —
// L2 ETH is burned now and released on L1 by
// `execute_withdraw` after the proof matures. For a pure
// no-value message, pass `value: 0x0`.
//
// Slice 2 of phase 05 — see tmp/plans/05_bridge_package/.

import {
  AddressSchema,
  BytesSchema,
  type Hash32,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"
import {
  initiateWithdrawal,
  L2_TO_L1_MESSAGE_PASSER_ADDRESS,
} from "./l2-to-l1-message-passer"

const ParametersSchema = object({
  to: AddressSchema,
  value: Uint256Schema,
  gas_limit: Uint256Schema,
  data: BytesSchema,
})
type Parameters = InferOutput<typeof ParametersSchema>

export function start_withdraw_message(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    signer,
    l2,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!signer) {
      throw new Error(
        "start_withdraw_message requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const signed_transaction = await initiateWithdrawal([
      parameters.to,
      parameters.gas_limit,
      parameters.data,
    ])([
      signer,
      {
        chain_id: l2.chain_id,
        to: L2_TO_L1_MESSAGE_PASSER_ADDRESS,
        value: parse(UintSchema, parameters.value),
      },
    ])
    return eth_sendRawTransaction([signed_transaction])([
      l2.reader,
      { chain_id: l2.chain_id },
    ])
  }
}
