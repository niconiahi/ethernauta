import { ERROR_CODE } from "@ethernauta/eip/1193"
import { Button } from "../../components/button"
import { make_error, make_success } from "../../utils/event"
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
        <p className="text-sm text-[var(--text-muted)]">
          A site is requesting access to your address.
        </p>
      </header>
      <section className="rounded-md border-2 border-[var(--text)] bg-[var(--surface-strong)] p-3">
        <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
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
            // eth_requestAccounts returns an array of
            // hex-address strings per EIP-1102.
            chrome.runtime.sendMessage(
              make_success(
                connection_request.value?.id ?? "",
                [address],
              ),
            )
            connection_request.value = null
            window.close()
          }}
        >
          Connect
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            chrome.runtime.sendMessage(
              make_error(
                connection_request.value?.id ?? "",
                ERROR_CODE.USER_REJECTED_REQUEST,
                "User rejected request",
              ),
            )
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
