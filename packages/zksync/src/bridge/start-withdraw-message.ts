// L2→L1 arbitrary-message initiation through the L1Messenger
// predeploy on zkSync Era.
//
// Canonical sources:
//   - Solidity: `L1Messenger.sendToL1(bytes _message)`
//     (selector `0x62f84b24`):
//     https://github.com/matter-labs/era-contracts/blob/v0.29.2/system-contracts/contracts/L1Messenger.sol
//   - L2 predeploy address (`L2_TO_L1_MESSENGER_SYSTEM_CONTRACT_ADDR =
//     SYSTEM_CONTRACTS_OFFSET + 0x08 = 0x8008`):
//     https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/common/l2-helpers/L2ContractAddresses.sol
//   - Docs (L2→L1 messaging lifecycle, log proofs):
//     https://docs.zksync.io/zksync-protocol/contracts/handling-l1-l2-ops
//
// Composes:
//   - the phase-04 `sendToL1(bytes)` Signable from
//     `@ethernauta/zksync/system-contracts/l1-messenger` —
//     reused verbatim, no bridge-specific binding needed
//   - the `L1_MESSENGER_ADDRESS` predeploy constant from the
//     same phase-04 export — no registry lookup
//   - L2-side dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L2 tx hash
//
// Param-shape decision (slice 4c). `{ message: Bytes }`. Plain
// raw-payload escape hatch — `start_withdraw_eth` /
// `start_withdraw_erc20` provide higher-level surfaces that
// auto-encode the asset transfer payload, but every L2→L1
// message ultimately flows through `L1Messenger.sendToL1`, so
// callers needing arbitrary calldata target it directly.
//
// Path-2 composition (per M3): the wallet only signs, the dapp
// broadcasts. msg.value = 0 — the L1Messenger does not credit
// ETH; ETH withdrawals route through `L2BaseToken.withdraw`
// (see `start_withdraw_eth`).
//
// Mirror of `start_withdraw_message` in
// `@ethernauta/arbitrum/bridge` (which signs `ArbSys.sendTxToL1`
// against the precompile at `0x…0064`).
//
// Slice 4c of phase 05 — see tmp/plans/05_bridge_package/.

import {
  type Bytes,
  BytesSchema,
  type Hash32,
} from "@ethernauta/core"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"
import {
  L1_MESSENGER_ADDRESS,
  sendToL1,
} from "../system-contracts/l1-messenger"

const ParametersSchema = object({
  message: BytesSchema,
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
    const message: Bytes = parameters.message
    const signed_transaction = await sendToL1([message])([
      signer,
      {
        chain_id: l2.chain_id,
        to: L1_MESSENGER_ADDRESS,
      },
    ])
    return eth_sendRawTransaction([signed_transaction])([
      l2.reader,
      { chain_id: l2.chain_id },
    ])
  }
}
