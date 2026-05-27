import {
  type Address,
  addressSchema,
  bytes32Schema,
} from "@ethernauta/core"
import {
  get_contract_address,
  get_create2_address,
} from "@ethernauta/eip/1014"
import { useState } from "react"
import { parse } from "valibot"
import { Button } from "../../components/button"

// Stand-in `keccak256(init_code)` — any 32-byte hex works for
// the derivation; the caller is responsible for hashing their
// real init code (creation bytecode + constructor calldata)
// before passing it as `bytecodeHash`.
const BYTECODE_HASH = parse(
  bytes32Schema,
  "0xd6fb717f7e270a360f5093ce6a7a3752183e89c9a9afe5c0cb54b204a3902895",
)

const CREATE_FROM = parse(
  addressSchema,
  "0x0000000000000000000000000000000000000042",
)
const CREATE_NONCE = 7n

const CREATE2_FROM = parse(
  addressSchema,
  "0x00000000000000000000000000000000deadbeef",
)
const CREATE2_SALT = parse(
  bytes32Schema,
  "0x00000000000000000000000000000000000000000000000000000000cafebabe",
)

export function DeployContractDemo() {
  const [create_address, set_create_address] =
    useState<Address | null>(null)
  const [create2_address, set_create2_address] =
    useState<Address | null>(null)
  const [error, set_error] = useState<string | null>(null)

  function derive() {
    set_error(null)
    try {
      set_create_address(
        get_contract_address({
          from: CREATE_FROM,
          nonce: CREATE_NONCE,
        }),
      )
      set_create2_address(
        get_create2_address({
          from: CREATE2_FROM,
          salt: CREATE2_SALT,
          bytecodeHash: BYTECODE_HASH,
        }),
      )
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    }
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
      <Section title="CREATE">
        <Row label="from" value={CREATE_FROM} mono />
        <Row
          label="nonce"
          value={CREATE_NONCE.toString()}
        />
        {create_address && (
          <Row
            label="contract address"
            value={create_address}
            mono
            highlight
          />
        )}
      </Section>
      <Section title="CREATE2">
        <Row label="from" value={CREATE2_FROM} mono />
        <Row label="salt" value={CREATE2_SALT} mono />
        <Row
          label="keccak256(init code)"
          value={BYTECODE_HASH}
          mono
        />
        {create2_address && (
          <Row
            label="contract address"
            value={create2_address}
            mono
            highlight
          />
        )}
      </Section>
      {error && (
        <p style={{ color: "crimson", margin: 0 }}>
          {error}
        </p>
      )}
      <div>
        <Button onClick={derive}>Derive addresses</Button>
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      style={{
        display: "grid",
        gap: 4,
        padding: 12,
        border: "1px solid #eee",
        borderRadius: 6,
      }}
    >
      <h4 style={{ margin: "0 0 4px", fontSize: 14 }}>
        {title}
      </h4>
      {children}
    </section>
  )
}

function Row({
  label,
  value,
  mono,
  highlight,
}: {
  label: string
  value: string
  mono?: boolean
  highlight?: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        fontSize: 13,
        padding: highlight ? "4px 6px" : 0,
        background: highlight ? "#fff7e6" : "transparent",
        borderRadius: highlight ? 4 : 0,
      }}
    >
      <span style={{ color: "#666", whiteSpace: "nowrap" }}>
        {label}
      </span>
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
