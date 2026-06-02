import { ERROR_CODE } from "@ethernauta/eip/1193"
import type { ComponentChildren } from "preact"
import { useEffect, useState } from "preact/hooks"
import { Button } from "../../components/button"
import {
  type Chain,
  find_chain,
  select_chain,
} from "../../utils/chain"
import { make_error, make_success } from "../../utils/event"
import { switch_chain_request } from "../../utils/transaction"

// https://eips.ethereum.org/EIPS/eip-3326
// §Security Considerations: the wallet "should display a
// confirmation whenever a wallet_switchEthereumChain is
// received, clearly identifying the requester and the chain
// that will be switched to." This view is that confirmation.
// The chain id is resolved against `@ethernauta/chain`'s
// registry (2,600+ chains) — if the registry knows it, we
// render a preview and enable Approve. If not, the preview
// stays empty and Approve is disabled: "no preview, no
// existence."
export function SwitchChain() {
  const req = switch_chain_request.value
  const [resolved, set_resolved] = useState<Chain | null>(
    null,
  )
  const [loading, set_loading] = useState(true)

  useEffect(() => {
    if (!req) return
    set_loading(true)
    const target_id = Number.parseInt(
      req.parameter.chainId.slice(2),
      16,
    )
    find_chain(target_id).then((chain) => {
      set_resolved(chain ?? null)
      set_loading(false)
    })
  }, [req])

  if (!req) {
    return (
      <main className="p-4 w-80 text-sm text-[var(--text-muted)]">
        No switch-chain request pending.
      </main>
    )
  }

  return (
    <main className="flex flex-col gap-3 p-4 w-80 text-base">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-bold leading-tight">
          Switch chain?
        </h1>
        <p className="text-xs text-[var(--text-muted)]">
          EIP-3326 — a site is asking your wallet to switch
          its active chain.
        </p>
      </header>
      <section className="rounded-md border-2 border-[var(--text)] bg-[var(--surface-strong)] p-3 flex flex-col gap-2 text-sm">
        <Row
          label="Requested chain id"
          value={req.parameter.chainId}
        />
        {loading ? (
          <span className="text-xs text-[var(--text-muted)]">
            Resolving…
          </span>
        ) : resolved ? (
          <>
            <Row label="Name" value={resolved.name} />
            <Row label="RPC" value={resolved.rpc_url} />
          </>
        ) : (
          <span className="text-xs text-[color:var(--danger,#d33)]">
            Unknown chain — Ethernauta's registry has no
            entry for this id.
          </span>
        )}
      </section>
      <div className="flex flex-col gap-2">
        <Button
          disabled={loading || !resolved}
          onClick={async () => {
            if (!resolved) return
            await select_chain(resolved)
            // EIP-3326 returns null on successful switch.
            chrome.runtime.sendMessage(
              make_success(req.id, null),
            )
            window.close()
          }}
        >
          Approve
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            chrome.runtime.sendMessage(
              make_error(
                req.id,
                ERROR_CODE.USER_REJECTED_REQUEST,
                "User rejected request",
              ),
            )
            window.close()
          }}
        >
          Reject
        </Button>
      </div>
    </main>
  )
}

function Row({
  label,
  value,
}: {
  label: string
  value: ComponentChildren
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </span>
      <span className="font-mono break-all">{value}</span>
    </div>
  )
}
