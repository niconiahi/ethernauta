import { eip155_11155111 } from "@ethernauta/chain"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import {
  createWriter,
  encodeChainId,
  http,
} from "@ethernauta/transport"
import {
  register_transaction,
  watch_transaction,
  type Transaction,
} from "@ethernauta/transaction"
import { number_to_hex } from "@ethernauta/wallet"
import { useEffect, useState } from "react"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://little-bitter-wave.ethereum-sepolia.quiknode.pro/4d40a4c7ec139649d4b1f43f5d536c3756faacc9/"
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

export default function () {
  const [hash, setHash] = useState<`0x${string}` | null>(
    null,
  )
  const [transaction_log, set_transaction_log] = useState<
    Transaction[]
  >([])
  useEffect(() => {
    if (!hash) return
    const transaction = register_transaction(hash)
    set_transaction_log([transaction])
    watch_transaction(hash, (transaction) => {
      set_transaction_log((prev_transaction_logs) => {
        return [...prev_transaction_logs, transaction]
      })
    })
  }, [hash])
  return (
    <div>
      <p>
        <button
          type="button"
          onClick={() => {
            window.wallet.connect()
          }}
        >
          connect
        </button>
      </p>
      <p>
        <button
          type="button"
          onClick={async () => {
            const method = "transfer"
            const ADDRESS =
              "0x515e9e0565fdddd4f8a9759744734154da453585"
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
          }}
        >
          send transfer
        </button>
      </p>
      <ul>
        {transaction_log.map((transaction) => {
          const key = `transaction-${transaction.hash}-${transaction.status}`
          switch (transaction.status) {
            case "mined": {
              return (
                <li key={key}>
                  {transaction.status} at block number{" "}
                  {transaction.blockNumber}
                </li>
              )
            }
            default: {
              return <li key={key}>{transaction.status}</li>
            }
          }
        })}
      </ul>
    </div>
  )
}
