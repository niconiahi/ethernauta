// Connect-wallet + SIWE flow for the examples header.
//
// One self-contained widget that walks the standard SIWE
// sequence end-to-end:
//
//   1. EIP-6963 discover providers and let the user pick.
//   2. `eth_chainId` + `eth_requestAccounts` to learn who
//      we're signing for.
//   3. POST `/api/auth/siwe/nonce` to get a server-issued
//      nonce + domain + uri. The matching value lives in a
//      HMAC cookie the verify route reads on the next hop.
//   4. `build_siwe_message` → `personal_sign` against the
//      picked provider.
//   5. POST `/api/auth/siwe/verify` with `{ message,
//      signature }`. On success the server mints the
//      `siwe_session` cookie and we revalidate so the
//      header re-renders against the new loader data.
//
// `session` comes from the examples-route loader; when set,
// the button collapses into a small disconnected-style
// menu (address + Sign out).

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { personal_sign } from "@ethernauta/eip/191"
import { eth_requestAccounts } from "@ethernauta/eip/1102"
import type { Provider } from "@ethernauta/eip/1193"
import { build_siwe_message } from "@ethernauta/eip/4361"
import {
  ANNOUNCE_EVENT,
  clear_provider_detail,
  type EIP6963AnnounceProviderEvent,
  type EIP6963ProviderDetail,
  REQUEST_EVENT,
  set_provider_detail,
  web_storage,
} from "@ethernauta/eip/6963"
import {
  create_injected_signer,
  encode_chain_id,
} from "@ethernauta/transport"
import { useEffect, useRef, useState } from "react"
import { useRevalidator } from "react-router"
import { parse } from "valibot"
import { PROVIDER_STORE_KEY } from "../lib/provider-store"
import { Button } from "./button"

type Session = {
  address: Address
  chainId: string
}

function truncate(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function ConnectWalletButton({
  session,
}: {
  session: Session | null
}) {
  const [providers, set_providers] = useState<
    EIP6963ProviderDetail[]
  >([])
  const [open, set_open] = useState(false)
  const [busy, set_busy] = useState(false)
  const [error, set_error] = useState<string | null>(null)
  const revalidator = useRevalidator()
  const root_ref = useRef<HTMLDivElement | null>(null)

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

  // Click-outside to dismiss the dropdown.
  useEffect(() => {
    if (!open) return
    function on_click(event: MouseEvent) {
      if (!root_ref.current) return
      if (
        event.target instanceof Node &&
        root_ref.current.contains(event.target)
      ) {
        return
      }
      set_open(false)
    }
    window.addEventListener("mousedown", on_click)
    return () =>
      window.removeEventListener("mousedown", on_click)
  }, [open])

  async function connect(detail: EIP6963ProviderDetail) {
    set_busy(true)
    set_error(null)
    try {
      const provider = detail.provider as Provider
      const chain_hex = (await provider.request({
        method: "eth_chainId",
      })) as string
      const reference = Number.parseInt(chain_hex, 16)
      const chain_id = encode_chain_id({
        namespace: "eip155",
        reference,
      })
      const signer = create_injected_signer(provider)
      const accounts = await eth_requestAccounts()(
        signer({ chain_id }),
      )
      const first = accounts[0]
      if (!first) throw new Error("no account returned")
      const address = parse(AddressSchema, first)

      const nonce_response = await fetch(
        "/api/auth/siwe/nonce",
        { method: "POST" },
      )
      if (!nonce_response.ok) {
        throw new Error(
          `nonce endpoint returned ${nonce_response.status}`,
        )
      }
      const { nonce, domain, uri, issuedAt } =
        (await nonce_response.json()) as {
          nonce: string
          domain: string
          uri: string
          issuedAt: string
        }

      const expirationTime = new Date(
        Date.now() + 60 * 60 * 1000,
      ).toISOString()
      const message = build_siwe_message({
        domain,
        address,
        uri,
        version: "1",
        chainId: String(reference),
        nonce,
        issuedAt,
        expirationTime,
        statement:
          "Sign in to the Ethernauta examples playground.",
      })

      const signature = (await personal_sign([
        message,
        address,
      ])(signer({ chain_id }))) as string

      const verify_response = await fetch(
        "/api/auth/siwe/verify",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ message, signature }),
        },
      )
      if (!verify_response.ok) {
        const { reason } = (await verify_response
          .json()
          .catch(() => ({ reason: "verify_failed" }))) as {
          reason: string
        }
        throw new Error(reason)
      }
      set_provider_detail({
        store: web_storage(window.localStorage),
        key: PROVIDER_STORE_KEY,
        provider_detail: detail,
      })
      set_open(false)
      revalidator.revalidate()
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    } finally {
      set_busy(false)
    }
  }

  async function sign_out() {
    set_busy(true)
    try {
      await fetch("/api/auth/siwe/logout", {
        method: "POST",
      })
      clear_provider_detail({
        store: web_storage(window.localStorage),
        key: PROVIDER_STORE_KEY,
      })
      set_open(false)
      revalidator.revalidate()
    } finally {
      set_busy(false)
    }
  }

  return (
    <div ref={root_ref} style={{ position: "relative" }}>
      {session ? (
        <Button
          onClick={() => set_open((v) => !v)}
          disabled={busy}
        >
          {truncate(session.address)}
        </Button>
      ) : (
        <Button
          onClick={() => set_open((v) => !v)}
          disabled={busy}
        >
          {busy ? "Connecting…" : "Connect wallet"}
        </Button>
      )}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            minWidth: 240,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            boxShadow: "var(--shadow-md)",
            padding: 8,
            zIndex: 10,
          }}
        >
          {session ? (
            <>
              <div
                style={{
                  padding: "8px 10px",
                  fontSize: 12,
                  color: "var(--text-muted)",
                  wordBreak: "break-all",
                }}
              >
                {session.address}
              </div>
              <button
                type="button"
                onClick={sign_out}
                disabled={busy}
                style={menu_item_style}
              >
                Sign out
              </button>
            </>
          ) : providers.length === 0 ? (
            <div
              style={{
                padding: "8px 10px",
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              No EIP-6963 wallet detected. Install
              Ethernauta or another announcing wallet, then
              reopen this menu.
            </div>
          ) : (
            providers.map((detail) => (
              <button
                key={detail.info.rdns}
                type="button"
                disabled={busy}
                onClick={() => connect(detail)}
                style={menu_item_style}
              >
                {detail.info.icon && (
                  <img
                    src={detail.info.icon}
                    alt=""
                    width={20}
                    height={20}
                    style={{ borderRadius: 4 }}
                  />
                )}
                <span>{detail.info.name}</span>
              </button>
            ))
          )}
          {error && (
            <div
              style={{
                padding: "8px 10px",
                fontSize: 12,
                color: "var(--danger)",
                wordBreak: "break-word",
              }}
            >
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const menu_item_style: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  width: "100%",
  padding: "8px 10px",
  borderRadius: 6,
  border: "none",
  background: "transparent",
  textAlign: "left",
  font: "inherit",
  cursor: "pointer",
}
