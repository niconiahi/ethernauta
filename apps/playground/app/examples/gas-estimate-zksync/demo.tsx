// `calculate_gas_zksync({ tx })` against zkSync Era. Single
// zks_estimateFee RPC call — the zkSync node returns the four fee
// components zkSync charges in one shot.

import "./demo.css"
import { eip155_324 } from "@ethernauta/chain/eip155-324"
import { AddressSchema, type Uint } from "@ethernauta/core"
import { calculate_gas_zksync } from "@ethernauta/gas"
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
  reference: eip155_324.chainId,
})

const reader = create_reader([
  {
    chainId: CHAIN_ID,
    transports: [http("https://mainnet.era.zksync.io")],
  },
])

// `zks_estimateFee` rejects a `from` that isn't a known account on
// the chain. We use a high-traffic public EOA so the smoke test
// happy-paths against mainnet — replace with the connected account
// in real consumer code.
const DEFAULT_FROM = parse(
  AddressSchema,
  "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
)

const DEFAULT_TO = parse(
  AddressSchema,
  "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
)

type Fees = {
  gas_limit: Uint
  gas_per_pubdata_limit: Uint
  max_fee_per_gas: Uint
  max_priority_fee_per_gas: Uint
}

export function GasEstimateZksyncDemo() {
  const [fees, set_fees] = useState<Fees | null>(null)
  const [error, set_error] = useState<string | null>(null)
  const [in_flight, set_in_flight] = useState(false)

  async function run() {
    set_in_flight(true)
    set_error(null)
    try {
      const result = await calculate_gas_zksync({
        tx: { from: DEFAULT_FROM, to: DEFAULT_TO },
      })(reader({ chain_id: CHAIN_ID }))
      set_fees({
        gas_limit: result.gas_limit,
        gas_per_pubdata_limit: result.gas_per_pubdata_limit,
        max_fee_per_gas: result.max_fee_per_gas,
        max_priority_fee_per_gas:
          result.max_priority_fee_per_gas,
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
    <div className="gas-estimate-zksync-card">
      <Button onClick={run} disabled={in_flight}>
        {in_flight
          ? "Estimating…"
          : "Estimate on zkSync Era"}
      </Button>
      <ResultRow
        label="gas_limit"
        value={fees?.gas_limit ?? null}
      />
      <ResultRow
        label="gas_per_pubdata_limit"
        value={fees?.gas_per_pubdata_limit ?? null}
      />
      <ResultRow
        label="max_fee_per_gas"
        value={fees?.max_fee_per_gas ?? null}
      />
      <ResultRow
        label="max_priority_fee_per_gas"
        value={fees?.max_priority_fee_per_gas ?? null}
      />
      {error && <div className="gas-estimate-zksync-error">{error}</div>}
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
    <div className="gas-estimate-zksync-result-row">
      <span className="gas-estimate-zksync-mono">{label}</span>
      <span className="gas-estimate-zksync-result-value">
        {value
          ? `${value} (${hex_to_bigint(value).toLocaleString("en-US")})`
          : "—"}
      </span>
    </div>
  )
}
