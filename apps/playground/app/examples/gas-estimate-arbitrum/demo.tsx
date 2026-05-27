// `calculate_gas_arbitrum({ tx })` against Arbitrum One. Single read
// of the NodeInterface precompile's
// gasEstimateComponents(to, false, data) — the Nitro node hands back
// the L2 execution + L1 batch-posting split in one shot.

import { eip155_42161 } from "@ethernauta/chain"
import {
  addressSchema,
  type Uint,
} from "@ethernauta/core"
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
      {error && <div style={ERROR}>{error}</div>}
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
