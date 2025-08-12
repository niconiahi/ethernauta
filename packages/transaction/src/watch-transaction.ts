import { eip155_11155111 } from "@ethernauta/chain"
import {
  eth_getTransactionReceipt,
  type Hash32,
} from "@ethernauta/eth"
import {
  createReader,
  encodeChainId,
  http,
} from "@ethernauta/transport"
import { set_transaction } from "./set-transaction"
import invariant from "./tiny-invariant"
import type {
  MinedTransaction,
  RevertedTransaction,
  Transaction,
} from "./transaction"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://muddy-radial-borough.ethereum-sepolia.quiknode.pro/e0d1ca422dd966c7b388455f296fb1483f738bef/"
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

const POOLING_INTERVAL = 2000
type Callback = (transaction: Transaction) => void
export function watchTransaction(
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
