// L1→L2 arbitrary message through the zkSync Bridgehub via
// `requestL2TransactionDirect` with non-empty L2 calldata.
// General-purpose deposit primitive for dapps that need an L2
// recipient + callvalue + calldata triple — `send_eth`'s simpler
// shape covers the plain-ETH-credit case; this verb is the path
// for everything else.
//
// Canonical sources:
//   - Solidity: `Bridgehub.requestL2TransactionDirect` +
//     `Bridgehub.l2TransactionBaseCost`:
//     https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/bridgehub/Bridgehub.sol
//   - Docs (L1→L2 priority transactions, base-cost computation,
//     refund convention):
//     https://docs.zksync.io/zksync-protocol/contracts/handling-l1-l2-ops
//
// Composes:
//   - a pre-call read of `Bridgehub.l2TransactionBaseCost`
//     against `l1.reader` at the current L1 gas price (needed
//     to compute `mintValue = l2_value + base_cost`)
//   - the thin `requestL2TransactionDirect(_request)` Signable
//     from `bridgehub/methods`, which ABI-encodes the 9-field
//     `L2TransactionRequestDirect` struct + signs via
//     `eth_signTransaction`
//   - `Bridgehub` proxy address lookup by destination L2 chain
//     id via `require_deploy_addresses(l2.chain_id).l1.bridgehub`
//   - L1-side dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L1 tx hash
//
// Param-shape decision (slice 4b). `{ to, l2_value, l2_calldata,
// l2_gas_limit?, refund_recipient? }` — no simplifying defaults
// beyond the four-field ones from `send_eth`. The dapp computes
// `l2_value` explicitly because the L2 callee may need callvalue
// independent of the L1 caller's intent. `mintValue = l2_value +
// base_cost`. `refundRecipient` defaults to `refund_recipient ??
// to`. Mirror Arbitrum 3b's "no simplifying defaults" decision
// for `createRetryableTicket`.
//
// Path-2 composition (per M3): the wallet only signs, the
// dapp broadcasts. `eth_sendTransaction` is intentionally not
// used.
//
// Slice 4b of phase 05 — see tmp/plans/05_bridge_package/.

import {
  AddressSchema,
  BytesSchema,
  type Hash32,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import {
  eth_call,
  eth_gasPrice,
  eth_sendRawTransaction,
} from "@ethernauta/eth"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import { decode_chain_id } from "@ethernauta/transport"
import {
  bigint_to_hex,
  hex_to_bigint,
} from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, optional, parse } from "valibot"
import { require_deploy_addresses } from "../lib/deploy"
import {
  l2TransactionBaseCost,
  requestL2TransactionDirect,
} from "./bridgehub"

const PUBDATA_BYTE_LIMIT = parse(Uint256Schema, "0x320")
const DEFAULT_L2_GAS_LIMIT = parse(
  Uint256Schema,
  bigint_to_hex(1_000_000n),
)

const ParametersSchema = object({
  to: AddressSchema,
  l2_value: Uint256Schema,
  l2_calldata: BytesSchema,
  l2_gas_limit: optional(Uint256Schema),
  refund_recipient: optional(AddressSchema),
})
type Parameters = InferOutput<typeof ParametersSchema>

export function send_message(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    signer,
    l1,
    l2,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!signer) {
      throw new Error(
        "send_message requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const deploys = require_deploy_addresses(l2.chain_id)
    const bridgehub = deploys.l1.bridgehub
    const l2_chain_id_numeric = parse(
      Uint256Schema,
      bigint_to_hex(
        BigInt(decode_chain_id(l2.chain_id).reference),
      ),
    )
    const l2_gas_limit =
      parameters.l2_gas_limit ?? DEFAULT_L2_GAS_LIMIT
    const refund_recipient =
      parameters.refund_recipient ?? parameters.to
    const l1_gas_price = await eth_gasPrice()([
      l1.reader,
      { chain_id: l1.chain_id },
    ])
    const base_cost_call = l2TransactionBaseCost([
      l2_chain_id_numeric,
      parse(Uint256Schema, l1_gas_price),
      l2_gas_limit,
      PUBDATA_BYTE_LIMIT,
    ])({
      chain_id: l1.chain_id,
      to: bridgehub,
    })
    const base_cost_bytes = await eth_call([
      {
        to: base_cost_call.to,
        input: base_cost_call.data,
      },
    ])([l1.reader, { chain_id: l1.chain_id }])
    const base_cost = base_cost_call.decode(base_cost_bytes)
    const mint_value = parse(
      Uint256Schema,
      bigint_to_hex(
        hex_to_bigint(parameters.l2_value) +
          hex_to_bigint(base_cost),
      ),
    )
    const signed_transaction =
      await requestL2TransactionDirect([
        {
          chainId: l2_chain_id_numeric,
          mintValue: mint_value,
          l2Contract: parameters.to,
          l2Value: parameters.l2_value,
          l2Calldata: parameters.l2_calldata,
          l2GasLimit: l2_gas_limit,
          l2GasPerPubdataByteLimit: PUBDATA_BYTE_LIMIT,
          factoryDeps: [],
          refundRecipient: refund_recipient,
        },
      ])([
        signer,
        {
          chain_id: l1.chain_id,
          to: bridgehub,
          value: parse(UintSchema, mint_value),
        },
      ])
    return eth_sendRawTransaction([signed_transaction])([
      l1.reader,
      { chain_id: l1.chain_id },
    ])
  }
}
