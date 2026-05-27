// Each button below fires the same Readable method twice:
// `method()(provider.reader({ chain_id }))`. The transport
// is the user's selected EIP-1193 wallet — same call shape
// as a public-RPC reader, different transport-construction
// line.

import { addressSchema } from "@ethernauta/core"
import {
  eth_blockNumber,
  eth_chainId,
  eth_gasPrice,
  eth_getBalance,
  eth_maxPriorityFeePerGas,
} from "@ethernauta/eth"
import { useProvider } from "@ethernauta/react"
import { encode_chain_id } from "@ethernauta/transport"
import { useState } from "react"
import { parse } from "valibot"
import { Button } from "../../components/button"
import { SignInHint } from "../../components/sign-in-hint"
import { use_session } from "../../lib/auth/use-session"
import { PROVIDER_STORE_KEY } from "../../lib/provider-store"

// The injected provider answers from its own selected-chain
// state — this CAIP-2 id just satisfies the resolver context.
const DISCOVERY_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: 1,
})

export function ProviderReadsDemo() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [results, set_results] = useState<
    Record<string, string>
  >({})
  const [in_flight, set_in_flight] = useState<string | null>(
    null,
  )
  const [error, set_error] = useState<string | null>(null)

  async function run(
    method_name: string,
    runner: () => Promise<string>,
  ) {
    if (!provider) return
    set_in_flight(method_name)
    set_error(null)
    try {
      const value = await runner()
      set_results((prev) => ({ ...prev, [method_name]: value }))
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    } finally {
      set_in_flight(null)
    }
  }

  const reader = provider
    ? provider.reader({ chain_id: DISCOVERY_CHAIN_ID })
    : null

  if (!provider) {
    return (
      <div
        style={{
          padding: 16,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 8,
          fontSize: 14,
          color: "#555",
        }}
      >
        Pick a wallet first (try the{" "}
        <code>EIP-6963</code> example).
      </div>
    )
  }

  return (
    <div
      style={{
        display: "grid",
        gap: 12,
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 8,
        background: "#fff",
      }}
    >
      <ReadRow
        label="eth_blockNumber"
        result={results.eth_blockNumber}
        loading={in_flight === "eth_blockNumber"}
        disabled={in_flight !== null}
        onClick={() =>
          run("eth_blockNumber", async () => {
            if (!reader) throw new Error("No provider")
            return await eth_blockNumber()(reader)
          })
        }
      />
      <ReadRow
        label="eth_chainId"
        result={results.eth_chainId}
        loading={in_flight === "eth_chainId"}
        disabled={in_flight !== null}
        onClick={() =>
          run("eth_chainId", async () => {
            if (!reader) throw new Error("No provider")
            return await eth_chainId()(reader)
          })
        }
      />
      <ReadRow
        label="eth_gasPrice"
        result={results.eth_gasPrice}
        loading={in_flight === "eth_gasPrice"}
        disabled={in_flight !== null}
        onClick={() =>
          run("eth_gasPrice", async () => {
            if (!reader) throw new Error("No provider")
            return await eth_gasPrice()(reader)
          })
        }
      />
      <ReadRow
        label="eth_maxPriorityFeePerGas"
        result={results.eth_maxPriorityFeePerGas}
        loading={in_flight === "eth_maxPriorityFeePerGas"}
        disabled={in_flight !== null}
        onClick={() =>
          run("eth_maxPriorityFeePerGas", async () => {
            if (!reader) throw new Error("No provider")
            return await eth_maxPriorityFeePerGas()(reader)
          })
        }
      />
      <ReadRow
        label="eth_getBalance (connected account)"
        result={results.eth_getBalance}
        loading={in_flight === "eth_getBalance"}
        disabled={in_flight !== null || !owner}
        onClick={() =>
          run("eth_getBalance", async () => {
            if (!reader) throw new Error("No provider")
            if (!owner) throw new Error("Sign in first")
            return await eth_getBalance({
              address: parse(addressSchema, owner),
              block: "latest",
            })(reader)
          })
        }
      />
      {!owner && (
        <div style={{ marginTop: 4 }}>
          <SignInHint />
        </div>
      )}
      {error && (
        <p
          style={{
            color: "#e53e3e",
            fontSize: 14,
            margin: 0,
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
}

function ReadRow({
  label,
  result,
  loading,
  disabled,
  onClick,
}: {
  label: string
  result: string | undefined
  loading: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 14,
            color: "#1a1a1a",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 13,
            color: "#666",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {result ?? "—"}
        </span>
      </div>
      <Button
        variant="secondary"
        onClick={onClick}
        disabled={disabled}
      >
        {loading ? "…" : "Read"}
      </Button>
    </div>
  )
}
