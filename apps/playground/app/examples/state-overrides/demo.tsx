import "./demo.css"
import { eip155_1 } from "@ethernauta/chain/eip155-1"
import { AddressSchema, BytesSchema } from "@ethernauta/core"
import { totalSupply } from "@ethernauta/erc/20"
import { eth_call } from "@ethernauta/eth"
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

// USDC mainnet.
const TARGET = parse(
  AddressSchema,
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
)

// Tiny runtime: PUSH1 42, store at memory[0], return 32
// bytes from memory[0]. Total: 10 bytes. Replaces the
// contract's code for the duration of one eth_call.
const RETURN_42_CODE = parse(
  BytesSchema,
  "0x602a60005260206000f3",
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

type Result = {
  real: string
  overridden: string
}

const EMPTY: Result = {
  real: "…",
  overridden: "…",
}

export function StateOverridesDemo() {
  const [result, set_result] = useState<Result>(EMPTY)
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  const run = useCallback(async () => {
    set_loading(true)
    set_error(null)
    set_result(EMPTY)
    try {
      const resolved = reader({
        chain_id: MAINNET_CHAIN_ID,
      })
      const callable = totalSupply()(
        contract({
          chain_id: MAINNET_CHAIN_ID,
          to: TARGET,
        }),
      )
      const [real_bytes, overridden_bytes] =
        await Promise.all([
          eth_call([
            { to: callable.to, input: callable.data },
          ])(resolved),
          eth_call(
            [
              { to: callable.to, input: callable.data },
            ],
            { [TARGET]: { code: RETURN_42_CODE } },
          )(resolved),
        ])
      const real = callable.decode(real_bytes)
      const overridden = callable.decode(overridden_bytes)
      set_result({
        real: BigInt(real).toLocaleString(),
        overridden: BigInt(overridden).toLocaleString(),
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
    <div className="state-overrides-root">
      <div className="state-overrides-card">
        <Row label="Contract" value={TARGET} />
        <Row label="Method" value="totalSupply()" />
        <Row
          label="Real total supply"
          value={result.real}
        />
        <Row
          label="With code override → return 42"
          value={result.overridden}
        />
        {loading && (
          <p className="state-overrides-loading">
            Loading…
          </p>
        )}
        {error && (
          <p className="state-overrides-error">{error}</p>
        )}
      </div>
      <Button onClick={run} disabled={loading}>
        {loading ? "Simulating…" : "Re-simulate"}
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
    <div className="state-overrides-row">
      <span className="state-overrides-row-label">
        {label}
      </span>
      <span className="state-overrides-row-value">
        {value}
      </span>
    </div>
  )
}
