import { transaction_request } from "../../utils/transaction"
import { sign_transaction } from "../../utils/sign-transaction"
import { bytes_to_hex } from "../../utils/hex"
import type { CryptomanResponse } from "../../utils/event"

export function Sign() {
  return (
    <div>
      <h1>you are about to sign</h1>
      <p>method {transaction_request.value.method}</p>
      <p>
        params{" "}
        {JSON.stringify(
          transaction_request.value.params,
          null,
          2,
        )}
      </p>
      <button
        type="button"
        onClick={async () => {
          const signed_transaction = await sign_transaction(
            transaction_request.value.method,
            transaction_request.value.params,
          )
          console.log(
            "signed_transaction",
            signed_transaction,
          )
          const response: CryptomanResponse = {
            id: transaction_request.value.id,
            type: "CRYPTOMAN_RESPONSE_SIGNED_TRANSACTION",
            signed_transaction: bytes_to_hex(
              signed_transaction,
            ),
          }
          chrome.runtime.sendMessage(response)
        }}
      >
        sign
      </button>
    </div>
  )
}
