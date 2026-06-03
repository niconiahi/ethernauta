// L1-side finalization of an L2→L1 withdrawal through the
// zkSync L1Nullifier.
//
// Canonical sources:
//   - Solidity:
//     `L1Nullifier.finalizeDeposit(FinalizeL1DepositParams)`:
//     https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/bridge/L1Nullifier.sol
//   - Docs (L2→L1 messaging + validity-proof finalization):
//     https://docs.zksync.io/zksync-protocol/contracts/handling-l1-l2-ops
//
// Entrypoint decision (slice 4c). Picked `finalizeDeposit` over
// the legacy `finalizeWithdrawal(uint256, uint256, uint256,
// uint16, bytes, bytes32[])`. Post-v26 era-contracts routes all
// L2→L1 unlocks through `finalizeDeposit` — "Deposit" by name
// even for withdrawals because the asset-router treats every
// L2→L1 unlock as the L1-side completion of a prior deposit/
// withdrawal pair. The legacy `finalizeWithdrawal` shape is
// retained for pre-v26 ERC-20 backward compatibility but is not
// the canonical forward path.
//
// Composes:
//   - the thin `finalizeDeposit((uint256,uint256,uint256,address,
//     uint16,bytes,bytes32[]))` Signable from
//     `l1-nullifier/methods`, which ABI-encodes the tuple + signs
//     via `eth_signTransaction`
//   - `L1Nullifier` proxy address lookup by destination L2 chain
//     id via `require_deploy_addresses(l2.chain_id).l1.l1Nullifier`
//   - L1-side dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L1 tx hash
//
// Param-shape decision (slice 4c). `{ proof: MessageProof,
// l2_sender }`. The `MessageProof` carries the six proof fields
// (`chainIdNumeric`, `l2BatchNumber`, `l2MessageIndex`,
// `l2TxNumberInBatch`, `message`, `merkleProof`); `l2_sender` is
// the L2 address that initiated the burn (the L2BaseToken
// predeploy for `start_withdraw_eth`, the L2AssetRouter predeploy
// for `start_withdraw_erc20`, or the user's own L2 address for
// `start_withdraw_message`). Kept as a separate parameter rather
// than baked into `MessageProof` because it is not derivable
// from the proof tree itself — it varies per initiation verb.
//
// Path-2 composition (per M3): the wallet only signs, the dapp
// broadcasts. msg.value = 0 — the proof is validated atomically
// and the L1-locked ETH / ERC-20 is released in one shot. Unlike
// OP there is no separate prove step; the proof is submitted
// inline.
//
// Typed error decoding for the L1Nullifier's
// `WithdrawalAlreadyFinalized` selector (mapped to
// `AlreadyExecuted`) lives in `errors.ts` and is applied at the
// reader layer by `with_zksync_errors`; this verb stays on the
// same one-line broadcast shape as its siblings.
//
// Slice 4c of phase 05 — see tmp/plans/05_bridge_package/.

import {
  AddressSchema,
  type Hash32,
  UintSchema,
} from "@ethernauta/core"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

import { require_deploy_addresses } from "../lib/deploy"
import { finalizeDeposit } from "./l1-nullifier"
import { MessageProofSchema } from "./message-proof"

const ParametersSchema = object({
  proof: MessageProofSchema,
  l2_sender: AddressSchema,
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
    const nullifier = require_deploy_addresses(l2.chain_id)
      .l1.l1Nullifier
    const proof = parameters.proof
    const signed_transaction = await finalizeDeposit([
      {
        chainId: proof.chainIdNumeric,
        l2BatchNumber: proof.l2BatchNumber,
        l2MessageIndex: proof.l2MessageIndex,
        l2Sender: parameters.l2_sender,
        l2TxNumberInBatch: proof.l2TxNumberInBatch,
        message: proof.message,
        merkleProof: proof.merkleProof,
      },
    ])([
      signer,
      {
        chain_id: l1.chain_id,
        to: nullifier,
        value: parse(UintSchema, "0x0"),
      },
    ])
    return eth_sendRawTransaction([signed_transaction])([
      l1.reader,
      { chain_id: l1.chain_id },
    ])
  }
}
