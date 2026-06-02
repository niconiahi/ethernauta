import { useEffect, useState } from "preact/hooks"
import { Button } from "../../components/button"
import {
  type Chain,
  find_chain,
  parse_chain_input,
  past_chains,
  select_chain,
} from "../../utils/chain"
import { view } from "../../utils/view"

const PREVIEW_DEBOUNCE_MS = 200

// Typed chain selector. The user enters a chain id in any
// of three forms (decimal, hex, CAIP-2). We resolve it
// against `@ethernauta/chain`'s 2,600+ chain registry; if
// found, we render a preview block (name, RPC) and enable
// Switch. If not, the preview stays empty — that's the
// "no preview, no existence" signal. The recents list at
// the bottom is `past_chains` — every chain the user has
// previously activated, persisted in chrome.storage.local.
export function SelectChain() {
  const [input, set_input] = useState("")
  const [preview, set_preview] = useState<Chain | null>(
    null,
  )
  const [loading, set_loading] = useState(false)

  useEffect(() => {
    const id = parse_chain_input(input)
    if (id === undefined) {
      set_preview(null)
      set_loading(false)
      return
    }
    set_loading(true)
    const timer = window.setTimeout(async () => {
      const resolved = await find_chain(id)
      set_preview(resolved ?? null)
      set_loading(false)
    }, PREVIEW_DEBOUNCE_MS)
    return () => {
      window.clearTimeout(timer)
    }
  }, [input])

  async function switch_to(chain: Chain) {
    await select_chain(chain)
    view.value = "wallet"
  }

  return (
    <main className="flex flex-col gap-3 p-4 w-80 text-base">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-bold leading-tight">
          Select a chain
        </h1>
        <p className="text-xs text-[var(--text-muted)]">
          Type a chain id — decimal, hex, or CAIP-2.
        </p>
      </header>
      <form
        className="flex flex-col gap-2"
        onSubmit={async (event) => {
          event.preventDefault()
          if (preview) await switch_to(preview)
        }}
      >
        <input
          type="text"
          className="bg-[var(--surface)] text-[var(--text)] border-[var(--border)] p-2 border-2 rounded-md text-base font-mono"
          value={input}
          placeholder="e.g. 1, 0xaa36a7, eip155:11155111"
          onInput={(event) => {
            set_input(event.currentTarget.value)
          }}
        />
        {input.trim() !== "" && (
          <section className="rounded-md border-2 border-[var(--text)] bg-[var(--surface-strong)] p-3 flex flex-col gap-2 text-sm">
            {loading ? (
              <span className="text-xs text-[var(--text-muted)]">
                Resolving…
              </span>
            ) : preview ? (
              <>
                <Row label="Name" value={preview.name} />
                <Row
                  label="Chain id"
                  value={String(preview.id)}
                />
                <Row label="RPC" value={preview.rpc_url} />
              </>
            ) : (
              <span className="text-xs text-[var(--text-muted)]">
                No match in Ethernauta's registry.
              </span>
            )}
          </section>
        )}
        <Button type="submit" disabled={!preview}>
          Switch
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            view.value = "wallet"
          }}
        >
          Cancel
        </Button>
      </form>
      {past_chains.value.length > 0 && (
        <section className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Recents
          </p>
          <ul className="flex flex-col gap-1">
            {past_chains.value.map((chain) => (
              <li key={chain.id}>
                <button
                  type="button"
                  className="w-full text-left rounded-md border-2 border-[var(--border)] bg-[var(--surface)] p-2 hover:bg-[var(--surface-strong)] text-sm"
                  onClick={() => switch_to(chain)}
                >
                  <span className="font-mono">
                    {chain.id}
                  </span>{" "}
                  — {chain.name}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}

function Row({
  label,
  value,
}: {
  label: string
  value: string
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
