import { transaction } from "../../utils/transaction"

export function Sign() {
  return (
    <div>
      <h1>you are about to sign</h1>
      <p>method {transaction.value.method}</p>
      <p>
        params{" "}
        {JSON.stringify(transaction.value.params, null, 2)}
      </p>
    </div>
  )
}
