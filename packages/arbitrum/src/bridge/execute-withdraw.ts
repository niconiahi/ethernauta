// L2→L1 withdrawal finalization through the Arbitrum Outbox.
//
// Canonical sources:
//   - Solidity:
//     `Outbox.executeTransaction(bytes32[] proof, uint256 index, address l2Sender, address to, uint256 l2Block, uint256 l1Block, uint256 l2Timestamp, uint256 value, bytes data)`:
//     https://github.com/OffchainLabs/nitro-contracts/blob/v3.2.0/src/bridge/Outbox.sol
//   - Docs (L2→L1 lifecycle, validity proof, fund release):
//     https://docs.arbitrum.io/how-arbitrum-works/arbos/l2-to-l1-messaging
//
// Composes:
//   - the thin
//     `executeTransaction(bytes32[],uint256,address,address,uint256,uint256,uint256,uint256,bytes)`
//     Signable binding from `outbox/methods`, which encodes
//     calldata + signs via `eth_signTransaction`
//   - Outbox proxy address lookup by L2 chain id via
//     `require_deploy_addresses(l2.chain_id).ethBridge.outbox`
//   - L1-side dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L1 tx hash
//
// Path-2 composition (per M3): the wallet only signs, the dapp
// broadcasts. msg.value = 0 — the proof is validated atomically
// and the L2-locked ETH / calldata is released in one shot.
// Unlike OP there is no separate prove step; the proof is
// submitted inline.
//
// Typed error decoding for the Outbox's known reverts
// (`ProofUnavailable` mapped from upstream selectors) lives in
// `errors.ts` and is applied at the reader layer by
// `with_arbitrum_errors`; this verb stays on the same one-line
// broadcast shape as its siblings.
//
// Slice 3c of phase 05 — see tmp/plans/05_bridge_package/.

import {
  type Hash32,
  Uint256Schema,
} from "@ethernauta/core"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

import { require_deploy_addresses } from "../lib/deploy"
import { MessageProofSchema } from "./message-proof"
import { executeTransaction } from "./outbox"

const ParametersSchema = object({
  proof: MessageProofSchema,
})
type Parameters = InferOutput<typeof ParametersSchema>

export function execute_withdraw(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    signer,
    l1,
    l2,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!signer) {
      throw new Error(
        "execute_withdraw requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const outbox_address = require_deploy_addresses(
      l2.chain_id,
    ).ethBridge.outbox
    const message = parameters.proof.message
    const index = parse(Uint256Schema, message.position)
    const signed_transaction = await executeTransaction([
      parameters.proof.proof,
      index,
      message.l2Sender,
      message.to,
      message.l2Block,
      message.l1Block,
      message.l2Timestamp,
      message.value,
      message.data,
    ])([
      signer,
      {
        chain_id: l1.chain_id,
        to: outbox_address,
      },
    ])
    return eth_sendRawTransaction([signed_transaction])([
      l1.reader,
      { chain_id: l1.chain_id },
    ])
  }
}
