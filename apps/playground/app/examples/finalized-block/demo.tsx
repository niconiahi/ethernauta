import "./demo.css"
import { eip155_1 } from "@ethernauta/chain/eip155-1"
import { eth_getBlockByNumber } from "@ethernauta/eth"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { useCallback, useEffect, useState } from "react"

import { Button } from "../../components/button"

const MAINNET_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_1.chainId,
})

const reader = create_reader([
  {
    chainId: MAINNET_CHAIN_ID,
    transports: [
      http("https://ethereum-rpc.publicnode.com"),
    ],
  },
])

type Snapshot = {
  number: string
  hash: string
  withdrawals: string
  blob_gas_used: string
  excess_blob_gas: string
}

const EMPTY: Snapshot = {
  number: "…",
  hash: "…",
  withdrawals: "…",
  blob_gas_used: "…",
  excess_blob_gas: "…",
}

export function FinalizedBlockDemo() {
  const [snapshot, set_snapshot] = useState<Snapshot>(EMPTY)
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  const run = useCallback(async () => {
    set_loading(true)
    set_error(null)
    set_snapshot(EMPTY)
    try {
      const block = await eth_getBlockByNumber([
        "finalized",
        false,
      ])(reader({ chain_id: MAINNET_CHAIN_ID }))
      if (block === null) {
        set_error("(no finalized block returned)")
        return
      }
      set_snapshot({
        number: BigInt(block.number).toLocaleString(),
        hash: block.hash,
        withdrawals:
          block.withdrawals === undefined
            ? "(pre-Shanghai block?)"
            : String(block.withdrawals.length),
        blob_gas_used:
          block.blobGasUsed === undefined
            ? "(pre-Cancun)"
            : block.blobGasUsed,
        excess_blob_gas:
          block.excessBlobGas === undefined
            ? "(pre-Cancun)"
            : block.excessBlobGas,
      })
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
    <div className="finalized-block-root">
      <div className="finalized-block-card">
        <Row label="Tag" value="finalized" />
        <Row label="Block number" value={snapshot.number} />
        <Row label="Hash" value={snapshot.hash} />
        <Row
          label="Withdrawals (Shanghai)"
          value={snapshot.withdrawals}
        />
        <Row
          label="blobGasUsed (Cancun)"
          value={snapshot.blob_gas_used}
        />
        <Row
          label="excessBlobGas (Cancun)"
          value={snapshot.excess_blob_gas}
        />
        {loading && (
          <p className="finalized-block-loading">
            Loading…
          </p>
        )}
        {error && (
          <p className="finalized-block-error">{error}</p>
        )}
      </div>
      <Button onClick={run} disabled={loading}>
        {loading ? "Fetching…" : "Re-fetch finalized"}
      </Button>
    </div>
  )
}

function Row({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="finalized-block-row">
      <span className="finalized-block-row-label">
        {label}
      </span>
      <span className="finalized-block-row-value">
        {value}
      </span>
    </div>
  )
}
