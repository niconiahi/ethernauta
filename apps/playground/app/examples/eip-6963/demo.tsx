import "./demo.css"
import {
  ANNOUNCE_EVENT,
  clear_provider_detail,
  type EIP6963ProviderDetail,
  Eip6963ProviderDetailSchema,
  get_provider_detail,
  REQUEST_EVENT,
  type Store,
  set_provider_detail,
} from "@ethernauta/eip/6963"
import { useEffect, useState } from "react"
import { safeParse } from "valibot"
import { Button } from "../../components/button"

const PICKED_KEY =
  "ethernauta-playground:eip-6963:picked-wallet"

const local_store: Store = {
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
      if (!(event instanceof CustomEvent)) return
      const parsed = safeParse(
        Eip6963ProviderDetailSchema,
        event.detail,
      )
      if (!parsed.success) return
      const detail = parsed.output
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
      const stored = local_store.get(PICKED_KEY)
      if (!stored) return
      set_picked_rdns(stored)
      const provider_detail = await get_provider_detail({
        store: local_store,
        key: PICKED_KEY,
        ms: 200,
      })
      if (!provider_detail) return
      set_restored_name(provider_detail.info.name)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function pick(provider_detail: EIP6963ProviderDetail) {
    set_provider_detail({
      store: local_store,
      key: PICKED_KEY,
      provider_detail,
    })
    set_picked_rdns(provider_detail.info.rdns)
    set_restored_name(provider_detail.info.name)
  }

  function forget() {
    clear_provider_detail({
      store: local_store,
      key: PICKED_KEY,
    })
    set_picked_rdns(null)
    set_restored_name(null)
  }

  return (
    <div className="eip-6963-root">
      <p className="eip-6963-description">
        Wallets announce themselves via{" "}
        <code>eip6963:announceProvider</code>; a dapp
        dispatches <code>eip6963:requestProvider</code> to
        nudge late ones. Pick a wallet to persist its rdns
        via <code>set_provider_detail</code>; a reload
        rehydrates it through{" "}
        <code>get_provider_detail</code> without the user
        picking again.
      </p>
      <div className="eip-6963-actions">
        <Button onClick={rediscover}>Re-discover</Button>
        {picked_rdns && (
          <Button onClick={forget}>Forget wallet</Button>
        )}
      </div>
      {picked_rdns && (
        <div className="eip-6963-summary">
          <Row
            label="Persisted rdns"
            value={picked_rdns}
            mono
          />
          <Row
            label="Rehydrated"
            value={
              restored_name ?? "(wallet not announcing)"
            }
          />
        </div>
      )}
      {providers.length === 0 ? (
        <p className="eip-6963-empty">
          No EIP-6963 providers announced yet. Install
          MetaMask, Brave, or Ethernauta and re-discover.
        </p>
      ) : (
        <ul className="eip-6963-providers">
          {providers.map((p) => (
            <li
              key={p.info.uuid}
              className={
                picked_rdns === p.info.rdns
                  ? "eip-6963-provider-item is-picked"
                  : "eip-6963-provider-item"
              }
            >
              <span className="eip-6963-provider-info">
                {p.info.icon ? (
                  <img
                    src={p.info.icon}
                    alt=""
                    width={24}
                    height={24}
                    className="eip-6963-provider-icon"
                  />
                ) : null}
                <span>
                  <strong>{p.info.name}</strong>
                  <span className="eip-6963-provider-rdns">
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
    <div className="eip-6963-row">
      <span className="eip-6963-row-label">{label}</span>
      <span
        className={
          mono
            ? "eip-6963-row-value is-mono"
            : "eip-6963-row-value"
        }
      >
        {value}
      </span>
    </div>
  )
}
