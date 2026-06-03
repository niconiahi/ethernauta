// L1→L2 ETH deposit through the zkSync Bridgehub.
//
// Canonical sources:
//   - Solidity: `Bridgehub.requestL2TransactionDirect` +
//     `Bridgehub.l2TransactionBaseCost`:
//     https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/bridgehub/Bridgehub.sol
//   - Docs (L1→L2 priority transactions + base-cost
//     computation):
//     https://docs.zksync.io/zksync-protocol/contracts/handling-l1-l2-ops
//
// Composes:
//   - a pre-call read of `Bridgehub.l2TransactionBaseCost`
//     against `l1.reader` for the destination chain's L2 base
//     cost at the current L1 gas price (needed to compute
//     `mintValue = amount + base_cost`)
//   - the thin `requestL2TransactionDirect(_request)` Signable
//     from `bridgehub/methods`, which ABI-encodes the 9-field
//     `L2TransactionRequestDirect` struct + signs via
//     `eth_signTransaction`
//   - `Bridgehub` proxy address lookup by destination L2 chain
//     id via `require_deploy_addresses(l2.chain_id).l1.bridgehub`
//   - L1-side dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L1 tx hash
//
// Param-shape decision (slice 4a). `{ to, amount, l2_gas_limit? }`
// — the verb fills the other seven fields of the
// `L2TransactionRequestDirect` struct with sensible defaults:
//   - `l2Calldata = 0x` — plain ETH credit, no L2-side call.
//   - `l2GasPerPubdataByteLimit = 800n` — fixed at the
//     era-contracts `REQUIRED_L2_GAS_PRICE_PER_PUBDATA`
//     constant; Bridgehub reverts on any other value.
//   - `factoryDeps = []` — no L2 contract deployment.
//   - `refundRecipient = to` — unused L2 gas refunds land back
//     with the recipient.
//   - `l2_gas_limit` defaults to `1_000_000n` (~5.7× the
//     era-contracts `L1_TX_MIN_L2_GAS_BASE = 173_484`
//     minimum, plenty for a plain ETH credit).
// Arbitrary-recipient deposits with non-default retryable /
// gas params route through `send_message` in 4b; the simple
// verb stays simple.
//
// ETH-base-token guard. `send_eth` assumes the destination
// chain pays gas in ETH (`baseToken == 0x…01`). The verb
// throws when the chain has a non-ETH base token — callers
// targeting such a chain use `send_erc20` (4b) with the L2
// ETH representation. Era + Era Sepolia both have ETH as the
// base token, so the guard is a no-op for them; the throw
// prevents future-hyperchain misuse.
//
// Path-2 composition (per M3): the wallet only signs, the
// dapp broadcasts. `eth_sendTransaction` is intentionally not
// used.
//
// Slice 4a of phase 05 — see tmp/plans/05_bridge_package/.

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

const ETH_BASE_TOKEN = parse(
  AddressSchema,
  "0x0000000000000000000000000000000000000001",
)
const EMPTY_CALLDATA = parse(BytesSchema, "0x")
const PUBDATA_BYTE_LIMIT = parse(Uint256Schema, "0x320")
const DEFAULT_L2_GAS_LIMIT = parse(
  Uint256Schema,
  bigint_to_hex(1_000_000n),
)

const ParametersSchema = object({
  to: AddressSchema,
  amount: Uint256Schema,
  l2_gas_limit: optional(Uint256Schema),
})
type Parameters = InferOutput<typeof ParametersSchema>

export function send_eth(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    signer,
    l1,
    l2,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!signer) {
      throw new Error(
        "send_eth requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const deploys = require_deploy_addresses(l2.chain_id)
    if (deploys.l1.baseToken !== ETH_BASE_TOKEN) {
      throw new Error(
        `send_eth: chain ${l2.chain_id} pays gas in a non-ETH base token (${deploys.l1.baseToken}) — use send_erc20 with the L2 ETH representation`,
      )
    }
    const bridgehub = deploys.l1.bridgehub
    const l2_chain_id_numeric = parse(
      Uint256Schema,
      bigint_to_hex(
        BigInt(decode_chain_id(l2.chain_id).reference),
      ),
    )
    const l2_gas_limit =
      parameters.l2_gas_limit ?? DEFAULT_L2_GAS_LIMIT
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
        hex_to_bigint(parameters.amount) +
          hex_to_bigint(base_cost),
      ),
    )
    const signed_transaction =
      await requestL2TransactionDirect([
        {
          chainId: l2_chain_id_numeric,
          mintValue: mint_value,
          l2Contract: parameters.to,
          l2Value: parameters.amount,
          l2Calldata: EMPTY_CALLDATA,
          l2GasLimit: l2_gas_limit,
          l2GasPerPubdataByteLimit: PUBDATA_BYTE_LIMIT,
          factoryDeps: [],
          refundRecipient: parameters.to,
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
