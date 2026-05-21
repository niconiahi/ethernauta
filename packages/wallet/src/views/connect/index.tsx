import { Button } from "../../components/button"
import type {
  EthernautaResponse,
  TransactionRejectedResponse,
} from "../../utils/event"
import { connection_request } from "../../utils/transaction"
import { active_account } from "../../utils/wallet"

function truncate(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function Connect() {
  const address = active_account.value
    .address as `0x${string}`
  return (
    <main className="flex flex-col gap-4 p-4 w-80 text-base">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-bold leading-tight">
          Connect to Ethernauta
        </h1>
        <p className="text-sm text-gray-600">
          A site is requesting access to your address.
        </p>
      </header>
      <section className="rounded-md border-2 border-[#FF5005] bg-[color-mix(in_srgb,#FF5005_8%,#faf5f0)] p-3">
        <p className="text-xs uppercase tracking-wide text-gray-500">
          Address
        </p>
        <p
          className="font-mono text-base font-semibold"
          title={address}
        >
          {truncate(address)}
        </p>
      </section>
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => {
            const response: EthernautaResponse = {
              id: connection_request.value?.id ?? "",
              type: "ETHERNAUTA_RESPONSE_SIGNED_TRANSACTION",
              signed_transaction: JSON.stringify([address]),
            }
            chrome.runtime.sendMessage(response)
            connection_request.value = null
            window.close()
          }}
        >
          Connect
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const response: TransactionRejectedResponse = {
              id: connection_request.value?.id ?? "",
              type: "ETHERNAUTA_RESPONSE_TRANSACTION_REJECTED",
            }
            chrome.runtime.sendMessage(response)
            connection_request.value = null
            window.close()
          }}
        >
          Reject
        </Button>
      </div>
    </main>
  )
}
