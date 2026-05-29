import "./demo.css"
import { eip155_1 } from "@ethernauta/chain/eip155-1"
import { AddressSchema } from "@ethernauta/core"
import {
  deploy_clone,
  get_clone_target,
  is_clone,
} from "@ethernauta/eip/1167"
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

// USDC mainnet — a TransparentUpgradeable proxy (not a 1167
// minimal-proxy clone). The negative case is the most useful
// one to show — the positive case requires knowing a live
// clone address, which the deploy_clone helper below can
// itself produce.
const NON_CLONE = parse(
  AddressSchema,
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
)
const CLONE_DEMO_TARGET = parse(
  AddressSchema,
  "0x43506849d7c04f9138d1a2050bbf3a0c054402dd",
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

type Detection = {
  is_clone: string
  clone_target: string
}

const EMPTY: Detection = {
  is_clone: "…",
  clone_target: "…",
}

export function Eip1167Demo() {
  const [detection, set_detection] =
    useState<Detection>(EMPTY)
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState<string | null>(null)
  const generated = deploy_clone(CLONE_DEMO_TARGET)

  const run = useCallback(async () => {
    set_loading(true)
    set_error(null)
    set_detection(EMPTY)
    try {
      const resolved = reader({
        chain_id: MAINNET_CHAIN_ID,
      })
      const detected = await is_clone(NON_CLONE)(resolved)
      const target = await get_clone_target(NON_CLONE)(
        resolved,
      )
      set_detection({
        is_clone: detected ? "yes" : "no",
        clone_target: target ?? "(n/a — not a clone)",
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
    <div className="eip-1167-root">
      <div className="eip-1167-card">
        <p
          className="eip-1167-row-label"
          style={{ marginBottom: 8 }}
        >
          Detection — eth_getCode + 45-byte runtime match
        </p>
        <Row label="Address" value={NON_CLONE} />
        <Row label="Is a 1167 clone?" value={detection.is_clone} />
        <Row
          label="Clone target"
          value={detection.clone_target}
        />
        {loading && (
          <p className="eip-1167-loading">Loading…</p>
        )}
        {error && (
          <p className="eip-1167-error">{error}</p>
        )}
      </div>

      <div className="eip-1167-card">
        <p
          className="eip-1167-row-label"
          style={{ marginBottom: 8 }}
        >
          Deploy bytecode — deploy_clone(target) returns the
          init+runtime your CREATE tx should carry
        </p>
        <Row
          label="Synthetic target"
          value={CLONE_DEMO_TARGET}
        />
        <Row
          label="Deploy bytecode"
          value={generated}
        />
      </div>

      <Button onClick={run} disabled={loading}>
        {loading ? "Detecting…" : "Re-run detection"}
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
    <div className="eip-1167-row">
      <span className="eip-1167-row-label">{label}</span>
      <span className="eip-1167-row-value">{value}</span>
    </div>
  )
}
