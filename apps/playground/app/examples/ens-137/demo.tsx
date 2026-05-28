import "./demo.css"
import { eip155_1 } from "@ethernauta/chain/eip155-1"
import { AddressSchema } from "@ethernauta/core"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { useState } from "react"
import {
  type InferOutput,
  nullable,
  object,
  parse,
  string,
} from "valibot"
import { Button } from "../../components/button"

// `@ethernauta/ens` carries the ENSIP-15 Unicode normalization
// tables (multi-megabyte). Top-level importing it pulls the
// data into both the SSR worker bundle and the initial client
// chunk. Since the ENS calls only fire from the click handlers
// below, we lazy-import on first use — the data ships only
// when the user actually resolves a name.

const MAINNET_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_1.chainId,
})

const reader = create_reader([
  {
    chainId: MAINNET_CHAIN_ID,
    transports: [
      http("https://eth-mainnet.public.blastapi.io"),
    ],
  },
])

const ctx = reader({ chain_id: MAINNET_CHAIN_ID })

const ForwardSchema = object({
  address: nullable(string()),
  avatar: nullable(string()),
  twitter: nullable(string()),
  url: nullable(string()),
  description: nullable(string()),
})
type Forward = InferOutput<typeof ForwardSchema>

const ReverseSchema = object({
  name: nullable(string()),
})
type Reverse = InferOutput<typeof ReverseSchema>

export function Ens137Demo() {
  const [name, set_name] = useState("vitalik.eth")
  const [address, set_address] = useState(
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  )
  const [forward, set_forward] = useState<Forward | null>(
    null,
  )
  const [reverse, set_reverse] = useState<Reverse | null>(
    null,
  )
  const [error, set_error] = useState<string | null>(null)
  const [busy, set_busy] = useState(false)

  async function lookup_forward() {
    set_busy(true)
    set_error(null)
    set_forward(null)
    try {
      const {
        get_ens_address,
        get_ens_avatar,
        get_ens_text,
      } = await import("@ethernauta/ens")
      const [addr, avatar, twitter, url, description] =
        await Promise.all([
          get_ens_address({ name })(ctx),
          get_ens_avatar({ name })(ctx),
          get_ens_text({ name, key: "com.twitter" })(ctx),
          get_ens_text({ name, key: "url" })(ctx),
          get_ens_text({
            name,
            key: "description",
          })(ctx),
        ])
      set_forward({
        address: addr,
        avatar:
          avatar?.kind === "uri"
            ? avatar.uri
            : avatar?.kind === "nft"
              ? `${avatar.namespace}:${avatar.contract}/${avatar.token_id}`
              : null,
        twitter,
        url,
        description,
      })
    } catch (e: unknown) {
      set_error(e instanceof Error ? e.message : String(e))
    } finally {
      set_busy(false)
    }
  }

  async function lookup_reverse() {
    set_busy(true)
    set_error(null)
    set_reverse(null)
    try {
      const { get_ens_name } = await import(
        "@ethernauta/ens"
      )
      const resolved = await get_ens_name({
        address: parse(AddressSchema, address),
      })(ctx)
      set_reverse({ name: resolved })
    } catch (e: unknown) {
      set_error(e instanceof Error ? e.message : String(e))
    } finally {
      set_busy(false)
    }
  }

  return (
    <div className="ens-137-root">
      <section className="ens-137-section">
        <h4 className="ens-137-heading">
          Forward: name → address
        </h4>
        <div className="ens-137-input-row">
          <input
            type="text"
            value={name}
            onChange={(e) =>
              set_name(e.currentTarget.value)
            }
            className="ens-137-input"
          />
          <Button
            onClick={lookup_forward}
            disabled={busy || name.length === 0}
          >
            Resolve
          </Button>
        </div>
        {forward && (
          <dl className="ens-137-dl">
            <dt>address</dt>
            <dd>
              <code>{forward.address ?? "(none)"}</code>
            </dd>
            <dt>avatar</dt>
            <dd>
              <code>{forward.avatar ?? "(none)"}</code>
            </dd>
            <dt>com.twitter</dt>
            <dd>
              <code>{forward.twitter ?? "(none)"}</code>
            </dd>
            <dt>url</dt>
            <dd>
              <code>{forward.url ?? "(none)"}</code>
            </dd>
            <dt>description</dt>
            <dd>
              <code>{forward.description ?? "(none)"}</code>
            </dd>
          </dl>
        )}
      </section>

      <section className="ens-137-section">
        <h4 className="ens-137-heading">
          Reverse: address → name
        </h4>
        <div className="ens-137-input-row">
          <input
            type="text"
            value={address}
            onChange={(e) =>
              set_address(e.currentTarget.value)
            }
            className="ens-137-input is-mono"
          />
          <Button
            onClick={lookup_reverse}
            disabled={busy || address.length === 0}
          >
            Resolve
          </Button>
        </div>
        {reverse && (
          <p className="ens-137-reverse-result">
            <code>
              {reverse.name ?? "(no reverse record)"}
            </code>
          </p>
        )}
      </section>

      {error && (
        <p className="ens-137-error">
          {error}
        </p>
      )}
    </div>
  )
}
