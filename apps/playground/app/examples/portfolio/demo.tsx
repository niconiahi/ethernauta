import "./demo.css"
import { eip155_1 } from "@ethernauta/chain/eip155-1"
import { AddressSchema, Uint256Schema } from "@ethernauta/core"
import { balanceOf } from "@ethernauta/erc/20"
import {
  decimals,
  symbol,
} from "@ethernauta/erc/20/extensions/metadata"
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
  tuple,
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

const HoldingSchema = object({
  symbol: string(),
  decimals: number(),
  balance: bigint(),
})
type Holding = InferOutput<typeof HoldingSchema>

// Per-token slice: [symbol(), decimals(), balanceOf({account})]
const TokenCallResultsSchema = tuple([
  string(),
  Uint256Schema,
  Uint256Schema,
])

export function PortfolioDemo() {
  const [holdings, set_holdings] = useState<
    Holding[] | null
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
      const owner = parse(AddressSchema, OWNER)
      const calls = TOKENS.flatMap((t) => {
        const ctx = contract({
          chain_id: MAINNET_CHAIN_ID,
          to: parse(AddressSchema, t.address),
        })
        return [
          symbol()(ctx),
          decimals()(ctx),
          balanceOf({ account: owner })(ctx),
        ]
      })
      const start = performance.now()
      const results = await multicall(calls)
      set_elapsed_ms(Math.round(performance.now() - start))
      const next: Holding[] = TOKENS.map((_, i) => {
        const [sym, dec_hex, bal_hex] = parse(
          TokenCallResultsSchema,
          results.slice(i * 3, i * 3 + 3),
        )
        return parse(HoldingSchema, {
          symbol: sym,
          decimals: hex_to_number(dec_hex),
          balance: BigInt(bal_hex),
        })
      })
      set_holdings(next)
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
    <div className="portfolio-root">
      <div className="portfolio-card">
        <div className="portfolio-header">
          <span>Holder</span>
          <span className="portfolio-header-value">
            vitalik.eth
          </span>
        </div>
        {loading && (
          <p className="portfolio-loading">Loading…</p>
        )}
        {error && (
          <p className="portfolio-error">{error}</p>
        )}
        {holdings?.map((h) => (
          <div key={h.symbol} className="portfolio-row">
            <span className="portfolio-row-label">
              {h.symbol}
            </span>
            <span className="portfolio-row-value">
              {format(h.balance, h.decimals)}
            </span>
          </div>
        ))}
        {elapsed_ms !== null && (
          <div className="portfolio-footer">
            <span className="portfolio-row-label">
              Roundtrip
            </span>
            <span className="portfolio-row-value">
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
