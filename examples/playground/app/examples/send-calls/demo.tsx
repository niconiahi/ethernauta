import { eip155_11155111 } from "@ethernauta/chain"
import { eth_requestAccounts } from "@ethernauta/eip/1102"
import {
  CALLS_STATUS,
  type CallsStatus,
  wallet_getCallsStatus,
  wallet_getCapabilities,
  wallet_sendCalls,
} from "@ethernauta/eip/5792"
import {
  create_signer,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { useState } from "react"
import { Button } from "../../components/button"

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

const SEPOLIA_CHAIN_REF_HEX =
  `0x${eip155_11155111.chainId.toString(16)}` as const

const CHAINS = [
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [
      http("https://ethereum-sepolia-rpc.publicnode.com"),
    ],
  },
]
const signer = create_signer(CHAINS)

// Two harmless 0-wei self-calls — just enough to prove the
// wallet sequenced the batch and posted both transactions.
const TARGETS = [
  "0x1111111111111111111111111111111111111111" as const,
  "0x2222222222222222222222222222222222222222" as const,
]

function describe_status(code: number): string {
  if (code === CALLS_STATUS.PENDING) return "Pending"
  if (code === CALLS_STATUS.CONFIRMED) return "Confirmed"
  if (code === CALLS_STATUS.FAILED_OFFCHAIN)
    return "Failed (offchain)"
  if (code === CALLS_STATUS.REVERTED) return "Reverted"
  if (code === CALLS_STATUS.PARTIALLY_REVERTED)
    return "Partially reverted"
  return `Unknown (${code})`
}

export function SendCallsDemo() {
  const [owner, set_owner] = useState<string | null>(null)
  const [batch_id, set_batch_id] = useState<string | null>(
    null,
  )
  const [calls_status, set_calls_status] =
    useState<CallsStatus | null>(null)
  const [capabilities, set_capabilities] = useState<
    Record<string, unknown> | null
  >(null)
  const [loading, set_loading] = useState(false)
  const [polling, set_polling] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  async function connect() {
    set_error(null)
    try {
      const accounts = await eth_requestAccounts()(
        signer({ chain_id: SEPOLIA_CHAIN_ID }),
      )
      if (accounts[0]) set_owner(accounts[0])
      const caps = await wallet_getCapabilities()(
        signer({ chain_id: SEPOLIA_CHAIN_ID }),
      )
      set_capabilities(caps)
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    }
  }

  async function send_batch() {
    if (!owner) return
    set_loading(true)
    set_error(null)
    set_batch_id(null)
    set_calls_status(null)
    try {
      const result = await wallet_sendCalls([
        {
          version: "2.0.0",
          chainId: SEPOLIA_CHAIN_REF_HEX,
          from: owner as `0x${string}`,
          atomicRequired: false,
          calls: TARGETS.map((to) => ({
            to,
            value: "0x0",
            data: "0x",
          })),
        },
      ])(signer({ chain_id: SEPOLIA_CHAIN_ID }))
      set_batch_id(result.id)
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    } finally {
      set_loading(false)
    }
  }

  async function poll_status() {
    if (!batch_id) return
    set_polling(true)
    set_error(null)
    try {
      const status = await wallet_getCallsStatus([
        batch_id,
      ])(signer({ chain_id: SEPOLIA_CHAIN_ID }))
      set_calls_status(status)
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    } finally {
      set_polling(false)
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Row
          label="Network"
          value={`${eip155_11155111.name} (chain ${eip155_11155111.chainId})`}
        />
        <Row label="Batch size" value="2 calls" />
        {owner && (
          <Row label="Account" value={owner} mono />
        )}
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
              value={describe_status(calls_status.status)}
            />
            <Row
              label="Atomic"
              value={String(calls_status.atomic)}
            />
            {calls_status.receipts &&
              calls_status.receipts.map((r) => (
                <Row
                  key={r.transactionHash}
                  label="Tx"
                  value={r.transactionHash}
                  mono
                />
              ))}
          </>
        )}
      </div>
      {error && (
        <p
          style={{
            color: "#e53e3e",
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          {error}
        </p>
      )}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {!owner && (
          <Button onClick={connect}>Connect wallet</Button>
        )}
        {owner && (
          <Button onClick={send_batch} disabled={loading}>
            {loading
              ? "Signing & broadcasting…"
              : batch_id
                ? "Send another batch"
                : "Send batch"}
          </Button>
        )}
        {batch_id && (
          <Button
            variant="secondary"
            onClick={poll_status}
            disabled={polling}
          >
            {polling ? "Polling…" : "Refresh status"}
          </Button>
        )}
      </div>
      {!owner && (
        <p
          style={{
            fontSize: 13,
            color: "#999",
            marginTop: 12,
          }}
        >
          Needs the Ethernauta extension installed and
          Sepolia ETH in the connected account.
        </p>
      )}
    </div>
  )
}

function Row({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        padding: "10px 0",
        borderBottom: "1px solid #f0f0f0",
        fontSize: 14,
      }}
    >
      <span style={{ color: "#666", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: mono ? "monospace" : "inherit",
          color: "#1a1a1a",
          textAlign: "right",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    </div>
  )
}
