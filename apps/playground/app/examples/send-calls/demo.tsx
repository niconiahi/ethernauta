import "./demo.css"
// EIP-5792 standard surface. Sends a batch through the
// user-picked EIP-1193 provider via `wallet_sendCalls`,
// then polls `wallet_getCallsStatus`. Works against any
// standards-compliant wallet.

import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import {
  addressSchema,
  bytesSchema,
  uintSchema,
} from "@ethernauta/core"
import {
  type CallsStatus,
  wallet_getCallsStatus,
  wallet_getCapabilities,
  wallet_sendCalls,
} from "@ethernauta/eip/5792"
import { useProvider } from "@ethernauta/react"
import { encode_chain_id } from "@ethernauta/transport"
import { useEffect, useState } from "react"
import { parse } from "valibot"
import { Button } from "../../components/button"
import { SignInHint } from "../../components/sign-in-hint"
import { use_session } from "../../lib/auth/use-session"
import { PROVIDER_STORE_KEY } from "../../lib/provider-store"
import { Row } from "./row"

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

const SEPOLIA_CHAIN_REF_HEX = parse(
  uintSchema,
  `0x${eip155_11155111.chainId.toString(16)}`,
)

// Two harmless 0-wei self-calls — just enough to prove the
// wallet sequenced the batch and posted both transactions.
const CALLS = [
  parse(
    addressSchema,
    "0x1111111111111111111111111111111111111111",
  ),
  parse(
    addressSchema,
    "0x2222222222222222222222222222222222222222",
  ),
].map((to) => ({
  to,
  value: parse(uintSchema, "0x0"),
  data: parse(bytesSchema, "0x"),
}))

const NETWORK_LABEL = `${eip155_11155111.name} (chain ${eip155_11155111.chainId})`

export function SendCallsDemo() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [batch_id, set_batch_id] = useState<string | null>(
    null,
  )
  const [calls_status, set_calls_status] =
    useState<CallsStatus | null>(null)
  const [capabilities, set_capabilities] = useState<Record<
    string,
    unknown
  > | null>(null)

  useEffect(() => {
    if (!owner || !provider) return
    wallet_getCapabilities()(
      provider.signer({ chain_id: SEPOLIA_CHAIN_ID }),
    ).then(set_capabilities)
  }, [owner, provider])

  async function send_batch() {
    if (!provider) return
    const result = await wallet_sendCalls([
      {
        version: "2.0.0",
        chainId: SEPOLIA_CHAIN_REF_HEX,
        from: parse(addressSchema, owner),
        atomicRequired: false,
        calls: CALLS,
      },
    ])(provider.signer({ chain_id: SEPOLIA_CHAIN_ID }))
    set_batch_id(result.id)
  }

  async function poll_status() {
    if (!provider || !batch_id) return
    const status = await wallet_getCallsStatus([batch_id])(
      provider.signer({ chain_id: SEPOLIA_CHAIN_ID }),
    )
    set_calls_status(status)
  }

  if (!owner) return <SignInHint />

  return (
    <div>
      <Row label="Network" value={NETWORK_LABEL} />
      <Row
        label="Batch size"
        value={`${CALLS.length} calls`}
      />
      <Row label="Account" value={owner} mono />
      {capabilities && (
        <Row
          label="Capabilities"
          value={JSON.stringify(capabilities)}
          mono
        />
      )}
      {batch_id && (
        <Row label="Batch id" value={batch_id} mono />
      )}
      {calls_status && (
        <>
          <Row
            label="Status"
            value={String(calls_status.status)}
          />
          <Row
            label="Atomic"
            value={String(calls_status.atomic)}
          />
          {calls_status.receipts?.map((r) => (
            <Row
              key={r.transactionHash}
              label="Tx"
              value={r.transactionHash}
              mono
            />
          ))}
        </>
      )}
      <div className="send-calls-button-row">
        <Button onClick={send_batch}>Send batch</Button>
        {batch_id && (
          <Button variant="secondary" onClick={poll_status}>
            Refresh status
          </Button>
        )}
      </div>
    </div>
  )
}
