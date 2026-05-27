// `calculate_gas(chain, { kind: "op-stack", tx, ... })` against a
// picker of Base or Optimism. Both chains route through the same
// op-stack family helper — this demo is the visual proof that the
// L1 fee read (GasPriceOracle.getL1Fee on the 0x420…000F predeploy)
// composes the same way regardless of which OP-stack chain the
// provider is on.

import {
  type Chain,
  eip155_10,
  eip155_8453,
} from "@ethernauta/chain"
import {
  addressSchema,
  type Uint,
} from "@ethernauta/core"
import { calculate_gas } from "@ethernauta/gas"
import { useProvider } from "@ethernauta/react"
import { encode_chain_id } from "@ethernauta/transport"
import { hex_to_bigint } from "@ethernauta/utils"
import { useMemo, useState } from "react"
import { parse } from "valibot"

import { Button } from "../../components/button"
import { PROVIDER_STORE_KEY } from "../../lib/provider-store"

const CHAINS: ReadonlyArray<{ chain: Chain; label: string }> =
  [
    { chain: eip155_8453, label: "Base" },
    { chain: eip155_10, label: "Optimism" },
  ]

const DEFAULT_TO = parse(
  addressSchema,
  "0x000000000000000000000000000000000000dEaD",
)

type Fees = {
  base_fee_per_gas: Uint
  max_priority_fee_per_gas: Uint
  max_fee_per_gas: Uint
  l1_fee: Uint
}

export function GasEstimateOpStackDemo() {
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [chain_idx, set_chain_idx] = useState(0)
  const [multiplier, set_multiplier] = useState(1.5)
  const [percentile, set_percentile] = useState(10)
  const [fees, set_fees] = useState<Fees | null>(null)
  const [error, set_error] = useState<string | null>(null)
  const [in_flight, set_in_flight] = useState(false)

  const chain = CHAINS[chain_idx]?.chain ?? eip155_8453
  const discovery_chain_id = useMemo(
    () =>
      encode_chain_id({
        namespace: "eip155",
        reference: chain.chainId,
      }),
    [chain],
  )

  if (!provider) {
    return (
      <div style={WAITING}>
        Pick a wallet first (try the <code>EIP-6963</code>{" "}
        example), then switch its network to Base or Optimism.
      </div>
    )
  }

  async function run() {
    if (!provider) return
    set_in_flight(true)
    set_error(null)
    try {
      const result = await calculate_gas(chain, {
        kind: "op-stack",
        tx: { to: DEFAULT_TO },
        base_fee_multiplier: multiplier,
        priority_percentile: percentile,
      })(provider.reader({ chain_id: discovery_chain_id }))
      if (result.kind !== "op-stack")
        throw new Error(
          `unexpected fees kind: ${result.kind}`,
        )
      set_fees({
        base_fee_per_gas: result.base_fee_per_gas,
        max_priority_fee_per_gas:
          result.max_priority_fee_per_gas,
        max_fee_per_gas: result.max_fee_per_gas,
        l1_fee: result.l1_fee,
      })
    }
    catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    }
    finally {
      set_in_flight(false)
    }
  }

  return (
    <div style={CARD}>
      <ChainPicker
        chains={CHAINS}
        value={chain_idx}
        onChange={set_chain_idx}
      />
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
        {in_flight
          ? "Estimating…"
          : `Estimate on ${CHAINS[chain_idx]?.label}`}
      </Button>
      <ResultRow
        label="base_fee_per_gas"
        value={fees?.base_fee_per_gas ?? null}
      />
      <ResultRow
        label="max_priority_fee_per_gas"
        value={fees?.max_priority_fee_per_gas ?? null}
      />
      <ResultRow
        label="max_fee_per_gas"
        value={fees?.max_fee_per_gas ?? null}
      />
      <ResultRow
        label="l1_fee"
        value={fees?.l1_fee ?? null}
      />
      {error && <div style={ERROR}>{error}</div>}
    </div>
  )
}

function ChainPicker({
  chains,
  value,
  onChange,
}: {
  chains: ReadonlyArray<{ chain: Chain; label: string }>
  value: number
  onChange: (_value: number) => void
}) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {chains.map((entry, i) => (
        <button
          type="button"
          key={entry.label}
          onClick={() => onChange(i)}
          style={{
            padding: "8px 12px",
            border:
              i === value
                ? "2px solid #1a1a1a"
                : "1px solid #ddd",
            borderRadius: 4,
            background: i === value ? "#fafafa" : "#fff",
            fontFamily: "monospace",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          {entry.label}
        </button>
      ))}
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
    <label style={KNOB_ROW}>
      <span style={MONO}>{label}</span>
      <input
        type="number"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) =>
          onChange(Number(e.currentTarget.value))
        }
        style={INPUT}
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
    <div style={RESULT_ROW}>
      <span style={MONO}>{label}</span>
      <span style={RESULT_VALUE}>
        {value
          ? `${value} (${hex_to_bigint(value).toLocaleString("en-US")})`
          : "—"}
      </span>
    </div>
  )
}

const CARD = {
  display: "grid",
  gap: 16,
  padding: 16,
  border: "1px solid #ddd",
  borderRadius: 8,
  background: "#fff",
} as const
const WAITING = {
  padding: 16,
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: 8,
  fontSize: 14,
  color: "#555",
} as const
const KNOB_ROW = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  gap: 12,
} as const
const RESULT_ROW = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  gap: 12,
  padding: "10px 0",
  borderTop: "1px solid #f0f0f0",
} as const
const MONO = {
  fontFamily: "monospace",
  fontSize: 14,
} as const
const INPUT = {
  width: 80,
  padding: "6px 8px",
  border: "1px solid #ddd",
  borderRadius: 4,
  fontFamily: "monospace",
  fontSize: 14,
} as const
const RESULT_VALUE = {
  fontFamily: "monospace",
  fontSize: 13,
  color: "#555",
} as const
const ERROR = {
  color: "#e53e3e",
  fontFamily: "monospace",
  fontSize: 13,
} as const
