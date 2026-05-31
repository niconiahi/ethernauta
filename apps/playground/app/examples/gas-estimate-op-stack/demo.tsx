// `estimate_op_fees({ tx, ... })` against a picker of Base or
// Optimism. Both chains use the same family helper — this demo is
// the visual proof that the L1 fee read (GasPriceOracle.getL1Fee on
// the 0x420…000F predeploy) composes the same way regardless of
// which OP-stack chain the provider is on. The chain is wired into
// the `provider.reader({ chain_id })` resolver, not into the helper.

import "./demo.css"
import type { Chain } from "@ethernauta/chain"
import { eip155_10 } from "@ethernauta/chain/eip155-10"
import { eip155_8453 } from "@ethernauta/chain/eip155-8453"
import { AddressSchema, type Uint } from "@ethernauta/core"
import { estimate_op_fees } from "@ethernauta/op"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { hex_to_bigint } from "@ethernauta/utils"
import { useMemo, useState } from "react"
import { parse } from "valibot"

import { Button } from "../../components/button"

const CHAINS: ReadonlyArray<{
  chain: Chain
  label: string
}> = [
  { chain: eip155_8453, label: "Base" },
  { chain: eip155_10, label: "Optimism" },
]

const BASE_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_8453.chainId,
})
const OPTIMISM_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_10.chainId,
})

const reader = create_reader([
  {
    chainId: BASE_CHAIN_ID,
    transports: [http("https://mainnet.base.org/")],
  },
  {
    chainId: OPTIMISM_CHAIN_ID,
    transports: [http("https://mainnet.optimism.io")],
  },
])

const DEFAULT_TO = parse(
  AddressSchema,
  "0x000000000000000000000000000000000000dEaD",
)

type Fees = {
  base_fee_per_gas: Uint
  max_priority_fee_per_gas: Uint
  max_fee_per_gas: Uint
  l1_fee: Uint
}

export function GasEstimateOpStackDemo() {
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

  async function run() {
    set_in_flight(true)
    set_error(null)
    try {
      const result = await estimate_op_fees({
        tx: { to: DEFAULT_TO },
        base_fee_multiplier: multiplier,
        priority_percentile: percentile,
      })(reader({ chain_id: discovery_chain_id }))
      set_fees({
        base_fee_per_gas: result.base_fee_per_gas,
        max_priority_fee_per_gas:
          result.max_priority_fee_per_gas,
        max_fee_per_gas: result.max_fee_per_gas,
        l1_fee: result.l1_fee,
      })
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    } finally {
      set_in_flight(false)
    }
  }

  return (
    <div className="gas-estimate-op-stack-card">
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
      {error && (
        <div className="gas-estimate-op-stack-error">
          {error}
        </div>
      )}
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
    <div className="gas-estimate-op-stack-picker">
      {chains.map((entry, i) => (
        <button
          type="button"
          key={entry.label}
          onClick={() => onChange(i)}
          className={
            i === value
              ? "gas-estimate-op-stack-picker-button is-active"
              : "gas-estimate-op-stack-picker-button"
          }
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
    <label className="gas-estimate-op-stack-knob-row">
      <span className="gas-estimate-op-stack-mono">
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
        className="gas-estimate-op-stack-input"
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
    <div className="gas-estimate-op-stack-result-row">
      <span className="gas-estimate-op-stack-mono">
        {label}
      </span>
      <span className="gas-estimate-op-stack-result-value">
        {value
          ? `${value} (${hex_to_bigint(value).toLocaleString("en-US")})`
          : "—"}
      </span>
    </div>
  )
}
