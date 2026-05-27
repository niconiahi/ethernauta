import { addressSchema } from "@ethernauta/core"
import { eth_requestAccounts } from "@ethernauta/eip/1102"
import {
  watch_accounts,
  watch_chain,
} from "@ethernauta/eip/1193"
import {
  clear_provider_detail,
  discover_providers,
  type EIP6963ProviderDetail,
  set_provider_detail,
  web_storage,
} from "@ethernauta/eip/6963"
import {
  eth_acounts,
  eth_chainId,
  eth_getBalance,
} from "@ethernauta/eth"
import { useProviderDetail } from "@ethernauta/react"
import {
  create_provider,
  encode_chain_id,
} from "@ethernauta/transport"
import { useEffect, useState } from "react"
import { parse } from "valibot"
import { Button } from "../../components/button"
import { PROVIDER_STORE_KEY } from "../../lib/provider-store"

// Placeholder chain_id for the initial `eth_chainId` discovery
// call. The injected transport forwards every request to the
// wallet regardless of context, and the wallet answers from
// its own selected-chain state — so the value here is just a
// well-formed CAIP-2 id to satisfy the resolver context schema.
const DISCOVERY_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: 1,
})

export function Eip1193Demo() {
  const restored = useProviderDetail({
    key: PROVIDER_STORE_KEY,
  })
  const [picked, set_picked] =
    useState<EIP6963ProviderDetail | null>(null)
  const provider_detail = restored ?? picked

  if (!provider_detail) {
    return (
      <Picker
        onPick={(detail) => {
          set_provider_detail({
            store: web_storage(window.localStorage),
            key: PROVIDER_STORE_KEY,
            provider_detail: detail,
          })
          set_picked(detail)
        }}
      />
    )
  }

  return <Connected provider_detail={provider_detail} />
}

function Picker({
  onPick,
}: {
  onPick: (_detail: EIP6963ProviderDetail) => void
}) {
  const [providers, set_providers] = useState<
    EIP6963ProviderDetail[]
  >([])

  useEffect(() => {
    discover_providers().then((list) => {
      set_providers(list)
    })
  }, [])

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
        <code>useProviderDetail({"{ key }"})</code>{" "}
        rehydrates the previously-picked wallet from{" "}
        <code>localStorage</code>. Pick one below — the
        choice persists across reloads.
      </p>
      {providers.length === 0 ? (
        <p style={{ margin: 0, color: "#999" }}>
          No EIP-1193 providers detected. Install MetaMask,
          Brave, or Ethernauta to exercise the demo.
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
                border: "1px solid #eee",
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
                <strong>{p.info.name}</strong>
              </span>
              <Button onClick={() => onPick(p)}>
                Pick
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Connected({
  provider_detail,
}: {
  provider_detail: EIP6963ProviderDetail
}) {
  // create_provider is the single dapp-side adapter:
  // .signer({ chain_id }) feeds Signable<T> methods,
  // .reader({ chain_id }) feeds Readable<T> methods.
  const provider = create_provider(provider_detail.provider)
  const [accounts, set_accounts] = useState<string[]>([])
  const [chain_id_hex, set_chain_id_hex] = useState<
    string | null
  >(null)
  const [balance, set_balance] = useState<string | null>(
    null,
  )

  useEffect(() => {
    const unregister = watch_accounts(
      provider_detail.provider,
      (next) => set_accounts(next),
    )
    return () => {
      unregister()
    }
  }, [provider_detail])

  useEffect(() => {
    const unregister = watch_chain(
      provider_detail.provider,
      (next) => {
        set_chain_id_hex(next)
        set_balance(null)
      },
    )
    return () => {
      unregister()
    }
  }, [provider_detail])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const current = await eth_chainId()(
        provider.reader({ chain_id: DISCOVERY_CHAIN_ID }),
      )
      if (cancelled) return
      set_chain_id_hex(current)
      const wallet_chain_id = encode_chain_id({
        namespace: "eip155",
        reference: Number.parseInt(current, 16),
      })
      const existing = await eth_acounts()(
        provider.reader({ chain_id: wallet_chain_id }),
      )
      if (cancelled) return
      if (existing.length === 0) return
      set_accounts(existing)
      const first = existing[0]
      if (first) {
        const wei = await eth_getBalance({
          address: parse(addressSchema, first),
        })(provider.reader({ chain_id: wallet_chain_id }))
        if (cancelled) return
        set_balance(wei)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [provider_detail, provider])

  async function connect() {
    if (!chain_id_hex) return
    const wallet_chain_id = encode_chain_id({
      namespace: "eip155",
      reference: Number.parseInt(chain_id_hex, 16),
    })
    const next = await eth_requestAccounts()(
      provider.signer({ chain_id: wallet_chain_id }),
    )
    set_accounts(next)
    const first = next[0]
    if (first) {
      const wei = await eth_getBalance({
        address: parse(addressSchema, first),
      })(provider.reader({ chain_id: wallet_chain_id }))
      set_balance(wei)
    }
  }

  function disconnect() {
    clear_provider_detail({
      store: web_storage(window.localStorage),
      key: PROVIDER_STORE_KEY,
    })
    window.location.reload()
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
        <code>create_provider(provider_detail)</code> wraps
        the picked EIP-1193 provider into a single factory
        exposing <code>.signer({"{ chain_id }"})</code> for{" "}
        <code>Signable&lt;T&gt;</code> methods and{" "}
        <code>.reader({"{ chain_id }"})</code> for{" "}
        <code>Readable&lt;T&gt;</code> methods. Same call
        shape as <code>create_reader(CHAINS)</code> — only
        the transport-construction line differs.
      </p>
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
        <Row
          label="Chain id (hex)"
          value={chain_id_hex ?? ""}
        />
        <Row
          label="Accounts (via .signer)"
          value={accounts.join(", ")}
          mono
        />
        <Row
          label="Balance wei (via .reader)"
          value={balance ?? ""}
          mono
        />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {accounts.length === 0 ? (
          <Button onClick={connect}>Connect</Button>
        ) : null}
        <Button onClick={disconnect}>Disconnect</Button>
      </div>
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
