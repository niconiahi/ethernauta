import "./demo.css"
import { eip155_1 } from "@ethernauta/chain/eip155-1"
import { AddressSchema } from "@ethernauta/core"
import {
  get_admin,
  get_beacon,
  get_implementation,
} from "@ethernauta/eip/1967"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { useCallback, useEffect, useState } from "react"
import { parse } from "valibot"

import { Button } from "../../components/button"

const MAINNET_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_1.chainId,
})

// USDC mainnet — a known TransparentUpgradeable proxy.
const PROXY = parse(
  AddressSchema,
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
)

const reader = create_reader([
  {
    chainId: MAINNET_CHAIN_ID,
    transports: [
      http("https://ethereum-rpc.publicnode.com"),
      http("https://eth.llamarpc.com"),
      http("https://cloudflare-eth.com"),
    ],
  },
])

type Slots = {
  implementation: string
  admin: string
  beacon: string
}

const EMPTY: Slots = {
  implementation: "…",
  admin: "…",
  beacon: "…",
}

export function Eip1967Demo() {
  const [slots, set_slots] = useState<Slots>(EMPTY)
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  const run = useCallback(async () => {
    set_loading(true)
    set_error(null)
    set_slots(EMPTY)
    try {
      const resolved = reader({
        chain_id: MAINNET_CHAIN_ID,
      })
      const [impl, admin, beacon] = await Promise.all([
        get_implementation(PROXY)(resolved),
        get_admin(PROXY)(resolved),
        get_beacon(PROXY)(resolved),
      ])
      set_slots({
        implementation: impl ?? "(zero — not a 1967 proxy)",
        admin: admin ?? "(no admin slot set)",
        beacon: beacon ?? "(no beacon slot set)",
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
    <div className="eip-1967-root">
      <div className="eip-1967-card">
        <Row label="Proxy" value={PROXY} />
        <Row
          label="Implementation slot"
          value={slots.implementation}
        />
        <Row label="Admin slot" value={slots.admin} />
        <Row label="Beacon slot" value={slots.beacon} />
        {loading && (
          <p className="eip-1967-loading">Loading…</p>
        )}
        {error && (
          <p className="eip-1967-error">{error}</p>
        )}
      </div>
      <Button onClick={run} disabled={loading}>
        {loading ? "Reading slots…" : "Re-read slots"}
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
    <div className="eip-1967-row">
      <span className="eip-1967-row-label">{label}</span>
      <span className="eip-1967-row-value">{value}</span>
    </div>
  )
}
