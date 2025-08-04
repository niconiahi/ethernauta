import { number_to_hex } from "@cryptoman/wallet"

export default function () {
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
            const signature = await window.cryptoman.sign(
              method,
              params,
            )
            console.log("signature", signature)
          }}
        >
          send transfer
        </button>
      </p>
    </div>
  )
}
