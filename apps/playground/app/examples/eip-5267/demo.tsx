import "./demo.css"
import { eip155_1 } from "@ethernauta/chain/eip155-1"
import { AddressSchema, BytesSchema } from "@ethernauta/core"
import { eth_call } from "@ethernauta/eth"
import { get_domain } from "@ethernauta/eip/5267"
import {
  contract,
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

// USDC mainnet — modern OZ-based tokens implement 5267 via
// the EIP712Upgradeable abstract contract. If the call
// reverts on a given target, the demo surfaces that
// gracefully — the dapp should branch on the absence of
// eip712Domain() and fall back to hard-coded domain values.
const TARGET = parse(
  AddressSchema,
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
)

const reader = create_reader([
  {
    chainId: MAINNET_CHAIN_ID,
    transports: [
      http("https://ethereum-rpc.publicnode.com"),
      http("https://eth.llamarpc.com"),
      http("https://rpc.ankr.com/eth"),
    ],
  },
])

type Domain = {
  name: string
  version: string
  chainId: string
  verifyingContract: string
  salt: string
  extensions: string
}

const EMPTY: Domain = {
  name: "…",
  version: "…",
  chainId: "…",
  verifyingContract: "…",
  salt: "…",
  extensions: "…",
}

export function Eip5267Demo() {
  const [domain, set_domain] = useState<Domain>(EMPTY)
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  const run = useCallback(async () => {
    set_loading(true)
    set_error(null)
    set_domain(EMPTY)
    try {
      const resolved = reader({
        chain_id: MAINNET_CHAIN_ID,
      })
      const callable = get_domain()(
        contract({
          chain_id: MAINNET_CHAIN_ID,
          to: TARGET,
        }),
      )
      const bytes = await eth_call([
        { to: callable.to, input: callable.data },
      ])(resolved)
      const result = callable.decode(
        parse(BytesSchema, bytes),
      )
      set_domain({
        name: result.domain.name ?? "(not in domain)",
        version: result.domain.version ?? "(not in domain)",
        chainId:
          result.domain.chainId !== undefined
            ? String(result.domain.chainId)
            : "(not in domain)",
        verifyingContract:
          result.domain.verifyingContract ?? "(not in domain)",
        salt: result.domain.salt ?? "(not in domain)",
        extensions: result.extensions.length
          ? result.extensions.join(", ")
          : "(none)",
      })
    } catch (e) {
      set_error(
        "eip712Domain() reverted or returned bad data — this contract is not EIP-5267 compliant",
      )
      void e
    } finally {
      set_loading(false)
    }
  }, [])

  useEffect(() => {
    run()
  }, [run])

  return (
    <div className="eip-5267-root">
      <div className="eip-5267-card">
        <Row label="Contract" value={TARGET} />
        <Row label="name" value={domain.name} />
        <Row label="version" value={domain.version} />
        <Row label="chainId" value={domain.chainId} />
        <Row
          label="verifyingContract"
          value={domain.verifyingContract}
        />
        <Row label="salt" value={domain.salt} />
        <Row label="extensions" value={domain.extensions} />
        {loading && (
          <p className="eip-5267-loading">Loading…</p>
        )}
        {error && (
          <p className="eip-5267-error">{error}</p>
        )}
      </div>
      <Button onClick={run} disabled={loading}>
        {loading ? "Fetching domain…" : "Re-fetch domain"}
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
    <div className="eip-5267-row">
      <span className="eip-5267-row-label">{label}</span>
      <span className="eip-5267-row-value">{value}</span>
    </div>
  )
}
