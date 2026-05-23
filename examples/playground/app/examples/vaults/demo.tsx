import { eip155_1 } from "@ethernauta/chain"
import {
  decimals,
  symbol,
  totalSupply,
} from "@ethernauta/erc/20"
import {
  asset,
  convertToAssets,
  totalAssets,
} from "@ethernauta/erc/4626"
import {
  contract,
  create_multicall,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { useEffect, useState } from "react"
import {
  bigint,
  type InferOutput,
  number,
  object,
  string,
} from "valibot"
import { Button } from "../../components/button"

const MAINNET_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_1.chainId,
})

const VAULTS = [
  {
    label: "Morpho · Steakhouse USDC",
    address: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
    underlying: "USDC",
    underlying_decimals: 6,
  },
  {
    label: "Yearn · yvUSDC v3",
    address: "0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204",
    underlying: "USDC",
    underlying_decimals: 6,
  },
] as const

const multicall = create_multicall([
  {
    chainId: MAINNET_CHAIN_ID,
    transports: [
      http("https://ethereum-rpc.publicnode.com"),
    ],
  },
])

// We request `convertToAssets(1 share)`. The share decimals
// are vault-specific; we read them first via decimals().
// For the "assets per share" display we normalise by share
// decimals on the client.
const ONE_SHARE = `0x${(10n ** 18n).toString(16)}` as const

const vaultSnapshotSchema = object({
  label: string(),
  symbol: string(),
  decimals: number(),
  total_supply: bigint(),
  total_assets: bigint(),
  assets_per_share: bigint(),
  asset_address: string(),
  underlying: string(),
  underlying_decimals: number(),
})
type VaultSnapshot = InferOutput<typeof vaultSnapshotSchema>

export function VaultsDemo() {
  const [snapshots, set_snapshots] = useState<
    VaultSnapshot[] | null
  >(null)
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState<string | null>(null)
  const [elapsed_ms, set_elapsed_ms] = useState<
    number | null
  >(null)

  async function run() {
    set_loading(true)
    set_error(null)
    try {
      const calls = VAULTS.flatMap((v) => {
        const ctx = contract({
          chain_id: MAINNET_CHAIN_ID,
          to: v.address,
        })
        return [
          symbol()(ctx),
          decimals()(ctx),
          totalSupply()(ctx),
          totalAssets()(ctx),
          convertToAssets({ shares: ONE_SHARE })(ctx),
          asset()(ctx),
        ] as const
      })
      const start = performance.now()
      const results = await multicall(calls as never)
      set_elapsed_ms(Math.round(performance.now() - start))
      const r = results as unknown as readonly unknown[]
      set_snapshots(
        VAULTS.map((v, i) => {
          const base = i * 6
          return {
            label: v.label,
            symbol: r[base] as string,
            decimals: Number(
              BigInt(r[base + 1] as `0x${string}`),
            ),
            total_supply: BigInt(
              r[base + 2] as `0x${string}`,
            ),
            total_assets: BigInt(
              r[base + 3] as `0x${string}`,
            ),
            assets_per_share: BigInt(
              r[base + 4] as `0x${string}`,
            ),
            asset_address: r[base + 5] as string,
            underlying: v.underlying,
            underlying_decimals: v.underlying_decimals,
          }
        }),
      )
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    } finally {
      set_loading(false)
    }
  }

  useEffect(() => {
    run()
    // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  }, [run])

  return (
    <div style={{ margin: "16px 0 24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {(snapshots ?? VAULTS).map((v, i) => {
          const s = snapshots ? snapshots[i] : null
          return (
            <div
              key={"label" in v ? v.label : i}
              style={{
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 20,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#999",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 8,
                }}
              >
                {v.label}
              </div>
              {loading && !s && (
                <p
                  style={{
                    margin: 0,
                    color: "#666",
                    fontSize: 14,
                  }}
                >
                  Loading…
                </p>
              )}
              {s && (
                <>
                  <Row label="Symbol" value={s.symbol} />
                  <Row
                    label="Decimals"
                    value={String(s.decimals)}
                  />
                  <Row
                    label="Total assets"
                    value={`${format(s.total_assets, s.underlying_decimals)} ${s.underlying}`}
                  />
                  <Row
                    label="Total supply"
                    value={`${format(s.total_supply, s.decimals)} ${s.symbol}`}
                  />
                  <Row
                    label="Share price"
                    value={`${format(s.assets_per_share, s.underlying_decimals)} ${s.underlying} / share`}
                  />
                  <Row
                    label="Asset"
                    value={s.asset_address}
                    mono
                  />
                </>
              )}
            </div>
          )
        })}
      </div>
      {error && (
        <p
          style={{
            color: "#e53e3e",
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          {error}
        </p>
      )}
      {elapsed_ms !== null && (
        <p
          style={{
            color: "#666",
            fontSize: 13,
            margin: "0 0 16px",
            fontFamily: "monospace",
          }}
        >
          {elapsed_ms} ms · {VAULTS.length * 6} reads · 1
          RPC call
        </p>
      )}
      <Button onClick={run} disabled={loading}>
        {loading ? "Running…" : "Re-run multicall"}
      </Button>
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
        padding: "6px 0",
        borderBottom: "1px solid #f0f0f0",
        fontSize: 13,
      }}
    >
      <span style={{ color: "#666", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: mono ? "monospace" : "inherit",
          color: "#1a1a1a",
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

function format(raw: bigint, decimals: number): string {
  const base = 10n ** BigInt(decimals)
  const whole = raw / base
  const fraction = raw % base
  const fraction_str = fraction
    .toString()
    .padStart(decimals, "0")
    .slice(0, 4)
  return `${whole.toLocaleString()}.${fraction_str}`
}
