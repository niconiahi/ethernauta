// Path 1 — the standard EIP-5792 surface. Sends the batch
// through the user-picked EIP-1193 provider via
// `wallet_sendCalls`, then polls `wallet_getCallsStatus`.
// Works against any standards-compliant wallet.

import { create_injected_signer } from "@ethernauta/eip/1193"
import {
  type CallsStatus,
  wallet_getCallsStatus,
  wallet_getCapabilities,
  wallet_sendCalls,
} from "@ethernauta/eip/5792"
import { use_provider_detail } from "@ethernauta/eip/6963/use-provider-detail"
import { useEffect, useState } from "react"
import { Button } from "../../components/button"
import { SignInHint } from "../../components/sign-in-hint"
import { use_session } from "../../lib/auth/use-session"
import { Row } from "./row"
import {
  CALLS,
  NETWORK_LABEL,
  SEPOLIA_CHAIN_ID,
  SEPOLIA_CHAIN_REF_HEX,
} from "./shared"

export function SendCallsStandard() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider = use_provider_detail()
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
    const signer = create_injected_signer(provider)
    wallet_getCapabilities()(
      signer({ chain_id: SEPOLIA_CHAIN_ID }),
    ).then(set_capabilities)
  }, [owner, provider])

  async function send_batch() {
    if (!provider) return
    const signer = create_injected_signer(provider)
    const result = await wallet_sendCalls([
      {
        version: "2.0.0",
        chainId: SEPOLIA_CHAIN_REF_HEX,
        from: owner as `0x${string}`,
        atomicRequired: false,
        calls: CALLS,
      },
    ])(signer({ chain_id: SEPOLIA_CHAIN_ID }))
    set_batch_id(result.id)
  }

  async function poll_status() {
    if (!provider || !batch_id) return
    const signer = create_injected_signer(provider)
    const status = await wallet_getCallsStatus([batch_id])(
      signer({ chain_id: SEPOLIA_CHAIN_ID }),
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
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginTop: 16,
        }}
      >
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
