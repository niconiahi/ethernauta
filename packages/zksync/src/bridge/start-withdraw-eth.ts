// L2→L1 ETH withdrawal initiation through the L2BaseToken
// predeploy on zkSync Era.
//
// Canonical sources:
//   - Solidity: `L2BaseToken.withdraw(address _l1Receiver) payable`
//     (selector `0x51cff8d9`):
//     https://github.com/matter-labs/era-contracts/blob/v0.29.2/system-contracts/contracts/L2BaseToken.sol
//   - L2 predeploy address (`L2_BASE_TOKEN_SYSTEM_CONTRACT_ADDR =
//     SYSTEM_CONTRACTS_OFFSET + 0x0a = 0x800a`):
//     https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/common/l2-helpers/L2ContractAddresses.sol
//   - Docs (L2→L1 messaging + validity-proof finalization):
//     https://docs.zksync.io/zksync-protocol/contracts/handling-l1-l2-ops
//
// Composes:
//   - the thin `withdraw(address)` Signable from
//     `l2-base-token/methods`, which ABI-encodes calldata + signs
//     via `eth_signTransaction` honoring the `msg.value` carried
//     in the signer context (the binding is payable-aware:
//     `value: context.value ?? 0x0`)
//   - the `L2_BASE_TOKEN_ADDRESS` predeploy constant — no
//     registry lookup since it is fixed on every zkSync-family
//     L2
//   - L2-side dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L2 tx hash
//
// Param-shape decision (slice 4c). `{ to, amount }` — `to` is the
// L1 recipient credited with `amount` ETH on L1 once the
// covering batch is finalized (validity-proof verified). `amount`
// rides as `msg.value` on the L2 burn. No `l2_gas_limit` knob
// (gas is sized by the wallet at sign time per the
// `_ethernauta.function` sidecar pattern).
//
// Path-2 composition (per M3): the wallet only signs, the dapp
// broadcasts. Mirror of `start_withdraw_eth` in
// `@ethernauta/arbitrum/bridge` (which signs `ArbSys.withdrawEth`
// against the precompile at `0x…0064`).
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
import {
  L2_BASE_TOKEN_ADDRESS,
  withdraw,
} from "./l2-base-token"

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
    const signed_transaction = await withdraw([
      parameters.to,
    ])([
      signer,
      {
        chain_id: l2.chain_id,
        to: L2_BASE_TOKEN_ADDRESS,
        value: parameters.amount,
      },
    ])
    return eth_sendRawTransaction([signed_transaction])([
      l2.reader,
      { chain_id: l2.chain_id },
    ])
  }
}
