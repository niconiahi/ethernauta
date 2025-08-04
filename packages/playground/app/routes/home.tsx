import { eip155_11155111 } from "@cryptoman/chain"
import { eth_sendRawTransaction } from "@cryptoman/eth"
import {
  createWriter,
  encodeChainId,
  get_transaction,
  http,
  watch_transaction,
} from "@cryptoman/transport"
import { number_to_hex } from "@cryptoman/wallet"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://little-bitter-wave.ethereum-sepolia.quiknode.pro/4d40a4c7ec139649d4b1f43f5d536c3756faacc9/"
const sepolia_chain_id = encodeChainId({
  namespace: NAMESPACE.ETHEREUM,
  reference: eip155_11155111.chainId,
})
const writer = createWriter([
  {
    chainId: sepolia_chain_id,
    transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
  },
])

export default function() {
  return (
    <div>
      <p>
        <button
          type="button"
          onClick={() => {
            window.cryptoman.connect()
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
              "0x636C0fCd6DA2207aBfA80427b556695A4ad0AF94"
            const params = [ADDRESS, number_to_hex(1)]
            const signed_transaction =
              await window.cryptoman.sign(method, params)
            const writable = eth_sendRawTransaction([
              signed_transaction,
            ])
            await writable(writer(sepolia_chain_id))
            // "transaction" is a snapshot of transaction
            // at the time of calling "get_transaction"
            const transaction = get_transaction(
              signed_transaction,
            )
            watch_transaction(
              signed_transaction,
              // a new "transaction" is returned every time
              // the transaction mutates state
              (transaction) => { },
            )
          }}
        >
          send transfer
        </button>
      </p>
    </div>
  )
}
