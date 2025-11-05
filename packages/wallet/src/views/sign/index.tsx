import { eip155_11155111 } from "@ethernauta/chain"
import type { Address } from "@ethernauta/eth"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import type { EthernautaResponse } from "../../utils/event"
import { bytes_to_hex } from "../../utils/hex"
import {
  get_nonce,
  sign_transaction,
} from "../../utils/sign-transaction"
import { transaction_request } from "../../utils/transaction"
import { wallet } from "../../utils/wallet"
import * as v from "valibot"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://ethereum-sepolia-rpc.publicnode.com"
const sepolia_chain_id = encode_chain_id({
  namespace: NAMESPACE.ETHEREUM,
  reference: eip155_11155111.chainId,
})
const reader = create_reader([
  {
    chainId: sepolia_chain_id,
    transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
  },
])

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
      <button
        type="button"
        className="bg-[#FF5005] border-2 rounded-md p-2 cursor-pointer text-base"
        onClick={async () => {
          const address = wallet.value.address as Address
          const key = wallet.value.key
          const nonce = await get_nonce(
            address,
            reader,
            sepolia_chain_id,
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
        }}
      >
        Sign
      </button>
    </main>
  )
}
