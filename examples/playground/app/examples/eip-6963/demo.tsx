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
import { useEffect, useState } from "react"
import { Button } from "../../components/button"

const PICKED_KEY =
  "ethernauta-playground:eip-6963:picked-wallet"

const local_storage: Storage = {
  get: (key) => window.localStorage.getItem(key),
  set: (key, value) =>
    window.localStorage.setItem(key, value),
  remove: (key) => window.localStorage.removeItem(key),
}

export function Eip6963Demo() {
  const [providers, set_providers] = useState<
    EIP6963ProviderDetail[]
  >([])
  const [picked_rdns, set_picked_rdns] = useState<
    string | null
  >(null)
  const [restored_name, set_restored_name] = useState<
    string | null
  >(null)

  function rediscover() {
    window.dispatchEvent(new Event(REQUEST_EVENT))
  }

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

  // On mount: rehydrate from a previously-persisted rdns,
  // confirming the matching wallet still announces.
  useEffect(() => {
    ;(async () => {
      const stored = local_storage.get(PICKED_KEY)
      if (!stored) return
      set_picked_rdns(stored)
      const provider = await restore_picked_provider({
        storage: local_storage,
        key: PICKED_KEY,
        ms: 200,
      })
      if (!provider) return
      const detail = providers.find(
        (p) => p.info.rdns === stored,
      )
      if (detail) set_restored_name(detail.info.name)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providers.length])

  function pick(detail: EIP6963ProviderDetail) {
    remember_picked_provider({
      storage: local_storage,
      key: PICKED_KEY,
      rdns: detail.info.rdns,
    })
    set_picked_rdns(detail.info.rdns)
    set_restored_name(detail.info.name)
  }

  function forget() {
    forget_picked_provider({
      storage: local_storage,
      key: PICKED_KEY,
    })
    set_picked_rdns(null)
    set_restored_name(null)
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
        Wallets announce themselves via{" "}
        <code>eip6963:announceProvider</code>; a dapp
        dispatches <code>eip6963:requestProvider</code> to
        nudge late ones. Pick a wallet to persist its rdns
        via <code>remember_picked_provider</code>; a reload
        rehydrates it through{" "}
        <code>restore_picked_provider</code> without the
        user picking again.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <Button onClick={rediscover}>Re-discover</Button>
        {picked_rdns && (
          <Button onClick={forget}>Forget wallet</Button>
        )}
      </div>
      {picked_rdns && (
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
          <Row label="Persisted rdns" value={picked_rdns} mono />
          <Row
            label="Rehydrated"
            value={restored_name ?? "(wallet not announcing)"}
          />
        </div>
      )}
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
                  picked_rdns === p.info.rdns
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
              <Button onClick={() => pick(p)}>Pick</Button>
            </li>
          ))}
        </ul>
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
