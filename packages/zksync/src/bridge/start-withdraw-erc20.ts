// L2→L1 ERC-20 withdrawal initiation through the L2AssetRouter
// predeploy on zkSync Era (post-v26 NTV-bridged ERC-20 path).
//
// Canonical sources:
//   - Solidity: `L2AssetRouter.withdraw(bytes32 _assetId, bytes _assetData)`
//     (selector `0x4a2e35ba`):
//     https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/bridge/asset-router/L2AssetRouter.sol
//   - L1AssetRouter / NativeTokenVault assetId derivation:
//     https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/bridge/asset-router/L1AssetRouter.sol
//   - L2 predeploy addresses (`L2_ASSET_ROUTER_ADDR =
//     USER_CONTRACTS_OFFSET + 0x03 = 0x10003`,
//     `L2_NATIVE_TOKEN_VAULT_ADDR = USER_CONTRACTS_OFFSET + 0x04 =
//     0x10004`):
//     https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/common/l2-helpers/L2ContractAddresses.sol
//
// Composes:
//   - inline `assetId` derivation —
//     `keccak256(abi.encode(L1_CHAIN_ID, L2_NATIVE_TOKEN_VAULT_ADDR,
//     l1_token))`. The L1 chain id is the domain separator the
//     NativeTokenVault uses to register the L1 ERC-20 contract;
//     it must match the L1 side so the L1Nullifier finalize-deposit
//     replay credits the correct token. Read from the registry as
//     `require_deploy_addresses(l2.chain_id).parentChainId`.
//   - inline `_assetData` payload —
//     `encode_sequence([uint256, address, address], [amount, to,
//     l1_token])`, matching the L1Nullifier's NTV-bridged ERC-20
//     unlock decoding.
//   - the thin `withdraw(bytes32,bytes)` Signable from
//     `l2-asset-router/methods/withdraw_4a2e35ba`, which
//     ABI-encodes calldata + signs via `eth_signTransaction` with
//     `msg.value = 0` (the bridged asset is the ERC-20).
//   - the `L2_ASSET_ROUTER_ADDRESS` predeploy constant — no
//     registry lookup since it is fixed on every zkSync-family
//     L2.
//   - L2-side dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L2 tx hash.
//
// Param-shape decision (slice 4c). `{ l1_token, to, amount }` —
// `to` is the L1 recipient credited with the ERC-20 once the
// covering batch is finalized. Mirror of `start_withdraw_erc20`
// in `@ethernauta/arbitrum/bridge` (which signs the
// `outboundTransfer(address,address,uint256,bytes)` overload on
// the L2GatewayRouter).
//
// Path-2 composition (per M3): the wallet only signs, the dapp
// broadcasts. The L2 burn emits the L2→L1 log the L1Nullifier
// replays at `execute_withdraw` time.
//
// Slice 4c of phase 05 — see tmp/plans/05_bridge_package/.

import {
  address as address_codec,
  encode_sequence,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  type Hash32,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import {
  bigint_to_hex,
  bytes_to_hex,
} from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"
import { require_deploy_addresses } from "../lib/deploy"
import {
  L2_ASSET_ROUTER_ADDRESS,
  withdraw_4a2e35ba,
} from "./l2-asset-router"

// L2_NATIVE_TOKEN_VAULT_ADDR — inlined here because the verb is
// the sole consumer; it does not warrant its own re-exported
// constant alongside `L2_ASSET_ROUTER_ADDRESS` /
// `L2_BASE_TOKEN_ADDRESS`.
const L2_NATIVE_TOKEN_VAULT_ADDRESS = parse(
  AddressSchema,
  "0x0000000000000000000000000000000000010004",
)

const ParametersSchema = object({
  l1_token: AddressSchema,
  to: AddressSchema,
  amount: Uint256Schema,
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
    const l1_chain_id = parse(
      Uint256Schema,
      bigint_to_hex(BigInt(deploys.parentChainId)),
    )
    const asset_id_preimage = encode_sequence(
      [uint256_codec(), address_codec(), address_codec()],
      [
        l1_chain_id,
        L2_NATIVE_TOKEN_VAULT_ADDRESS,
        parameters.l1_token,
      ],
    )
    const asset_id = parse(
      Bytes32Schema,
      bytes_to_hex(keccak_256(asset_id_preimage)),
    )
    const asset_data = parse(
      BytesSchema,
      bytes_to_hex(
        encode_sequence(
          [
            uint256_codec(),
            address_codec(),
            address_codec(),
          ],
          [
            parameters.amount,
            parameters.to,
            parameters.l1_token,
          ],
        ),
      ),
    )
    const signed_transaction = await withdraw_4a2e35ba([
      asset_id,
      asset_data,
    ])([
      signer,
      {
        chain_id: l2.chain_id,
        to: L2_ASSET_ROUTER_ADDRESS,
        value: parse(UintSchema, "0x0"),
      },
    ])
    return eth_sendRawTransaction([signed_transaction])([
      l2.reader,
      { chain_id: l2.chain_id },
    ])
  }
}
