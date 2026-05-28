import "./demo.css"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import { AddressSchema } from "@ethernauta/core"
import {
  decimals,
  name,
  symbol,
  totalSupply,
} from "@ethernauta/erc/20"
import {
  contract,
  create_multicall,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { hex_to_number } from "@ethernauta/utils"
import { useCallback, useEffect, useState } from "react"
import {
  bigint,
  type InferOutput,
  number,
  object,
  parse,
  string,
} from "valibot"
import { Button } from "../../components/button"

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

// WETH on Sepolia — canonical wrapped-ether deployment.
const WETH_SEPOLIA =
  "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"

const multicall = create_multicall([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [
      http("https://ethereum-sepolia-rpc.publicnode.com"),
    ],
  },
])

const SnapshotSchema = object({
  name: string(),
  symbol: string(),
  decimals: number(),
  totalSupply: bigint(),
  elapsed_ms: number(),
})
type Snapshot = InferOutput<typeof SnapshotSchema>

export function MulticallDemo() {
  const [snapshot, set_snapshot] =
    useState<Snapshot | null>(null)
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  const run = useCallback(async () => {
    set_loading(true)
    set_error(null)
    try {
      const ctx = contract({
        chain_id: SEPOLIA_CHAIN_ID,
        to: parse(AddressSchema, WETH_SEPOLIA),
      })
      const start = performance.now()
      const [name_, symbol_, decimals_, supply_] =
        await multicall([
          name()(ctx),
          symbol()(ctx),
          decimals()(ctx),
          totalSupply()(ctx),
        ] as const)
      const elapsed_ms = Math.round(
        performance.now() - start,
      )
      set_snapshot({
        name: name_,
        symbol: symbol_,
        decimals: hex_to_number(decimals_),
        totalSupply: BigInt(supply_),
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
    <div className="multicall-root">
      <div className="multicall-card">
        {loading && (
          <p className="multicall-loading">Loading…</p>
        )}
        {error && (
          <p className="multicall-error">{error}</p>
        )}
        {snapshot && (
          <>
            <Row label="Name" value={snapshot.name} />
            <Row label="Symbol" value={snapshot.symbol} />
            <Row
              label="Decimals"
              value={String(snapshot.decimals)}
            />
            <Row
              label="Total supply"
              value={`${format_supply(snapshot.totalSupply, snapshot.decimals)} ${snapshot.symbol}`}
            />
            <Row
              label="Roundtrip"
              value={`${snapshot.elapsed_ms} ms · 1 RPC call`}
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
}: {
  label: string
  value: string
}) {
  return (
    <div className="multicall-row">
      <span className="multicall-row-label">{label}</span>
      <span className="multicall-row-value">{value}</span>
    </div>
  )
}

function format_supply(
  raw: bigint,
  decimals: number,
): string {
  const base = 10n ** BigInt(decimals)
  const whole = raw / base
  const fraction = raw % base
  const fraction_str = fraction
    .toString()
    .padStart(decimals, "0")
    .slice(0, 4)
  return `${whole.toLocaleString()}.${fraction_str}`
}
