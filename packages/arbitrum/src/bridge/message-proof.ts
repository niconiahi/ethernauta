// L2→L1 withdrawal proof bundle — schema + builder.
//
// `MessageProofSchema` shapes the bundle a dapp needs to redeem
// a withdrawal on L1; `fetch_message_proof` is the read-only
// verb that builds one from chain state. Both live here because
// the bundle and its construction are the same concern.
//
// Canonical sources:
//   - L2→L1 lifecycle + Outbox redemption:
//     https://docs.arbitrum.io/how-arbitrum-works/arbos/l2-to-l1-messaging
//   - Solidity:
//     `Outbox.executeTransaction(bytes32[] proof, uint256 index, address l2Sender, address to, uint256 l2Block, uint256 l1Block, uint256 l2Timestamp, uint256 value, bytes data)`:
//     https://github.com/OffchainLabs/nitro-contracts/blob/v3.2.0/src/bridge/Outbox.sol
//   - Solidity:
//     `NodeInterface.constructOutboxProof(uint64 size, uint64 leaf) returns (bytes32 send, bytes32 root, bytes32[] proof)`:
//     https://github.com/OffchainLabs/nitro-contracts/blob/v3.2.0/src/node-interface/NodeInterface.sol
//   - Solidity:
//     `ArbSys.sendMerkleTreeState() returns (uint256 size, bytes32 root, bytes32[] partials)`:
//     https://github.com/OffchainLabs/nitro-contracts/blob/v3.2.0/src/precompiles/ArbSys.sol
//
// Bundle shape:
//   - `message` — the canonical fields the L2 `ArbSys.L2ToL1Tx`
//     event emitted at withdraw-initiation time. The dapp extracts
//     them from the L2 receipt; they are replayed verbatim on L1
//     by `execute_withdraw`.
//   - `proof` — the merkle siblings produced by
//     `NodeInterface.constructOutboxProof`. Passes straight into
//     `Outbox.executeTransaction`'s first argument.
//   - `sendRoot` — the merkle root the proof anchors to. L1
//     confirms publication by reading `Outbox.roots(sendRoot)`;
//     a non-zero return means the covering Rollup assertion has
//     been confirmed and the message is executable.
//   - `sendCount` — the send-tree size at proof time. Carried so
//     callers + `get_status` can reason about the assertion that
//     covered this proof.
//
// `fetch_message_proof` composes:
//   - L2 read: `ArbSys.sendMerkleTreeState()` to learn the
//     current tree size.
//   - L2 read: `NodeInterface.constructOutboxProof(size, position)`
//     against the picked size + the message's leaf position to
//     derive `(send, root, proof)`.
//   - L1 read: `Outbox.roots(root)` — a zero return means the
//     covering Rollup assertion is not yet confirmed and the
//     withdrawal is still in the confirmation window. The verb
//     throws in that case; `get_status` reports `confirming` for
//     the same condition so the dapp can poll until the proof
//     becomes available.
//
// Path-2 composition (per M3): pure JS + RPC reads; no signer
// touched. The bundle is the dapp's hand-off to `execute_withdraw`,
// which then asks the wallet to sign the L1 Outbox call.
//
// Slice 3c of phase 05 — see tmp/plans/05_bridge_package/.

import {
  type Address,
  AddressSchema,
  type Bytes32,
  Bytes32Schema,
  BytesSchema,
  type Uint64,
  Uint64Schema,
  type Uint256,
  Uint256Schema,
} from "@ethernauta/core"
import { eth_call } from "@ethernauta/eth"
import type {
  Bridgeable,
  ChainId,
  Reader,
  ResolvedBridge,
} from "@ethernauta/transport"
import {
  bigint_to_hex,
  hex_to_bigint,
} from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { array, object, parse } from "valibot"

import { require_deploy_addresses } from "../lib/deploy"
import {
  ARB_SYS_ADDRESS,
  sendMerkleTreeState,
} from "../precompiles/arb-sys"
import {
  constructOutboxProof,
  NODE_INTERFACE_ADDRESS,
} from "../precompiles/node-interface"
import { roots } from "./outbox"

export const WithdrawalTransactionSchema = object({
  position: Uint64Schema,
  l2Sender: AddressSchema,
  to: AddressSchema,
  l2Block: Uint256Schema,
  l1Block: Uint256Schema,
  l2Timestamp: Uint256Schema,
  value: Uint256Schema,
  data: BytesSchema,
})
export type WithdrawalTransaction = InferOutput<
  typeof WithdrawalTransactionSchema
>

export const MessageProofSchema = object({
  message: WithdrawalTransactionSchema,
  proof: array(Bytes32Schema),
  sendRoot: Bytes32Schema,
  sendCount: Uint64Schema,
})
export type MessageProof = InferOutput<
  typeof MessageProofSchema
>

const ParametersSchema = object({
  message: WithdrawalTransactionSchema,
})
type Parameters = InferOutput<typeof ParametersSchema>

const ZERO_BYTES32 = parse(
  Bytes32Schema,
  `0x${"0".repeat(64)}`,
)

export function fetch_message_proof(
  _parameters: Parameters,
): Bridgeable<MessageProof> {
  return async ({
    l1,
    l2,
  }: ResolvedBridge): Promise<MessageProof> => {
    const parameters = parse(ParametersSchema, _parameters)
    const outbox_address = require_deploy_addresses(
      l2.chain_id,
    ).ethBridge.outbox
    const size = await read_send_tree_size({
      reader: l2.reader,
      chain_id: l2.chain_id,
    })
    const [, send_root, proof_nodes] =
      await read_outbox_proof({
        reader: l2.reader,
        chain_id: l2.chain_id,
        size,
        leaf: parameters.message.position,
      })
    await assert_root_confirmed({
      reader: l1.reader,
      chain_id: l1.chain_id,
      outbox_address,
      send_root,
    })
    return parse(MessageProofSchema, {
      message: parameters.message,
      proof: proof_nodes,
      sendRoot: send_root,
      sendCount: size,
    })
  }
}

async function read_send_tree_size(input: {
  reader: Reader
  chain_id: ChainId
}): Promise<Uint64> {
  const call = sendMerkleTreeState()({
    chain_id: input.chain_id,
    to: ARB_SYS_ADDRESS,
  })
  const bytes = await eth_call([
    { to: call.to, input: call.data },
  ])([input.reader, { chain_id: input.chain_id }])
  const [size_uint256] = call.decode(bytes)
  return uint256_to_uint64(size_uint256)
}

async function read_outbox_proof(input: {
  reader: Reader
  chain_id: ChainId
  size: Uint64
  leaf: Uint64
}): Promise<[Bytes32, Bytes32, Bytes32[]]> {
  const call = constructOutboxProof([
    input.size,
    input.leaf,
  ])({
    chain_id: input.chain_id,
    to: NODE_INTERFACE_ADDRESS,
  })
  const bytes = await eth_call([
    { to: call.to, input: call.data },
  ])([input.reader, { chain_id: input.chain_id }])
  return call.decode(bytes)
}

async function assert_root_confirmed(input: {
  reader: Reader
  chain_id: ChainId
  outbox_address: Address
  send_root: Bytes32
}): Promise<void> {
  const call = roots([input.send_root])({
    chain_id: input.chain_id,
    to: input.outbox_address,
  })
  const bytes = await eth_call([
    { to: call.to, input: call.data },
  ])([input.reader, { chain_id: input.chain_id }])
  const decoded = call.decode(bytes)
  if (decoded === ZERO_BYTES32) {
    throw new Error(
      "fetch_message_proof: no confirmed Rollup assertion covers this withdrawal yet — the send-root is not in Outbox.roots",
    )
  }
}

function uint256_to_uint64(value: Uint256): Uint64 {
  return parse(
    Uint64Schema,
    bigint_to_hex(hex_to_bigint(value)),
  )
}
