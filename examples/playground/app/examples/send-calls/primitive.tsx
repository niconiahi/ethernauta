// Path 2 — the Ethernauta primitive way. The wallet signs
// each call individually via `eth_signTransaction`; the
// dapp broadcasts each signed payload through a writer
// pointed at a public RPC, then waits for receipts via the
// tracker's `wait_for_receipt`. The dapp owns the
// lifecycle here — no `wallet_sendCalls` involved.

import { addressSchema, type Hash32 } from "@ethernauta/core"
import { create_injected_signer } from "@ethernauta/eip/1193"
import { use_provider_detail } from "@ethernauta/eip/6963/use-provider-detail"
import {
  eth_sendRawTransaction,
  eth_signTransaction,
} from "@ethernauta/eth"
import {
  create_tracker,
  wait_for_receipt,
  window_store,
} from "@ethernauta/transaction"
import { create_writer } from "@ethernauta/transport"
import { hex_to_number } from "@ethernauta/utils"
import { useState } from "react"
import { parse } from "valibot"
import { Button } from "../../components/button"
import { SignInHint } from "../../components/sign-in-hint"
import { use_session } from "../../lib/auth/use-session"
import { Row } from "./row"
import {
  CALLS,
  CHAINS,
  NETWORK_LABEL,
  SEPOLIA_CHAIN_ID,
} from "./shared"

const writer = create_writer(CHAINS)
const tracker = create_tracker(CHAINS, {
  store: window_store,
})

type CallState = {
  hash: Hash32 | null
  status: "signed" | "broadcast" | "mined" | "reverted"
}

export function SendCallsPrimitive() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider = use_provider_detail()
  const [states, set_states] = useState<CallState[]>([])

  async function run_batch() {
    if (!provider) return
    const signer = create_injected_signer(provider)
    set_states(
      CALLS.map(() => ({ hash: null, status: "signed" })),
    )
    for (const [i, call] of CALLS.entries()) {
      const signed = await eth_signTransaction([
        {
          from: parse(addressSchema, owner),
          to: call.to,
          value: call.value,
          input: call.data,
        },
      ])(signer({ chain_id: SEPOLIA_CHAIN_ID }))
      const hash = await eth_sendRawTransaction([signed])(
        writer({ chain_id: SEPOLIA_CHAIN_ID }),
      )
      set_states((prev) =>
        prev.map((s, idx) =>
          idx === i ? { hash, status: "broadcast" } : s,
        ),
      )
      const receipt = await wait_for_receipt([hash])(
        tracker({ chain_id: SEPOLIA_CHAIN_ID }),
      )
      const outcome =
        receipt.status &&
        hex_to_number(receipt.status) === 1
          ? "mined"
          : "reverted"
      set_states((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: outcome } : s,
        ),
      )
    }
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
      <Row
        label="Broadcast"
        value="public RPC (no wallet)"
      />
      <Row
        label="Receipts"
        value="wait_for_receipt (no wallet)"
      />
      {states.map((s, i) => (
        <Row
          // biome-ignore lint/suspicious/noArrayIndexKey: display-only, fixed-length batch
          key={i}
          label={`Call ${i + 1}`}
          value={
            s.hash
              ? `${s.status} · ${s.hash.slice(0, 10)}…`
              : s.status
          }
          mono
        />
      ))}
      <div style={{ marginTop: 16 }}>
        <Button onClick={run_batch}>
          Sign &amp; broadcast {CALLS.length} calls
        </Button>
      </div>
    </div>
  )
}
