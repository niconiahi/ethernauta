import { eth_getBalance } from "@ethernauta/eth"
import { eth_requestAccounts } from "@ethernauta/eip/1102"
import {
  create_provider,
  type Provider,
  type ProviderResolver,
  watch_accounts,
  watch_chain,
} from "@ethernauta/eip/1193"
import {
  ANNOUNCE_EVENT,
  type EIP6963AnnounceProviderEvent,
  type EIP6963ProviderDetail,
  forget_picked_provider,
  remember_picked_provider,
  REQUEST_EVENT,
  restore_picked_provider,
  type Storage,
} from "@ethernauta/eip/6963"
import { encode_chain_id } from "@ethernauta/transport"
import { useEffect, useState } from "react"
import { Button } from "../../components/button"

const PICKED_KEY =
  "ethernauta-playground:injected-1193:picked-wallet"

const local_storage: Storage = {
  get: (key) => window.localStorage.getItem(key),
  set: (key, value) =>
    window.localStorage.setItem(key, value),
  remove: (key) => window.localStorage.removeItem(key),
}

export function Injected1193Demo() {
  const [providers, set_providers] = useState<
    EIP6963ProviderDetail[]
  >([])
  const [picked, set_picked] =
    useState<EIP6963ProviderDetail | null>(null)
  const [resolver, set_resolver] =
    useState<ProviderResolver | null>(null)
  const [accounts, set_accounts] = useState<string[]>([])
  const [chain_id, set_chain_id] = useState<string | null>(
    null,
  )
  const [balance, set_balance] = useState<string | null>(
    null,
  )
  const [busy, set_busy] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  function rediscover() {
    set_error(null)
    window.dispatchEvent(new Event(REQUEST_EVENT))
  }

  // Continuous listener — every wallet that ever announces
  // (synchronously on load, or late, or in response to our
  // requestProvider dispatch) lands in the list. Dedup by
  // rdns so re-announces don't pile up duplicates.
  useEffect(() => {
    function on_announce(event: Event) {
      const detail = (event as EIP6963AnnounceProviderEvent)
        .detail
      if (!detail?.info?.rdns) return
      set_providers((current) => {
        if (
          current.some(
            (p) => p.info.rdns === detail.info.rdns,
          )
        ) {
          return current
        }
        return [...current, detail]
      })
    }
    window.addEventListener(ANNOUNCE_EVENT, on_announce)
    window.dispatchEvent(new Event(REQUEST_EVENT))
    return () => {
      window.removeEventListener(
        ANNOUNCE_EVENT,
        on_announce,
      )
    }
  }, [])

  // Rehydrate from a previously-persisted rdns on mount —
  // restore_picked_provider re-issues the 6963 announce
  // request, filters by rdns, and resolves to the live
  // Provider (or null if the wallet's gone).
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const provider = await restore_picked_provider({
        storage: local_storage,
        key: PICKED_KEY,
        ms: 200,
      })
      if (cancelled) return
      if (!provider) return
      // Match the announced detail so the UI can mark it
      // as selected in the list.
      const rdns = local_storage.get(PICKED_KEY)
      const detail = providers.find(
        (p) => p.info.rdns === rdns,
      )
      if (!detail) return
      await connect(detail, /* already_remembered */ true)
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providers.length])

  useEffect(() => {
    if (!picked) return
    const off_a = watch_accounts(
      picked.provider as Provider,
      (next) => set_accounts(next),
    )
    const off_c = watch_chain(
      picked.provider as Provider,
      (next) => {
        set_chain_id(next)
        set_balance(null)
      },
    )
    return () => {
      off_a()
      off_c()
    }
  }, [picked])

  async function connect(
    detail: EIP6963ProviderDetail,
    already_remembered = false,
  ) {
    set_busy(true)
    set_error(null)
    try {
      set_picked(detail)
      if (!already_remembered) {
        remember_picked_provider({
          storage: local_storage,
          key: PICKED_KEY,
          rdns: detail.info.rdns,
        })
      }
      const provider = detail.provider as Provider
      // create_provider is the single dapp-side adapter:
      // .signer({ chain_id }) feeds Signable<T> methods,
      // .reader({ chain_id }) feeds Readable<T> methods.
      const factory = create_provider(provider)
      set_resolver(factory)
      const current = (await provider.request({
        method: "eth_chainId",
      })) as string
      set_chain_id(current)
      const wallet_chain_id = encode_chain_id({
        namespace: "eip155",
        reference: Number.parseInt(current, 16),
      })
      const next = await eth_requestAccounts()(
        factory.signer({ chain_id: wallet_chain_id }),
      )
      set_accounts(next)
      // Demonstrate the .reader side of the same factory —
      // route an eth_getBalance call through the wallet's
      // selected RPC.
      if (next[0]) {
        const wei = await eth_getBalance({
          address: next[0],
        })(factory.reader({ chain_id: wallet_chain_id }))
        set_balance(wei)
      }
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    } finally {
      set_busy(false)
    }
  }

  function disconnect() {
    forget_picked_provider({
      storage: local_storage,
      key: PICKED_KEY,
    })
    set_picked(null)
    set_resolver(null)
    set_accounts([])
    set_chain_id(null)
    set_balance(null)
  }

  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 8,
        background: "#fff",
      }}
    >
      <p style={{ margin: 0, color: "#555", fontSize: 14 }}>
        EIP-6963 lists every wallet on the page; pick one,
        and <code>create_provider</code> wraps it into a
        single factory exposing <code>.signer</code> and{" "}
        <code>.reader</code>. The chosen rdns is persisted
        via <code>remember_picked_provider</code>, so a
        reload calls <code>restore_picked_provider</code>{" "}
        and reconnects to the same wallet automatically.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <Button onClick={rediscover} disabled={busy}>
          Re-discover
        </Button>
        {picked && (
          <Button onClick={disconnect} disabled={busy}>
            Forget wallet
          </Button>
        )}
      </div>
      {providers.length === 0 ? (
        <p style={{ margin: 0, color: "#999" }}>
          No EIP-6963 providers announced yet. Install
          MetaMask, Brave, or Ethernauta and re-discover.
        </p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "grid",
            gap: 8,
          }}
        >
          {providers.map((p) => (
            <li
              key={p.info.uuid}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: 8,
                border:
                  picked?.info.uuid === p.info.uuid
                    ? "2px solid #FF5005"
                    : "1px solid #eee",
                borderRadius: 6,
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {p.info.icon ? (
                  <img
                    src={p.info.icon}
                    alt=""
                    width={24}
                    height={24}
                    style={{ borderRadius: 4 }}
                  />
                ) : null}
                <span>
                  <strong>{p.info.name}</strong>
                  <span
                    style={{
                      color: "#999",
                      marginLeft: 6,
                      fontFamily: "monospace",
                      fontSize: 12,
                    }}
                  >
                    {p.info.rdns}
                  </span>
                </span>
              </span>
              <Button
                onClick={() => connect(p)}
                disabled={busy}
              >
                Connect
              </Button>
            </li>
          ))}
        </ul>
      )}
      {picked && resolver && (
        <div
          style={{
            padding: 12,
            border: "1px solid #eee",
            borderRadius: 6,
            display: "grid",
            gap: 4,
            fontSize: 13,
          }}
        >
          <Row label="Picked" value={picked.info.name} />
          <Row
            label="Chain id (hex)"
            value={chain_id ?? "(unknown)"}
          />
          <Row
            label="Accounts"
            value={
              accounts.length > 0
                ? accounts.join(", ")
                : "(none)"
            }
            mono
          />
          <Row
            label="Balance (wei, via .reader)"
            value={balance ?? "(loading)"}
            mono
          />
        </div>
      )}
      {error && (
        <p style={{ color: "crimson", margin: 0 }}>
          {error}
        </p>
      )}
    </div>
  )
}

function Row({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <span style={{ color: "#666" }}>{label}</span>
      <span
        style={{
          fontFamily: mono ? "monospace" : "inherit",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    </div>
  )
}
