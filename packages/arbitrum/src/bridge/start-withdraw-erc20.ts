// L2→L1 ERC-20 withdrawal initiation through the Arbitrum
// L2GatewayRouter.
//
// Canonical sources:
//   - Solidity: `L2GatewayRouter.outboundTransfer(
//       address _l1Token, address _to, uint256 _amount, bytes _data
//     )` (selector `0x7b3a3c8b`):
//     https://github.com/OffchainLabs/token-bridge-contracts/blob/v1.2.5/contracts/tokenbridge/arbitrum/gateway/L2GatewayRouter.sol
//   - Docs (standard L2→L1 token bridge + Outbox lifecycle):
//     https://docs.arbitrum.io/build-decentralized-apps/token-bridging/standard-bridge-erc20
//
// Composes:
//   - the thin `outboundTransfer(address,address,uint256,bytes)`
//     Signable binding (overload selector `0x7b3a3c8b`) from
//     `l2-gateway-router/methods`, which encodes calldata + signs
//     via `eth_signTransaction`
//   - `L2GatewayRouter` address lookup by L2 chain id via
//     `require_deploy_addresses(l2.chain_id).contracts.l2GatewayRouter`.
//     Unlike OP's `L2StandardBridge` (a fixed predeploy at the same
//     address on every chain), Arbitrum's L2 router lives at a
//     per-chain address — the registry is the single source of truth.
//   - L2-side dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L2 tx hash
//
// Path-2 composition (per M3): the wallet only signs, the dapp
// broadcasts. msg.value = 0 — the L2 ERC-20 is burned through the
// gateway's internal call; the L1 counterpart is released later by
// `execute_withdraw` after the covering assertion confirms.
//
// The `data` field is the gateway-specific payload. Standard
// gateways accept `0x` (empty) and the verb defaults to that.
// Callers targeting a custom gateway pass their own payload.
//
// Slice 3c of phase 05 — see tmp/plans/05_bridge_package/.

import {
  AddressSchema,
  BytesSchema,
  type Hash32,
  Uint256Schema,
} from "@ethernauta/core"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, optional, parse } from "valibot"
import { require_deploy_addresses } from "../lib/deploy"
import { outboundTransfer_7b3a3c8b } from "./l2-gateway-router"

const EMPTY_BYTES = parse(BytesSchema, "0x")

const ParametersSchema = object({
  l1_token: AddressSchema,
  to: AddressSchema,
  amount: Uint256Schema,
  data: optional(BytesSchema),
})
type Parameters = InferOutput<typeof ParametersSchema>

export function start_withdraw_erc20(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    signer,
    l2,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!signer) {
      throw new Error(
        "start_withdraw_erc20 requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const deploys = require_deploy_addresses(l2.chain_id)
    if (!deploys.contracts) {
      throw new Error(
        `start_withdraw_erc20: chain ${l2.chain_id} is missing the bridge address registry — populate ArbitrumDeploys.contracts in packages/arbitrum/src/deploys/`,
      )
    }
    const router_address = deploys.contracts.l2GatewayRouter
    const data = parameters.data ?? EMPTY_BYTES
    const signed_transaction =
      await outboundTransfer_7b3a3c8b([
        parameters.l1_token,
        parameters.to,
        parameters.amount,
        data,
      ])([
        signer,
        {
          chain_id: l2.chain_id,
          to: router_address,
        },
      ])
    return eth_sendRawTransaction([signed_transaction])([
      l2.reader,
      { chain_id: l2.chain_id },
    ])
  }
}
