import { transaction_request } from "../../utils/transaction"
import {
  get_nonce,
  sign_transaction,
} from "../../utils/sign-transaction"
import { bytes_to_hex } from "../../utils/hex"
import type { CryptomanResponse } from "../../utils/event"
import { wallet } from "../../utils/wallet"
import type { Address } from "@cryptoman/eth"
import {
  http,
  createReader,
  encodeChainId,
} from "@cryptoman/transport"
import { eip155_11155111 } from "@cryptoman/chain"

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
