import { eip155_11155111 } from "@ethernauta/chain"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import {
  register_transaction,
  type Transaction,
  watch_transaction,
} from "@ethernauta/transaction"
import {
  createWriter,
  encodeChainId,
  http,
} from "@ethernauta/transport"
import { number_to_hex } from "@ethernauta/wallet"
import { useEffect, useRef, useState } from "react"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://muddy-radial-borough.ethereum-sepolia.quiknode.pro/e0d1ca422dd966c7b388455f296fb1483f738bef/"
const SEPOLIA_CHAIN_ID = encodeChainId({
  namespace: NAMESPACE.ETHEREUM,
  reference: eip155_11155111.chainId,
})
const writer = createWriter([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
  },
])

// green #0FA05C

export default function () {
  const [hash, setHash] = useState<`0x${string}` | null>(
    null,
  )
  const [transaction_log, set_transaction_log] = useState<
    Transaction[]
  >([])
  const popover_ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!hash) return
    watch_transaction(hash, (transaction) => {
      set_transaction_log((prev_transaction_logs) => {
        return [...prev_transaction_logs, transaction]
      })
    })
  }, [hash])
  const last_transaction =
    transaction_log[transaction_log.length - 1]
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
          const method = "transfer"
          const ADDRESS =
            "0x636c0fcd6da2207abfa80427b556695a4ad0af94"
          const params = [ADDRESS, number_to_hex(1)]
          const signed_transaction =
            await window.wallet.sign(method, params)
          const writable = eth_sendRawTransaction([
            signed_transaction,
          ])
          const hash = await writable(
            writer(SEPOLIA_CHAIN_ID),
          )
          setHash(hash)
          const transaction = register_transaction(hash)
          set_transaction_log([transaction])
          popover_ref.current?.showPopover()
        }}
      >
        Send transfer
      </button>
      {transaction_log.length > 0 ? (
        <div
          ref={popover_ref}
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 border-2 rounded-md p-4"
        >
          {render_transaction(
            last_transaction as Transaction,
          )}
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
          <div className="w-4 h-4 rounded-md border-2 bg-[#0FA05C] border-dashed" />
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
