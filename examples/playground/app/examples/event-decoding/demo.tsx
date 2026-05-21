import { type AbiCodec, address, uint256 } from "@ethernauta/abi"
import { eip155_1 } from "@ethernauta/chain"
import { addressSchema, type Uint256 } from "@ethernauta/core"
import {
  eth_blockNumber,
  get_contract_events,
} from "@ethernauta/eth"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { useState } from "react"
import {
  bigint,
  type InferOutput,
  object,
  parse,
} from "valibot"
import { Button } from "../../components/button"

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

// USDC — high-volume Transfer events, every block.
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

const rowSchema = object({
  from: addressSchema,
  to: addressSchema,
  value: bigint(),
})
type Row = InferOutput<typeof rowSchema>

export function EventDecodingDemo() {
  const [rows, set_rows] = useState<Row[]>([])
  const [range, set_range] = useState<string | null>(null)
  const [busy, set_busy] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  async function load() {
    set_busy(true)
    set_error(null)
    set_rows([])
    set_range(null)
    try {
      const head_hex = await eth_blockNumber()(ctx)
      const head = BigInt(head_hex)
      const from = head - 3n
      const to = head
      const args: readonly AbiCodec<unknown>[] = [
        address(),
        address(),
        uint256(),
      ] as readonly AbiCodec<unknown>[]
      const decoded = await get_contract_events({
        address: USDC,
        name: "Transfer",
        args,
        indexed: [true, true, false],
        fromBlock: `0x${from.toString(16)}`,
        toBlock: `0x${to.toString(16)}`,
      })(ctx)
      set_range(`${from} → ${to}`)
      set_rows(
        decoded.slice(0, 12).map((d) =>
          parse(rowSchema, {
            from: d.args[0],
            to: d.args[1],
            value: BigInt(d.args[2] as Uint256),
          }),
        ),
      )
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : String(e),
      )
    } finally {
      set_busy(false)
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
        Decodes the last few blocks of <code>Transfer</code>{" "}
        events on USDC mainnet via{" "}
        <code>get_contract_events</code>.
      </p>
      <div>
        <Button onClick={load} disabled={busy}>
          {busy ? "Loading…" : "Load recent transfers"}
        </Button>
      </div>
      {range && (
        <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
          Blocks {range} — {rows.length} shown
        </p>
      )}
      {error && (
        <p style={{ color: "crimson", margin: 0 }}>{error}</p>
      )}
      {rows.length > 0 && (
        <table
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ textAlign: "left", color: "#666" }}>
              <th style={{ padding: "4px 8px" }}>from</th>
              <th style={{ padding: "4px 8px" }}>to</th>
              <th
                style={{ padding: "4px 8px", textAlign: "right" }}
              >
                value (USDC)
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                style={{
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                <td style={{ padding: "4px 8px" }}>
                  {trunc(r.from)}
                </td>
                <td style={{ padding: "4px 8px" }}>
                  {trunc(r.to)}
                </td>
                <td
                  style={{
                    padding: "4px 8px",
                    textAlign: "right",
                  }}
                >
                  {format_usdc(r.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function trunc(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function format_usdc(v: bigint): string {
  const whole = v / 1_000_000n
  const frac = v % 1_000_000n
  return `${whole.toString()}.${frac.toString().padStart(6, "0")}`
}
