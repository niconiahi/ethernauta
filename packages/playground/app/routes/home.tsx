import {
  number_to_hex,
  encode_transaction,
} from "@cryptoman/wallet"
import { useEffect } from "react"

export default function() {
  useEffect(() => {
    async function run() {
      const method = "eth_getTransactionCount"
      const params = [
        "0x636C0fCd6DA2207aBfA80427b556695A4ad0AF94",
        number_to_hex(8870407),
      ]
      const signed_transaction = encode_transaction(
        method,
        params,
      )
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
