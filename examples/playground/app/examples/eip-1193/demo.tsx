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
  REQUEST_EVENT,
} from "@ethernauta/eip/6963"
import { encode_chain_id } from "@ethernauta/transport"
import { useEffect, useState } from "react"
import { Button } from "../../components/button"

export function Eip1193Demo() {
  const [providers, set_providers] = useState<
    EIP6963ProviderDetail[]
  >([])
  const [picked, set_picked] =
    useState<EIP6963ProviderDetail | null>(null)
  const [resolver, set_resolver] =
    useState<ProviderResolver | null>(null)
  const [accounts, set_accounts] = useState<string[]>([])
  const [chain_id_hex, set_chain_id_hex] = useState<
    string | null
  >(null)
  const [balance, set_balance] = useState<string | null>(
    null,
  )

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

  useEffect(() => {
    if (!picked) return
    const off_a = watch_accounts(
      picked.provider as Provider,
      (next) => set_accounts(next),
    )
    const off_c = watch_chain(
      picked.provider as Provider,
      (next) => {
        set_chain_id_hex(next)
        set_balance(null)
      },
    )
    return () => {
      off_a()
      off_c()
    }
  }, [picked])

  async function connect(detail: EIP6963ProviderDetail) {
    set_picked(detail)
    const provider = detail.provider as Provider
    // create_provider is the single dapp-side adapter:
    // .signer({ chain_id }) feeds Signable<T> methods,
    // .reader({ chain_id }) feeds Readable<T> methods.
    const factory = create_provider(provider)
    set_resolver(factory)
    const current = (await provider.request({
      method: "eth_chainId",
    })) as string
    set_chain_id_hex(current)
    const wallet_chain_id = encode_chain_id({
      namespace: "eip155",
      reference: Number.parseInt(current, 16),
    })
    const next = await eth_requestAccounts()(
      factory.signer({ chain_id: wallet_chain_id }),
    )
    set_accounts(next)
    if (next[0]) {
      const wei = await eth_getBalance({
        address: next[0],
      })(factory.reader({ chain_id: wallet_chain_id }))
      set_balance(wei)
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
        <code>create_provider(provider)</code> wraps any
        EIP-1193 provider into a single factory exposing{" "}
        <code>.signer({"{ chain_id }"})</code> for{" "}
        <code>Signable&lt;T&gt;</code> methods and{" "}
        <code>.reader({"{ chain_id }"})</code> for{" "}
        <code>Readable&lt;T&gt;</code> methods. Same call
        shape as <code>create_reader(CHAINS)</code> — only
        the transport-construction line differs.
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
                <strong>{p.info.name}</strong>
              </span>
              <Button onClick={() => connect(p)}>
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
