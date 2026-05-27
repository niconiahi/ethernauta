// Calls `estimate_1559_fees(parameters)` directly. Mainnet (and any
// other EIP-1559 EVM chain that isn't an L2 family member) takes the
// vanilla `eth_feeHistory` path — no L1 surcharge to factor in.
// L2 demos (op-stack / arbitrum / zksync) import their own family
// helper from `@ethernauta/gas`; there is no central dispatcher.

import { eip155_1 } from "@ethernauta/chain"
import type { Uint } from "@ethernauta/core"
import { estimate_1559_fees } from "@ethernauta/gas"
import { useProvider } from "@ethernauta/react"
import { encode_chain_id } from "@ethernauta/transport"
import { hex_to_bigint } from "@ethernauta/utils"
import { useState } from "react"
import { Button } from "../../components/button"
import { PROVIDER_STORE_KEY } from "../../lib/provider-store"

// The injected provider answers from its own selected-chain
// state — this CAIP-2 id just satisfies the resolver context.
const DISCOVERY_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_1.chainId,
})

export function GasEstimateDemo() {
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [multiplier, set_multiplier] = useState(1.5)
  const [percentile, set_percentile] = useState(10)
  const [base_fee, set_base_fee] = useState<Uint | null>(null)
  const [priority, set_priority] = useState<Uint | null>(null)
  const [max_fee, set_max_fee] = useState<Uint | null>(null)
  const [error, set_error] = useState<string | null>(null)
  const [in_flight, set_in_flight] = useState(false)

  if (!provider) {
    return (
      <div
        style={{
          padding: 16,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 8,
          fontSize: 14,
          color: "#555",
        }}
      >
        Pick a wallet first (try the <code>EIP-6963</code>{" "}
        example).
      </div>
    )
  }

  async function run() {
    if (!provider) return
    set_in_flight(true)
    set_error(null)
    try {
      const fees = await estimate_1559_fees({
        base_fee_multiplier: multiplier,
        priority_percentile: percentile,
      })(provider.reader({ chain_id: DISCOVERY_CHAIN_ID }))
      set_base_fee(fees.base_fee_per_gas)
      set_priority(fees.max_priority_fee_per_gas)
      set_max_fee(fees.max_fee_per_gas)
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    } finally {
      set_in_flight(false)
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
      <KnobRow
        label="base_fee_multiplier"
        value={multiplier}
        step={0.1}
        min={1}
        max={3}
        onChange={set_multiplier}
      />
      <KnobRow
        label="priority_percentile"
        value={percentile}
        step={5}
        min={1}
        max={99}
        onChange={set_percentile}
      />
      <Button onClick={run} disabled={in_flight}>
        {in_flight ? "Estimating…" : "Estimate 1559 fees"}
      </Button>
      <ResultRow label="base_fee_per_gas" value={base_fee} />
      <ResultRow
        label="max_priority_fee_per_gas"
        value={priority}
      />
      <ResultRow label="max_fee_per_gas" value={max_fee} />
      {error && (
        <div
          style={{
            color: "#e53e3e",
            fontFamily: "monospace",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}
    </div>
  )
}

function KnobRow({
  label,
  value,
  step,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  step: number
  min: number
  max: number
  onChange: (_value: number) => void
}) {
  return (
    <label
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span
        style={{ fontFamily: "monospace", fontSize: 14 }}
      >
        {label}
      </span>
      <input
        type="number"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) =>
          onChange(Number(e.currentTarget.value))
        }
        style={{
          width: 80,
          padding: "6px 8px",
          border: "1px solid #ddd",
          borderRadius: 4,
          fontFamily: "monospace",
          fontSize: 14,
        }}
      />
    </label>
  )
}

function ResultRow({
  label,
  value,
}: {
  label: string
  value: Uint | null
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderTop: "1px solid #f0f0f0",
      }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 14,
          color: "#1a1a1a",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 13,
          color: "#555",
        }}
      >
        {value
          ? `${value} (${hex_to_bigint(value).toLocaleString("en-US")})`
          : "—"}
      </span>
    </div>
  )
}
