import { transaction_request } from "../../utils/transaction"

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
    </div>
  )
}
