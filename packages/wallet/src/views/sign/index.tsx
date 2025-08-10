import { transaction_request } from "../../utils/transaction"
import {
  get_nonce,
  sign_transaction,
} from "../../utils/sign-transaction"
import { bytes_to_hex } from "../../utils/hex"
import type { EthernautaResponse } from "../../utils/event"
import { wallet } from "../../utils/wallet"
import type { Address } from "@ethernauta/eth"
import {
  http,
  createReader,
  encodeChainId,
} from "@ethernauta/transport"
import { eip155_11155111 } from "@ethernauta/chain"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://muddy-radial-borough.ethereum-sepolia.quiknode.pro/e0d1ca422dd966c7b388455f296fb1483f738bef/"
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
        sign
      </button>
    </div>
  )
}
