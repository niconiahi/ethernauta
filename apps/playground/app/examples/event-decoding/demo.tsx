import "./demo.css"
import { address, uint256 } from "@ethernauta/abi"
import { eip155_1 } from "@ethernauta/chain/eip155-1"
import {
  AddressSchema,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
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

const RowSchema = object({
  from: AddressSchema,
  to: AddressSchema,
  value: bigint(),
})
type Row = InferOutput<typeof RowSchema>

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
      const args = [address(), address(), uint256()]
      const decoded = await get_contract_events({
        address: parse(AddressSchema, USDC),
        name: "Transfer",
        args,
        indexed: [true, true, false],
        fromBlock: parse(
          UintSchema,
          `0x${from.toString(16)}`,
        ),
        toBlock: parse(UintSchema, `0x${to.toString(16)}`),
      })(ctx)
      set_range(`${from} → ${to}`)
      set_rows(
        decoded.slice(0, 12).map((d) =>
          parse(RowSchema, {
            from: d.args[0],
            to: d.args[1],
            value: BigInt(parse(Uint256Schema, d.args[2])),
          }),
        ),
      )
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    } finally {
      set_busy(false)
    }
  }

  return (
    <div className="event-decoding-root">
      <p className="event-decoding-description">
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
        <p className="event-decoding-range">
          Blocks {range} — {rows.length} shown
        </p>
      )}
      {error && (
        <p className="event-decoding-error">{error}</p>
      )}
      {rows.length > 0 && (
        <table className="event-decoding-table">
          <thead>
            <tr className="event-decoding-thead">
              <th className="event-decoding-cell">from</th>
              <th className="event-decoding-cell">to</th>
              <th className="event-decoding-cell is-right">
                value (USDC)
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                // biome-ignore lint/suspicious/noArrayIndexKey: display-only, never reordered
                key={i}
                className="event-decoding-row"
              >
                <td className="event-decoding-cell">
                  {trunc(r.from)}
                </td>
                <td className="event-decoding-cell">
                  {trunc(r.to)}
                </td>
                <td className="event-decoding-cell is-right">
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
