// L1→L2 ERC-20 deposit through the zkSync Bridgehub via the
// post-v26 "two bridges" pattern.
//
// Canonical sources:
//   - Solidity: `Bridgehub.requestL2TransactionTwoBridges` +
//     `Bridgehub.l2TransactionBaseCost`:
//     https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/bridgehub/Bridgehub.sol
//   - L1AssetRouter deposit-side payload shape (the
//     `secondBridgeCalldata = abi.encode(l1Token, amount,
//     l2Receiver)` convention the NTV-bridged ERC-20 path
//     expects):
//     https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/bridge/asset-router/L1AssetRouter.sol
//
// Composes:
//   - a pre-call read of `Bridgehub.l2TransactionBaseCost`
//     against `l1.reader` for the destination chain's L2 base
//     cost at the current L1 gas price (needed to compute
//     `mintValue = base_cost`; ERC-20 deposits carry no L2
//     callvalue)
//   - the thin `requestL2TransactionTwoBridges(_request)`
//     Signable from `bridgehub/methods`, which ABI-encodes the
//     9-field `L2TransactionRequestTwoBridgesOuter` struct +
//     signs via `eth_signTransaction`
//   - `Bridgehub` proxy address lookup by destination L2 chain
//     id via `require_deploy_addresses(l2.chain_id).l1.bridgehub`;
//     `L1AssetRouter` address via `.l1.assetRouter` becomes
//     `secondBridgeAddress`
//   - L1-side dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L1 tx hash
//
// Param-shape decision (slice 4b). `{ l1_token, to, amount,
// l2_gas_limit? }` — the verb composes the asset-router payload
// inline (`secondBridgeCalldata = encode_sequence([address,
// uint256, address], [l1_token, amount, to])`) and fills the
// rest of the outer struct with sensible defaults that mirror
// `send_eth`. `secondBridgeValue = 0` because the bridged asset
// is the ERC-20, not ETH. `l2Value = 0` for the same reason.
// `refundRecipient = to`; `l2GasPerPubdataByteLimit = 800n`
// fixed; `l2_gas_limit` defaults to `1_000_000n`.
//
// No pre-call read for asset registration. The L1AssetRouter
// auto-registers ERC-20s on first deposit via the
// `NativeTokenVault.tryRegisterTokenFromBurnData` path — a
// future hyperchain that disables auto-registration would
// require an `getAssetId`-style pre-call mirroring Arbitrum
// 3b's `getGateway` pattern; flag in 03-tracking.md if surfaced.
//
// ETH-base-token guard. Same shape as `send_eth`: L2 gas is paid
// in ETH on ETH-base-token chains, so non-ETH-base hyperchains
// route through a different verb.
//
// Path-2 composition (per M3): the wallet only signs, the
// dapp broadcasts. `eth_sendTransaction` is intentionally not
// used.
//
// Slice 4b of phase 05 — see tmp/plans/05_bridge_package/.

import {
  address as address_codec,
  encode_sequence,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
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
  bytes_to_hex,
  hex_to_bigint,
} from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, optional, parse } from "valibot"
import { require_deploy_addresses } from "../lib/deploy"
import {
  l2TransactionBaseCost,
  requestL2TransactionTwoBridges,
} from "./bridgehub"

const ETH_BASE_TOKEN = parse(
  AddressSchema,
  "0x0000000000000000000000000000000000000001",
)
const ZERO_UINT256 = parse(Uint256Schema, "0x0")
const PUBDATA_BYTE_LIMIT = parse(Uint256Schema, "0x320")
const DEFAULT_L2_GAS_LIMIT = parse(
  Uint256Schema,
  bigint_to_hex(1_000_000n),
)

const ParametersSchema = object({
  l1_token: AddressSchema,
  to: AddressSchema,
  amount: Uint256Schema,
  l2_gas_limit: optional(Uint256Schema),
})
type Parameters = InferOutput<typeof ParametersSchema>

export function send_erc20(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    signer,
    l1,
    l2,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!signer) {
      throw new Error(
        "send_erc20 requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const deploys = require_deploy_addresses(l2.chain_id)
    if (deploys.l1.baseToken !== ETH_BASE_TOKEN) {
      throw new Error(
        `send_erc20: chain ${l2.chain_id} pays gas in a non-ETH base token (${deploys.l1.baseToken}) — L2 gas funding requires a different verb`,
      )
    }
    const bridgehub = deploys.l1.bridgehub
    const asset_router = deploys.l1.assetRouter
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
    const mint_value =
      base_cost_call.decode(base_cost_bytes)
    const second_bridge_calldata = parse(
      BytesSchema,
      bytes_to_hex(
        encode_sequence(
          [
            address_codec(),
            uint256_codec(),
            address_codec(),
          ],
          [
            parameters.l1_token,
            parameters.amount,
            parameters.to,
          ],
        ),
      ),
    )
    const signed_transaction =
      await requestL2TransactionTwoBridges([
        {
          chainId: l2_chain_id_numeric,
          mintValue: mint_value,
          l2Value: ZERO_UINT256,
          l2GasLimit: l2_gas_limit,
          l2GasPerPubdataByteLimit: PUBDATA_BYTE_LIMIT,
          refundRecipient: parameters.to,
          secondBridgeAddress: asset_router,
          secondBridgeValue: ZERO_UINT256,
          secondBridgeCalldata: second_bridge_calldata,
        },
      ])([
        signer,
        {
          chain_id: l1.chain_id,
          to: bridgehub,
          // The ABI decoder returns mint_value as 32-byte-padded
          // hex (`0x00…05af3…`), which Uint256Schema tolerates
          // but UintSchema rejects. Canonicalize via bigint here
          // because this is the only call site that needs it —
          // the struct field above ABI-encodes through
          // `to_bigint`, which doesn't care about padding.
          value: parse(
            UintSchema,
            bigint_to_hex(hex_to_bigint(mint_value)),
          ),
        },
      ])
    return eth_sendRawTransaction([signed_transaction])([
      l1.reader,
      { chain_id: l1.chain_id },
    ])
  }
}
