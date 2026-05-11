import type { Address } from "@ethernauta/eth"
import * as v from "valibot"
import { Button } from "../../components/button"
import {
  get_reader,
  selected_chain,
} from "../../utils/chain"
import type {
  EthernautaResponse,
  TransactionRejectedResponse,
} from "../../utils/event"
import { bytes_to_hex } from "../../utils/hex"
import {
  get_nonce,
  sign_transaction,
} from "../../utils/sign-transaction"
import { transaction_request } from "../../utils/transaction"
import { wallet } from "../../utils/wallet"

export function Sign() {
  return (
    <main className="flex flex-col gap-2 p-2 text-base">
      <h1 className="text-center">You are about to sign</h1>
      <fieldset>
        <legend>Method</legend>
        <p className="font-bold">
          {transaction_request.value.method}
        </p>
      </fieldset>
      <fieldset>
        <legend>Params</legend>
        <ul>
          {transaction_request.value.params.map(
            (_param, index) => {
              const param = v.parse(v.string(), _param)
              const id = `param-${param}`
              return (
                <li key={id} className="flex gap-2">
                  <span className="w-2 text-center">
                    {index}
                  </span>
                  <span className="font-bold">{param}</span>
                </li>
              )
            },
          )}
        </ul>
      </fieldset>
      <Button
        onClick={async () => {
          const address = wallet.value.address as Address
          const key = wallet.value.key
          const { chain_id, reader } = get_reader(
            selected_chain.value,
          )
          const nonce = await get_nonce(
            address,
            reader,
            chain_id,
          )
          const signed_transaction = await sign_transaction(
            {
              key,
              nonce,
              method: transaction_request.value.method,
              params: transaction_request.value.params,
            },
          )
          const response: EthernautaResponse = {
            id: transaction_request.value.id,
            type: "ETHERNAUTA_RESPONSE_SIGNED_TRANSACTION",
            signed_transaction: bytes_to_hex(
              signed_transaction,
            ),
          }
          chrome.runtime.sendMessage(response)
          window.close()
        }}
      >
        Sign
      </Button>
      <Button
        onClick={() => {
          const response: TransactionRejectedResponse = {
            id: transaction_request.value.id,
            type: "ETHERNAUTA_RESPONSE_TRANSACTION_REJECTED",
          }
          chrome.runtime.sendMessage(response)
          window.close()
        }}
      >
        Reject
      </Button>
    </main>
  )
}
