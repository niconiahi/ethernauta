import {
  type Address,
  addressSchema,
  type Bytes,
  bytesSchema,
} from "@ethernauta/core"
import {
  is_wrapped_signature,
  MAGIC_BYTES,
  unwrap_signature,
  wrap_signature,
} from "@ethernauta/eip/6492"
import { useMemo, useState } from "react"
import { parse } from "valibot"
import { Button } from "../../components/button"

// Sample inputs — values are illustrative; in practice
// `factory` + `factoryData` come from the SCA's
// counterfactual deploy plan and `signature` is whatever
// the 1271 verifier of that account would accept once
// deployed.
const FACTORY: Address = parse(
  addressSchema,
  "0x000000000000000000000000000000000000FA01",
)
const FACTORY_DATA: Bytes = parse(
  bytesSchema,
  "0xdeadbeefcafebabe",
)
const INNER_SIGNATURE: Bytes = parse(
  bytesSchema,
  `0x${"42".repeat(65)}`,
)

export function Verify6492Demo() {
  const [wrapped, set_wrapped] = useState<Bytes | null>(
    null,
  )
  const [unwrapped, set_unwrapped] = useState<{
    factory: Address
    factoryData: Bytes
    signature: Bytes
  } | null>(null)
  const [error, set_error] = useState<string | null>(null)

  const plain_is_wrapped = useMemo(
    () => is_wrapped_signature(INNER_SIGNATURE),
    [],
  )

  function do_wrap() {
    set_error(null)
    try {
      const result = wrap_signature({
        factory: FACTORY,
        factoryData: FACTORY_DATA,
        signature: INNER_SIGNATURE,
      })
      set_wrapped(result)
      const back = unwrap_signature(result)
      if (!back) {
        set_error("unwrap_signature returned null")
        return
      }
      set_unwrapped({
        factory: back.factory,
        factoryData: back.factoryData,
        signature: back.signature,
      })
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
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
      <Row label="Magic bytes" value={MAGIC_BYTES} mono />
      <Row label="factory" value={FACTORY} mono />
      <Row label="factoryData" value={FACTORY_DATA} mono />
      <Row
        label="signature (inner)"
        value={INNER_SIGNATURE}
        mono
      />
      <Row
        label="is_wrapped_signature(plain)"
        value={plain_is_wrapped ? "true" : "false"}
      />
      {wrapped && (
        <>
          <Row
            label="wrap_signature → "
            value={wrapped}
            mono
          />
          <Row
            label="is_wrapped_signature(wrapped)"
            value={
              is_wrapped_signature(wrapped)
                ? "true"
                : "false"
            }
          />
        </>
      )}
      {unwrapped && (
        <>
          <Row
            label="unwrap → factory"
            value={unwrapped.factory}
            mono
          />
          <Row
            label="unwrap → factoryData"
            value={unwrapped.factoryData}
            mono
          />
          <Row
            label="unwrap → signature"
            value={unwrapped.signature}
            mono
          />
        </>
      )}
      {error && (
        <p style={{ color: "crimson", margin: 0 }}>
          {error}
        </p>
      )}
      <div>
        <Button onClick={do_wrap}>Wrap + unwrap</Button>
      </div>
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
        gap: 12,
        fontSize: 14,
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
