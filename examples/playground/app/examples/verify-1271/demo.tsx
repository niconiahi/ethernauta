import { eip155_11155111 } from "@ethernauta/chain"
import {
  addressSchema,
  type Bytes,
  bytesSchema,
} from "@ethernauta/core"
import { personal_sign } from "@ethernauta/eip/191"
import { verify_message_1271 as verify_message } from "@ethernauta/signature"
import {
  create_reader,
  create_signer,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { useState } from "react"
import { parse } from "valibot"
import { Button } from "../../components/button"
import { SignInHint } from "../../components/sign-in-hint"
import { use_session } from "../../lib/auth/use-session"

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

const CHAINS = [
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [
      http("https://ethereum-sepolia-rpc.publicnode.com"),
    ],
  },
]
const reader = create_reader(CHAINS)
const signer = create_signer(CHAINS)

const MESSAGE = "Verify me with EIP-1271"

export function Verify1271Demo() {
  const session = use_session()
  const owner = session
    ? parse(addressSchema, session.address)
    : null
  const [signature, set_signature] = useState<Bytes | null>(
    null,
  )
  const [valid, set_valid] = useState<boolean | null>(null)
  const [busy, set_busy] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  async function sign_and_verify() {
    if (!owner) return
    set_busy(true)
    set_error(null)
    set_valid(null)
    set_signature(null)
    try {
      const raw_sig = await personal_sign([MESSAGE, owner])(
        signer({ chain_id: SEPOLIA_CHAIN_ID }),
      )
      const sig = parse(bytesSchema, raw_sig)
      set_signature(sig)
      const ok = await verify_message({
        address: owner,
        message: MESSAGE,
        signature: sig,
      })(reader({ chain_id: SEPOLIA_CHAIN_ID }))
      set_valid(ok)
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    } finally {
      set_busy(false)
    }
  }

  async function tamper_and_reverify() {
    if (!owner || !signature) return
    set_busy(true)
    set_error(null)
    try {
      const flipped = flip_last_byte(signature)
      const ok = await verify_message({
        address: owner,
        message: MESSAGE,
        signature: flipped,
      })(reader({ chain_id: SEPOLIA_CHAIN_ID }))
      set_valid(ok)
      set_signature(flipped)
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    } finally {
      set_busy(false)
    }
  }

  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 8,
        background: "#fff",
      }}
    >
      <Row label="Message" value={MESSAGE} />
      <Row label="Chain" value="Sepolia" />
      {owner && <Row label="Owner" value={owner} mono />}
      {signature && (
        <Row label="Signature" value={signature} mono />
      )}
      {valid !== null && (
        <Row
          label="verify_message"
          value={valid ? "true ✓" : "false ✗"}
        />
      )}
      {error && (
        <p style={{ color: "crimson", margin: 0 }}>
          {error}
        </p>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        {!owner && <SignInHint />}
        {owner && (
          <Button onClick={sign_and_verify} disabled={busy}>
            {busy ? "…" : "Sign + verify"}
          </Button>
        )}
        {signature && (
          <Button
            onClick={tamper_and_reverify}
            disabled={busy}
          >
            Tamper one byte
          </Button>
        )}
      </div>
    </div>
  )
}

function flip_last_byte(hex: Bytes): Bytes {
  const body = hex.slice(2)
  const last = body.slice(-2)
  const byte = (Number.parseInt(last, 16) ^ 0x01)
    .toString(16)
    .padStart(2, "0")
  return parse(bytesSchema, `0x${body.slice(0, -2)}${byte}`)
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
        gap: 12,
        fontSize: 14,
      }}
    >
      <span style={{ color: "#666" }}>{label}</span>
      <span
        style={{
          fontFamily: mono ? "monospace" : "inherit",
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
