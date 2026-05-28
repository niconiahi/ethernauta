// `calculate_gas_arbitrum({ tx })` against Arbitrum One. Single read
// of the NodeInterface precompile's
// gasEstimateComponents(to, false, data) — the Nitro node hands back
// the L2 execution + L1 batch-posting split in one shot.

import "./demo.css"
import { eip155_42161 } from "@ethernauta/chain/eip155-42161"
import { addressSchema, type Uint } from "@ethernauta/core"
import { calculate_gas_arbitrum } from "@ethernauta/gas"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { hex_to_bigint } from "@ethernauta/utils"
import { useState } from "react"
import { parse } from "valibot"

import { Button } from "../../components/button"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_42161.chainId,
})

const reader = create_reader([
  {
    chainId: CHAIN_ID,
    transports: [http("https://arb1.arbitrum.io/rpc")],
  },
])

const DEFAULT_TO = parse(
  addressSchema,
  "0x000000000000000000000000000000000000dEaD",
)

type Fees = {
  gas_estimate: Uint
  l1_base_fee_estimate: Uint
  l2_base_fee: Uint
}

export function GasEstimateArbitrumDemo() {
  const [fees, set_fees] = useState<Fees | null>(null)
  const [error, set_error] = useState<string | null>(null)
  const [in_flight, set_in_flight] = useState(false)

  async function run() {
    set_in_flight(true)
    set_error(null)
    try {
      const result = await calculate_gas_arbitrum({
        tx: { to: DEFAULT_TO },
      })(reader({ chain_id: CHAIN_ID }))
      set_fees({
        gas_estimate: result.gas_estimate,
        l1_base_fee_estimate: result.l1_base_fee_estimate,
        l2_base_fee: result.l2_base_fee,
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
    <div className="gas-estimate-arbitrum-card">
      <Button onClick={run} disabled={in_flight}>
        {in_flight
          ? "Estimating…"
          : "Estimate on Arbitrum One"}
      </Button>
      <ResultRow
        label="gas_estimate"
        value={fees?.gas_estimate ?? null}
      />
      <ResultRow
        label="l1_base_fee_estimate"
        value={fees?.l1_base_fee_estimate ?? null}
      />
      <ResultRow
        label="l2_base_fee"
        value={fees?.l2_base_fee ?? null}
      />
      {error && <div className="gas-estimate-arbitrum-error">{error}</div>}
    </div>
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
    <div className="gas-estimate-arbitrum-result-row">
      <span className="gas-estimate-arbitrum-mono">{label}</span>
      <span className="gas-estimate-arbitrum-result-value">
        {value
          ? `${value} (${hex_to_bigint(value).toLocaleString("en-US")})`
          : "—"}
      </span>
    </div>
  )
}
