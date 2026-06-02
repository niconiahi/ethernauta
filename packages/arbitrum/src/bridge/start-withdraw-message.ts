// L2→L1 arbitrary message initiation through the ArbSys precompile.
//
// Canonical sources:
//   - Solidity: `ArbSys.sendTxToL1(address destination, bytes data) payable returns (uint256)`
//     (selector `0x928c169a`):
//     https://github.com/OffchainLabs/nitro-contracts/blob/v3.2.0/src/precompiles/ArbSys.sol
//   - Docs (L2→L1 messaging + Outbox replay on L1):
//     https://docs.arbitrum.io/how-arbitrum-works/arbos/l2-to-l1-messaging
//
// Composes:
//   - the thin `sendTxToL1(address,bytes)` Signable from
//     `precompiles/arb-sys/methods`, which encodes calldata + signs
//     via `eth_signTransaction`
//   - `ArbSys` precompile address (`0x0000000000000000000000000000000000000064`) — no
//     registry lookup since it's an L2 predeploy
//   - L2-side dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L2 tx hash
//
// Path-2 composition (per M3): the wallet only signs, the dapp
// broadcasts. msg.value = `value` — any L2 ETH attached is burned
// now and released on L1 alongside the message replay performed by
// `execute_withdraw` once the covering assertion confirms. For a
// pure no-value message, pass `value: 0x0`.
//
// Slice 3c of phase 05 — see tmp/plans/05_bridge_package/.

import {
  AddressSchema,
  BytesSchema,
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
  sendTxToL1,
} from "../precompiles/arb-sys"

const ParametersSchema = object({
  to: AddressSchema,
  value: UintSchema,
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
    const signed_transaction = await sendTxToL1([
      parameters.to,
      parameters.data,
    ])([
      signer,
      {
        chain_id: l2.chain_id,
        to: ARB_SYS_ADDRESS,
        value: parameters.value,
      },
    ])
    return eth_sendRawTransaction([signed_transaction])([
      l2.reader,
      { chain_id: l2.chain_id },
    ])
  }
}
