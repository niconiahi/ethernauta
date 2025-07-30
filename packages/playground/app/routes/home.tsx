// import { eip155_11155111 } from "@cryptoman/chain"
// import { eth_sendRawTransaction } from "@cryptoman/eth"
// import {
//   createWriter,
//   encodeChainId,
//   http,
// } from "@cryptoman/transport"
import {
  number_to_hex,
  sign_transaction,
} from "@cryptoman/wallet"
import { useEffect } from "react"
// import { bytes_to_hex } from "../../../wallet/src/utils/hex"

// const NAMESPACE = {
//   ETHEREUM: "eip155",
// }
// const ETHEREUM_SEPOLIA_RPC_URL =
//   "https://little-bitter-wave.ethereum-sepolia.quiknode.pro/4d40a4c7ec139649d4b1f43f5d536c3756faacc9/"
// const sepolia_chain_id = encodeChainId({
//   namespace: NAMESPACE.ETHEREUM,
//   reference: eip155_11155111.chainId,
// })
// const writer = createWriter([
//   {
//     chainId: sepolia_chain_id,
//     transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
//   },
// ])

export default function () {
  useEffect(() => {
    async function run() {
      // const method = "eth_getTransactionCount"
      // const params = [
      //   "0x636C0fCd6DA2207aBfA80427b556695A4ad0AF94",
      //   number_to_hex(8870407),
      // ]
      // const signed_transaction = await sign_transaction(
      //   method,
      //   params,
      // )
      // console.log("signed_transaction", signed_transaction)
      // const writable = eth_sendRawTransaction([
      //   bytes_to_hex(signed_transaction),
      // ])
      // const transaction = await writable(
      //   writer(sepolia_chain_id),
      // )
    }
    run()
  }, [])
  return (
    <div>
      <p>
        <button
          type="button"
          onClick={() => {
            console.log("clicking connect")
            window.cryptoman.connect()
          }}
        >
          connect
        </button>
      </p>
      <p>
        <button
          type="button"
          onClick={() => {
            console.log("clicking send transfer")
            const method = "transfer"
            const params = ["0x", "1x", 3]
            window.cryptoman.sign(method, params)
          }}
        >
          send transfer
        </button>
      </p>
    </div>
  )
}
