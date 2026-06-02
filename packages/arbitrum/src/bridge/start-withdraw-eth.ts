// L2→L1 ETH withdrawal initiation through the ArbSys precompile.
//
// Canonical sources:
//   - Solidity: `ArbSys.withdrawEth(address destination) payable returns (uint256)`
//     (selector `0x25e16063`):
//     https://github.com/OffchainLabs/nitro-contracts/blob/v3.2.0/src/precompiles/ArbSys.sol
//   - Docs (L2→L1 messaging + 6.4-day confirmation window):
//     https://docs.arbitrum.io/how-arbitrum-works/arbos/l2-to-l1-messaging
//
// Composes:
//   - the thin `withdrawEth(address)` Signable from
//     `precompiles/arb-sys/methods`, which encodes calldata + signs
//     via `eth_signTransaction`
//   - `ArbSys` precompile address (`0x0000000000000000000000000000000000000064`) — no
//     registry lookup since it's an L2 predeploy
//   - L2-side dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L2 tx hash
//
// Path-2 composition (per M3): the wallet only signs, the dapp
// broadcasts. msg.value = `amount` — the L2 ETH is burned and the
// equivalent is later released on L1 by `execute_withdraw` after
// the assertion that covers this batch is confirmed by the Rollup
// contract.
//
// Slice 3c of phase 05 — see tmp/plans/05_bridge_package/.

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
import {
  ARB_SYS_ADDRESS,
  withdrawEth,
} from "../precompiles/arb-sys"

const ParametersSchema = object({
  to: AddressSchema,
  amount: UintSchema,
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
    const signed_transaction = await withdrawEth([
      parameters.to,
    ])([
      signer,
      {
        chain_id: l2.chain_id,
        to: ARB_SYS_ADDRESS,
        value: parameters.amount,
      },
    ])
    return eth_sendRawTransaction([signed_transaction])([
      l2.reader,
      { chain_id: l2.chain_id },
    ])
  }
}
