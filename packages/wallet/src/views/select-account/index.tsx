import { useState } from "preact/hooks"
import { Button } from "../../components/button"
import { view } from "../../utils/view"
import {
  accounts,
  active_account,
  add_account,
  master_unlocked,
  set_active_index,
} from "../../utils/wallet"

function truncate(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function SelectAccount() {
  const state = accounts.value
  const active = active_account.value
  const [busy, set_busy] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  async function activate(index: number) {
    if (index === state.active_index) {
      view.value = "wallet"
      return
    }
    set_busy(true)
    set_error(null)
    try {
      await set_active_index(index)
      view.value = "wallet"
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    } finally {
      set_busy(false)
    }
  }

  async function on_add() {
    set_busy(true)
    set_error(null)
    try {
      await add_account()
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    } finally {
      set_busy(false)
    }
  }

  return (
    <main className="flex flex-col gap-3 p-4 w-80 text-base">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-bold leading-tight">
          Accounts
        </h1>
        <p className="text-xs text-[var(--text-muted)]">
          Pick which account dapps see.
        </p>
      </header>
      <ul className="flex flex-col gap-2">
        {state.list.map((account) => {
          const is_active = account.index === active.index
          return (
            <li key={account.index}>
              <button
                type="button"
                disabled={busy}
                onClick={() => activate(account.index)}
                className={[
                  "w-full text-left rounded-md border-2 p-2 cursor-pointer",
                  is_active
                    ? "border-[var(--text)] bg-[var(--surface-strong)]"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text)]",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    Account #{account.index}
                  </span>
                  {is_active ? (
                    <span className="text-xs text-[var(--text)] font-bold">
                      Active
                    </span>
                  ) : null}
                </div>
                <p
                  className="font-mono text-sm break-all"
                  title={account.address}
                >
                  {truncate(account.address)}
                </p>
              </button>
            </li>
          )
        })}
      </ul>
      {error && (
        <p className="text-xs text-[var(--danger)]">{error}</p>
      )}
      <div className="flex flex-col gap-2">
        <Button
          disabled={busy || !master_unlocked()}
          onClick={on_add}
        >
          Add account
        </Button>
        <Button
          variant="secondary"
          disabled={busy}
          onClick={() => {
            view.value = "wallet"
          }}
        >
          Cancel
        </Button>
      </div>
      {!master_unlocked() && (
        <p className="text-[10px] text-[var(--text-muted)] text-center">
          Sign in again to add new accounts.
        </p>
      )}
    </main>
  )
}
