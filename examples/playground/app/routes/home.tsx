import { eip155_11155111 } from "@ethernauta/chain"
import { transfer } from "@ethernauta/eth"
import {
  register_transaction,
  type Transaction,
  watch_transaction,
} from "@ethernauta/transaction"
import {
  create_writer,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { number_to_hex } from "@ethernauta/wallet"
import { useState } from "react"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://muddy-radial-borough.ethereum-sepolia.quiknode.pro/e0d1ca422dd966c7b388455f296fb1483f738bef/"
const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: NAMESPACE.ETHEREUM,
  reference: eip155_11155111.chainId,
})
const writer = create_writer([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
  },
])

export default function () {
  const [transactions, setTransactions] = useState<
    Transaction[]
  >([])
  const last_transaction =
    transactions[transactions.length - 1]
  return (
    <div className="flex flex-col justify-center h-full p-4 gap-2">
      <button
        type="button"
        className="bg-[#FF5005] border-2 rounded-md p-2 cursor-pointer"
        onClick={() => {
          window.wallet.connect()
        }}
      >
        Connect wallet
      </button>
      <button
        type="button"
        className="bg-[#FF5005] border-2 rounded-md p-2 cursor-pointer"
        onClick={async () => {
          const writable = transfer([
            "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
            number_to_hex(1),
          ])
          const hash = await writable(
            writer(SEPOLIA_CHAIN_ID),
          )
          const transaction = register_transaction(hash)
          setTransactions([transaction])
          watch_transaction(hash, (transaction) => {
            setTransactions((prev_transaction_logs) => {
              return [...prev_transaction_logs, transaction]
            })
          })
        }}
      >
        Send transfer
      </button>
      {last_transaction ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 border-2 rounded-md p-4"
        >
          {render_transaction(last_transaction)}
        </div>
      ) : null}
    </div>
  )
}

function render_transaction(transaction: Transaction) {
  const key = `transaction-${transaction.hash}-${transaction.status}`
  switch (transaction.status) {
    case "pending": {
      return <p key={key}>Your transaction has started</p>
    }
    case "mined": {
      return (
        <p key={key} className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-md border-2 bg-[#0FA05C] border-dashed" />
          Successful transaction
          <a
            href={`https://sepolia.etherscan.io/tx/${transaction.hash}`}
            className="underline"
          >
            See on Etherscan
          </a>
        </p>
      )
    }
    default: {
      return (
        <li key={key}>
          unhandled status: {transaction.status}
        </li>
      )
    }
  }
}
