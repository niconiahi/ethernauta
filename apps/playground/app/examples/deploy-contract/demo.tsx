import "./demo.css"
import {
  type Address,
  AddressSchema,
  Bytes32Schema,
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
  Bytes32Schema,
  "0xd6fb717f7e270a360f5093ce6a7a3752183e89c9a9afe5c0cb54b204a3902895",
)

const CREATE_FROM = parse(
  AddressSchema,
  "0x0000000000000000000000000000000000000042",
)
const CREATE_NONCE = 7n

const CREATE2_FROM = parse(
  AddressSchema,
  "0x00000000000000000000000000000000deadbeef",
)
const CREATE2_SALT = parse(
  Bytes32Schema,
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
    <div className="deploy-contract-root">
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
        <p className="deploy-contract-error">{error}</p>
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
    <section className="deploy-contract-section">
      <h4 className="deploy-contract-section-title">
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
      className={
        highlight
          ? "deploy-contract-row is-highlight"
          : "deploy-contract-row"
      }
    >
      <span className="deploy-contract-row-label">
        {label}
      </span>
      <span
        className={
          mono
            ? "deploy-contract-row-value is-mono"
            : "deploy-contract-row-value"
        }
      >
        {value}
      </span>
    </div>
  )
}
