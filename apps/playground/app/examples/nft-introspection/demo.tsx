import "./demo.css"
import { eip155_1 } from "@ethernauta/chain/eip155-1"
import {
  AddressSchema,
  Bytes4Schema,
  Uint256Schema,
} from "@ethernauta/core"
import { supportsInterface } from "@ethernauta/erc/165"
import {
  name,
  ownerOf,
  tokenURI,
  totalSupply,
} from "@ethernauta/erc/721"
import {
  contract,
  create_multicall,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { useCallback, useEffect, useState } from "react"
import {
  array,
  bigint,
  boolean,
  type InferOutput,
  number,
  object,
  parse,
  string,
  tuple,
} from "valibot"
import { Button } from "../../components/button"

const MAINNET_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_1.chainId,
})

// BAYC on mainnet — picked because every standard interface
// (721, Metadata, Enumerable) is implemented, so the
// introspection always returns something interesting. Royalty
// (ERC-2981) is intentionally missing on this contract — it
// shows the false-case in the UI.
const BAYC = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"

const INTERFACES = [
  { id: "0x80ac58cd", label: "ERC-721" },
  { id: "0x5b5e139f", label: "ERC-721 Metadata" },
  { id: "0x780e9d63", label: "ERC-721 Enumerable" },
  { id: "0x2a55205a", label: "ERC-2981 Royalty" },
] as const

const multicall = create_multicall([
  {
    chainId: MAINNET_CHAIN_ID,
    transports: [
      http("https://ethereum-rpc.publicnode.com"),
    ],
  },
])

const SnapshotSchema = object({
  interfaces: array(
    object({
      label: string(),
      supported: boolean(),
    }),
  ),
  name: string(),
  total_supply: bigint(),
  owner_of_1: AddressSchema,
  token_uri_1: string(),
  elapsed_ms: number(),
})
type Snapshot = InferOutput<typeof SnapshotSchema>

// Result tuple matches the call order built inside `run()`:
// [...INTERFACES.length × supportsInterface, name, totalSupply, ownerOf, tokenURI]
const CallResultsSchema = tuple([
  boolean(),     // supportsInterface — ERC-721
  boolean(),     // supportsInterface — ERC-721 Metadata
  boolean(),     // supportsInterface — ERC-721 Enumerable
  boolean(),     // supportsInterface — ERC-2981 Royalty
  string(),      // name()
  Uint256Schema, // totalSupply()
  AddressSchema, // ownerOf(1)
  string(),      // tokenURI(1)
])

export function NftIntrospectionDemo() {
  const [snapshot, set_snapshot] =
    useState<Snapshot | null>(null)
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  const run = useCallback(async () => {
    set_loading(true)
    set_error(null)
    try {
      const ctx = contract({
        chain_id: MAINNET_CHAIN_ID,
        to: parse(AddressSchema, BAYC),
      })
      const start = performance.now()
      const results = await multicall([
        ...INTERFACES.map((i) =>
          supportsInterface({
            interfaceId: parse(Bytes4Schema, i.id),
          })(ctx),
        ),
        name()(ctx),
        totalSupply()(ctx),
        ownerOf({ tokenId: parse(Uint256Schema, "0x1") })(
          ctx,
        ),
        tokenURI({ tokenId: parse(Uint256Schema, "0x1") })(
          ctx,
        ),
      ])
      const elapsed_ms = Math.round(
        performance.now() - start,
      )
      const [
        supports_721,
        supports_metadata,
        supports_enumerable,
        supports_royalty,
        nft_name,
        total_supply_hex,
        owner_of_1,
        token_uri_1,
      ] = parse(CallResultsSchema, results)
      const supports = [
        supports_721,
        supports_metadata,
        supports_enumerable,
        supports_royalty,
      ]
      set_snapshot(
        parse(SnapshotSchema, {
          interfaces: INTERFACES.map((i, idx) => ({
            label: i.label,
            supported: supports[idx],
          })),
          name: nft_name,
          total_supply: BigInt(total_supply_hex),
          owner_of_1,
          token_uri_1,
          elapsed_ms,
        }),
      )
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    } finally {
      set_loading(false)
    }
  }, [])

  useEffect(() => {
    run()
  }, [run])

  return (
    <div className="nft-introspection-root">
      <div className="nft-introspection-card">
        <div className="nft-introspection-header">
          <span>Contract</span>
          <span className="nft-introspection-header-value">
            BAYC
          </span>
        </div>
        {loading && (
          <p className="nft-introspection-loading">
            Loading…
          </p>
        )}
        {error && (
          <p className="nft-introspection-error">{error}</p>
        )}
        {snapshot && (
          <>
            {snapshot.interfaces.map((i) => (
              <Row
                key={i.label}
                label={i.label}
                value={i.supported ? "✓ supported" : "—"}
                ok={i.supported}
              />
            ))}
            <Row label="Name" value={snapshot.name} />
            <Row
              label="Total supply"
              value={snapshot.total_supply.toLocaleString()}
            />
            <Row
              label="Owner of #1"
              value={snapshot.owner_of_1}
              mono
            />
            <Row
              label="Token URI #1"
              value={snapshot.token_uri_1}
              mono
            />
            <Row
              label="Roundtrip"
              value={`${snapshot.elapsed_ms} ms · 8 reads · 1 RPC call`}
            />
          </>
        )}
      </div>
      <Button onClick={run} disabled={loading}>
        {loading ? "Running…" : "Re-run multicall"}
      </Button>
    </div>
  )
}

function Row({
  label,
  value,
  ok,
  mono,
}: {
  label: string
  value: string
  ok?: boolean
  mono?: boolean
}) {
  const value_class =
    ok === false
      ? "nft-introspection-row-value is-muted"
      : ok === true
        ? "nft-introspection-row-value is-success"
        : "nft-introspection-row-value"
  return (
    <div className="nft-introspection-row">
      <span className="nft-introspection-row-label">
        {label}
      </span>
      <span
        className={
          mono ? `${value_class} is-mono` : value_class
        }
      >
        {value}
      </span>
    </div>
  )
}
