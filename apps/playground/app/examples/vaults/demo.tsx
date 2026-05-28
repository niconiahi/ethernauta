import "./demo.css"
import { eip155_1 } from "@ethernauta/chain/eip155-1"
import {
  AddressSchema,
  Uint256Schema,
} from "@ethernauta/core"
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
const ONE_SHARE = parse(
  Uint256Schema,
  `0x${(10n ** 18n).toString(16)}`,
)

const VaultSnapshotSchema = object({
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
type VaultSnapshot = InferOutput<typeof VaultSnapshotSchema>

export function VaultsDemo() {
  const [snapshots, set_snapshots] = useState<
    VaultSnapshot[] | null
  >(null)
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState<string | null>(null)
  const [elapsed_ms, set_elapsed_ms] = useState<
    number | null
  >(null)

  const run = useCallback(async () => {
    set_loading(true)
    set_error(null)
    try {
      const calls = VAULTS.flatMap((v) => {
        const ctx = contract({
          chain_id: MAINNET_CHAIN_ID,
          to: parse(AddressSchema, v.address),
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
  }, [])

  useEffect(() => {
    run()
  }, [run])

  return (
    <div className="vaults-root">
      <div className="vaults-grid">
        {(snapshots ?? VAULTS).map((v, i) => {
          const s = snapshots ? snapshots[i] : null
          return (
            <div
              key={"label" in v ? v.label : i}
              className="vaults-card"
            >
              <div className="vaults-card-label">
                {v.label}
              </div>
              {loading && !s && (
                <p className="vaults-loading">
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
        <p className="vaults-error">
          {error}
        </p>
      )}
      {elapsed_ms !== null && (
        <p className="vaults-elapsed">
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
    <div className="vaults-row">
      <span className="vaults-row-label">
        {label}
      </span>
      <span
        className={
          mono
            ? "vaults-row-value is-mono"
            : "vaults-row-value"
        }
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
