import * as v from "valibot"
import { eth_getTransactionReceipt } from "@ethernauta/eth"
import { encodeChainId } from "@ethernauta/transport"
import { eip155_11155111 } from "@ethernauta/chain"
import { createReader } from "@ethernauta/transport"
import { http } from "@ethernauta/transport"
import invariant from "./tiny-invariant"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://little-bitter-wave.ethereum-sepolia.quiknode.pro/4d40a4c7ec139649d4b1f43f5d536c3756faacc9/"
const sepolia_chain_id = encodeChainId({
  namespace: NAMESPACE.ETHEREUM,
  reference: eip155_11155111.chainId,
})
const reader = createReader([
  {
    chainId: sepolia_chain_id,
    transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
  },
])

function hex_to_number(hex: `0x${string}`): number {
  return Number(hex)
}

function isHash32(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x[0-9a-f]{64}$/.test(input)
  )
}
const Hash32Schema = v.custom<`0x${string}`>(isHash32)
export type Hash32 = v.InferOutput<typeof Hash32Schema>

export const PendingTransactionSchema = v.object({
  hash: Hash32Schema,
  status: v.literal("pending"),
})
export const MinedTransactionSchema = v.object({
  hash: Hash32Schema,
  status: v.literal("mined"),
  blockNumber: v.number(),
  blockHash: Hash32Schema,
  gasUsed: v.string(),
})
// export const ConfirmedTransactionSchema = v.object({
//   hash: Hash32Schema,
//   status: v.literal("confirmed"),
//   blockNumber: v.number(),
//   blockHash: Hash32Schema,
//   gasUsed: v.string(),
//   confirmations: v.number(),
// })
export const RevertedTransactionSchema = v.object({
  hash: Hash32Schema,
  status: v.literal("reverted"),
  blockNumber: v.number(),
  blockHash: Hash32Schema,
  gasUsed: v.string(),
})
export const TransactionSchema = v.union([
  PendingTransactionSchema,
  MinedTransactionSchema,
  // ConfirmedTransactionSchema,
  RevertedTransactionSchema,
])

export type PendingTransaction = v.InferOutput<
  typeof PendingTransactionSchema
>
export type MinedTransaction = v.InferOutput<
  typeof MinedTransactionSchema
>
// export type ConfirmedTransaction = v.InferOutput<
//   typeof ConfirmedTransactionSchema
// >
export type RevertedTransaction = v.InferOutput<
  typeof RevertedTransactionSchema
>
export type Transaction = v.InferOutput<
  typeof TransactionSchema
>

declare global {
  interface Window {
    transactions: Map<Hash32, Transaction>
  }
}

export function register_transaction(
  hash: PendingTransaction["hash"],
) {
  // TODO: inject a "store" that will implement a "set" method
  // to store the transaction -- any key store should do it
  if (!window.transactions) {
    window.transactions = new Map<Hash32, Transaction>()
  }
  const transaction: PendingTransaction = {
    hash,
    status: "pending",
  }
  window.transactions.set(hash, transaction)
  return transaction
}

export function set_transaction(transaction: Transaction) {
  // TODO: inject a "store" that will implement a "set" method
  // to store the transaction -- any key store should do it
  if (!window.transactions) {
    window.transactions = new Map<Hash32, Transaction>()
  }
  window.transactions.set(transaction.hash, transaction)
}

const POOLING_INTERVAL = 2000

type Callback = (transaction: Transaction) => void
export function watch_transaction(
  hash: Hash32,
  callback: Callback,
) {
  const interval_id = setInterval(async () => {
    const readable = eth_getTransactionReceipt([hash])
    const receipt = await readable(reader(sepolia_chain_id))
    if (!receipt) return // transaction still pending
    invariant(
      receipt.status,
      "status should exist as the transaction was created after Byzantium update",
    )
    const status = hex_to_number(receipt.status)
    switch (status) {
      case 1: {
        const transaction: MinedTransaction = {
          blockHash: receipt.blockHash,
          blockNumber: hex_to_number(receipt.blockNumber),
          gasUsed: receipt.gasUsed,
          hash,
          status: "mined",
        }
        set_transaction(transaction)
        callback(transaction)
        clearInterval(interval_id)
        break
      }
      case 0: {
        const transaction: RevertedTransaction = {
          blockHash: receipt.blockHash,
          blockNumber: hex_to_number(receipt.blockNumber),
          gasUsed: receipt.gasUsed,
          hash,
          status: "reverted",
        }
        set_transaction(transaction)
        callback(transaction)
        clearInterval(interval_id)
        break
      }
    }
  }, POOLING_INTERVAL)
}
