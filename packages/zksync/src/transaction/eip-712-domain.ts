// https://docs.zksync.io/zksync-protocol/rollup/transaction-lifecycle#eip-712-0x71-transactions
// EIP-712 domain + Transaction type used to sign zkSync 0x71
// envelopes. Pinned to matter-labs/zksync-era SHA
// 72a0b7c519a82b04fd72dd2bfb513f751bbad161, files
// `core/lib/crypto_primitives/src/eip712_signature/{typed_structure,
// struct_builder,member_types}.rs` and `core/lib/types/src/
// transaction_request.rs`.
//
// The domain is 3-field by design — zkSync deliberately omits
// `verifyingContract` so the same digest is valid across every
// L2 in the family at a given chainId. The type hash is the
// version-2 "Transaction" struct; v1 (string-based) is dead.

import type {
  TypedDataDomain,
  TypedDataField,
  TypedDataTypes,
} from "@ethernauta/eip/712"

export const ZKSYNC_TX_TYPE = 0x71n

export function build_zksync_domain(
  chain_id: bigint,
): TypedDataDomain {
  return {
    name: "zkSync",
    version: "2",
    chainId: chain_id,
  }
}

export const ZKSYNC_TRANSACTION_TYPE: TypedDataField[] = [
  { name: "txType", type: "uint256" },
  { name: "from", type: "uint256" },
  { name: "to", type: "uint256" },
  { name: "gasLimit", type: "uint256" },
  { name: "gasPerPubdataByteLimit", type: "uint256" },
  { name: "maxFeePerGas", type: "uint256" },
  { name: "maxPriorityFeePerGas", type: "uint256" },
  { name: "paymaster", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "value", type: "uint256" },
  { name: "data", type: "bytes" },
  { name: "factoryDeps", type: "bytes32[]" },
  { name: "paymasterInput", type: "bytes" },
]

export const ZKSYNC_TYPED_DATA_TYPES: TypedDataTypes = {
  Transaction: ZKSYNC_TRANSACTION_TYPE,
}
