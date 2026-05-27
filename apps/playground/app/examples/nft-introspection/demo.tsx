import { eip155_1 } from "@ethernauta/chain/eip155-1"
import {
  addressSchema,
  bytes4Schema,
  uint256Schema,
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

const snapshotSchema = object({
  interfaces: array(
    object({
      label: string(),
      supported: boolean(),
    }),
  ),
  name: string(),
  total_supply: bigint(),
  owner_of_1: string(),
  token_uri_1: string(),
  elapsed_ms: number(),
})
type Snapshot = InferOutput<typeof snapshotSchema>

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
        to: parse(addressSchema, BAYC),
      })
      const start = performance.now()
      const results = await multicall([
        ...INTERFACES.map((i) =>
          supportsInterface({
            interfaceId: parse(bytes4Schema, i.id),
          })(ctx),
        ),
        name()(ctx),
        totalSupply()(ctx),
        ownerOf({ tokenId: parse(uint256Schema, "0x1") })(
          ctx,
        ),
        tokenURI({ tokenId: parse(uint256Schema, "0x1") })(
          ctx,
        ),
      ] as never)
      const elapsed_ms = Math.round(
        performance.now() - start,
      )
      const r = results as unknown as readonly unknown[]
      set_snapshot({
        interfaces: INTERFACES.map((i, idx) => ({
          label: i.label,
          supported: r[idx] as boolean,
        })),
        name: r[INTERFACES.length] as string,
        total_supply: BigInt(
          r[INTERFACES.length + 1] as `0x${string}`,
        ),
        owner_of_1: r[INTERFACES.length + 2] as string,
        token_uri_1: r[INTERFACES.length + 3] as string,
        elapsed_ms,
      })
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
    <div style={{ margin: "16px 0 24px" }}>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 24,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: "1px solid var(--border)",
            fontSize: 12,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          <span>Contract</span>
          <span style={{ fontFamily: "monospace" }}>
            BAYC
          </span>
        </div>
        {loading && (
          <p
            style={{
              margin: "12px 0 0",
              color: "var(--text-muted)",
            }}
          >
            Loading…
          </p>
        )}
        {error && (
          <p
            style={{
              margin: "12px 0 0",
              color: "var(--danger)",
            }}
          >
            {error}
          </p>
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
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        padding: "10px 0",
        borderBottom: "1px solid var(--border)",
        fontSize: 14,
      }}
    >
      <span
        style={{
          color: "var(--text-muted)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: mono ? "monospace" : "inherit",
          color:
            ok === false
              ? "var(--text-muted)"
              : ok === true
                ? "var(--success)"
                : "var(--text)",
          textAlign: "right",
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
