import { eip155_11155111 } from "@ethernauta/chain"
import { eth_requestAccounts } from "@ethernauta/eip/1102"
import { verify_message } from "@ethernauta/eip/1271"
import { personal_sign } from "@ethernauta/eip/191"
import {
  create_reader,
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
  const [owner, set_owner] = useState<`0x${string}` | null>(
    null,
  )
  const [signature, set_signature] = useState<
    `0x${string}` | null
  >(null)
  const [valid, set_valid] = useState<boolean | null>(null)
  const [busy, set_busy] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  async function connect() {
    set_error(null)
    try {
      const accounts = await eth_requestAccounts()(
        signer({ chain_id: SEPOLIA_CHAIN_ID }),
      )
      const first = accounts[0]
      if (first) set_owner(first as `0x${string}`)
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : String(e),
      )
    }
  }

  async function sign_and_verify() {
    if (!owner) return
    set_busy(true)
    set_error(null)
    set_valid(null)
    set_signature(null)
    try {
      const sig = await personal_sign([MESSAGE, owner])(
        signer({ chain_id: SEPOLIA_CHAIN_ID }),
      )
      set_signature(sig as `0x${string}`)
      const ok = await verify_message({
        address: owner,
        message: MESSAGE,
        signature: sig as `0x${string}`,
      })(reader({ chain_id: SEPOLIA_CHAIN_ID }))
      set_valid(ok)
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : String(e),
      )
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
      set_error(
        e instanceof Error ? e.message : String(e),
      )
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
        <p style={{ color: "crimson", margin: 0 }}>{error}</p>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        {!owner && (
          <Button onClick={connect}>Connect wallet</Button>
        )}
        {owner && (
          <Button onClick={sign_and_verify} disabled={busy}>
            {busy ? "…" : "Sign + verify"}
          </Button>
        )}
        {signature && (
          <Button onClick={tamper_and_reverify} disabled={busy}>
            Tamper one byte
          </Button>
        )}
      </div>
    </div>
  )
}

function flip_last_byte(hex: `0x${string}`): `0x${string}` {
  const body = hex.slice(2)
  const last = body.slice(-2)
  const byte = (parseInt(last, 16) ^ 0x01)
    .toString(16)
    .padStart(2, "0")
  return `0x${body.slice(0, -2)}${byte}` as `0x${string}`
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
