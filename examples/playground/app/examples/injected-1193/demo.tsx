import { eth_requestAccounts } from "@ethernauta/eip/1102"
import {
  create_injected_signer,
  type Provider,
  watch_accounts,
  watch_chain,
} from "@ethernauta/eip/1193"
import {
  ANNOUNCE_EVENT,
  type EIP6963AnnounceProviderEvent,
  type EIP6963ProviderDetail,
  REQUEST_EVENT,
} from "@ethernauta/eip/6963"
import { encode_chain_id } from "@ethernauta/transport"
import { useEffect, useState } from "react"
import { Button } from "../../components/button"

export function Injected1193Demo() {
  const [providers, set_providers] = useState<
    EIP6963ProviderDetail[]
  >([])
  const [picked, set_picked] = useState<
    EIP6963ProviderDetail | null
  >(null)
  const [accounts, set_accounts] = useState<string[]>([])
  const [chain_id, set_chain_id] = useState<string | null>(
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
  // `requestProvider` dispatch) lands in the list. Dedup by
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
      window.removeEventListener(ANNOUNCE_EVENT, on_announce)
    }
  }, [])

  useEffect(() => {
    if (!picked) return
    const off_a = watch_accounts(
      picked.provider as Provider,
      (next) => set_accounts(next),
    )
    const off_c = watch_chain(
      picked.provider as Provider,
      (next) => set_chain_id(next),
    )
    return () => {
      off_a()
      off_c()
    }
  }, [picked])

  async function connect(detail: EIP6963ProviderDetail) {
    set_busy(true)
    set_error(null)
    try {
      set_picked(detail)
      const provider = detail.provider as Provider
      const current = (await provider.request({
        method: "eth_chainId",
      })) as string
      set_chain_id(current)
      const chain_id = encode_chain_id({
        namespace: "eip155",
        reference: Number.parseInt(current, 16),
      })
      const signer = create_injected_signer(provider)
      const next = await eth_requestAccounts()(
        signer({ chain_id }),
      )
      set_accounts(next)
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : String(e),
      )
    } finally {
      set_busy(false)
    }
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
        <code>discover_providers()</code> lists every wallet
        announcing via EIP-6963. Pick one to connect through{" "}
        <code>create_injected_signer</code> — accounts /
        chain updates flow through{" "}
        <code>watch_accounts</code> /{" "}
        <code>watch_chain</code>.
      </p>
      <div>
        <Button onClick={rediscover} disabled={busy}>
          Re-discover
        </Button>
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
      {picked && (
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
        </div>
      )}
      {error && (
        <p style={{ color: "crimson", margin: 0 }}>{error}</p>
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
