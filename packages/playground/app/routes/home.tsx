import { eip155_11155111 } from "@cryptoman/chain"
import { eth_getTransactionCount } from "@cryptoman/eth"
import {
  createReader,
  encodeChainId,
  http,
} from "@cryptoman/transport"
import { useEffect } from "react"

function number_to_hex(number: number): `0x${string}` {
  return `0x${number.toString(16)}` satisfies `0x${string}`
}
function hex_to_number(hex: `0x${string}`): number {
  return Number(hex)
}
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

export default function () {
  useEffect(() => {
    async function run() {
      const readable = eth_getTransactionCount([
        "0x636C0fCd6DA2207aBfA80427b556695A4ad0AF94",
        number_to_hex(8870407),
      ])
      const transaction_count = await readable(
        reader(sepolia_chain_id),
      )
      console.log(
        "transaction_count",
        hex_to_number(transaction_count),
      )
      // export const transaction1559UnsignedSchema = object({
      //   type: string(),
      //   nonce: uintSchema,
      //   to: nullable(addressSchema),
      //   gas: uintSchema,
      //   value: uintSchema,
      //   input: bytesSchema,
      //   maxPriorityFeePerGas: uintSchema,
      //   maxFeePerGas: uintSchema,
      //   gasPrice: uintSchema,
      //   accessList: accessListSchema,
      //   chainId: uintSchema,
      // })
      const nonce = transaction_count
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
