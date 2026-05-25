import { eip155_1 } from "@ethernauta/chain"
import { addressSchema } from "@ethernauta/core"
import {
  balanceOf,
  decimals,
  symbol,
} from "@ethernauta/erc/20"
import {
  contract,
  create_multicall,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { hex_to_number } from "@ethernauta/utils"
import { useEffect, useState } from "react"
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

// vitalik.eth — chosen because every reader recognises the
// balances, and the address has been around long enough that
// the major ERC-20s have non-zero holdings there.
const OWNER = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

const TOKENS = [
  {
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  {
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  },
  {
    symbol: "WETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  {
    symbol: "UNI",
    address: "0x1f9840a85d5aF5bf1D1762F925BdAdDC4201F984",
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

const holdingSchema = object({
  symbol: string(),
  decimals: number(),
  balance: bigint(),
})
type Holding = InferOutput<typeof holdingSchema>

export function PortfolioDemo() {
  const [holdings, set_holdings] = useState<
    Holding[] | null
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
      const owner = parse(addressSchema, OWNER)
      const calls = TOKENS.flatMap((t) => {
        const ctx = contract({
          chain_id: MAINNET_CHAIN_ID,
          to: parse(addressSchema, t.address),
        })
        return [
          symbol()(ctx),
          decimals()(ctx),
          balanceOf({ account: owner })(ctx),
        ] as const
      })
      const start = performance.now()
      const results = await multicall(calls as never)
      set_elapsed_ms(Math.round(performance.now() - start))
      const next: Holding[] = TOKENS.map((_, i) => {
        const r = results as unknown as readonly [
          string,
          `0x${string}`,
          `0x${string}`,
        ][]
        const sym = r[i * 3] as unknown as string
        const dec = r[i * 3 + 1] as unknown as `0x${string}`
        const bal = r[i * 3 + 2] as unknown as `0x${string}`
        return {
          symbol: sym,
          decimals: hex_to_number(dec),
          balance: BigInt(bal),
        }
      })
      set_holdings(next)
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
          background: "#fff",
          border: "1px solid #ddd",
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
            borderBottom: "1px solid #f0f0f0",
            fontSize: 12,
            color: "#999",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          <span>Holder</span>
          <span style={{ fontFamily: "monospace" }}>
            vitalik.eth
          </span>
        </div>
        {loading && (
          <p
            style={{
              margin: "12px 0 0",
              color: "#666",
              fontSize: 14,
            }}
          >
            Loading…
          </p>
        )}
        {error && (
          <p
            style={{
              margin: "12px 0 0",
              color: "#e53e3e",
              fontSize: 14,
            }}
          >
            {error}
          </p>
        )}
        {holdings?.map((h) => (
          <div
            key={h.symbol}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid #f0f0f0",
              fontSize: 14,
            }}
          >
            <span style={{ color: "#666" }}>
              {h.symbol}
            </span>
            <span
              style={{
                fontFamily: "monospace",
                color: "#1a1a1a",
              }}
            >
              {format(h.balance, h.decimals)}
            </span>
          </div>
        ))}
        {elapsed_ms !== null && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              fontSize: 14,
            }}
          >
            <span style={{ color: "#666" }}>Roundtrip</span>
            <span
              style={{
                fontFamily: "monospace",
                color: "#1a1a1a",
              }}
            >
              {elapsed_ms} ms · {TOKENS.length * 3} reads ·
              1 RPC call
            </span>
          </div>
        )}
      </div>
      <Button onClick={run} disabled={loading}>
        {loading ? "Running…" : "Re-run multicall"}
      </Button>
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
