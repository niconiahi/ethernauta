import "./demo.css"
import {
  check_stealth_address,
  compute_view_tag,
  derive_meta_address,
  format_stealth_meta_address,
  generate_stealth_address,
  parse_stealth_meta_address,
  type StealthMetaAddress,
} from "@ethernauta/erc/5564"
import { useMemo, useState } from "react"
import {
  type InferOutput,
  number,
  object,
  string,
} from "valibot"
import { Button } from "../../components/button"

function hex_to_bytes_local(
  _hex: `0x${string}`,
): Uint8Array {
  const stripped = _hex.toLowerCase().replace(/^0x/, "")
  const out = new Uint8Array(stripped.length / 2)
  for (let i = 0; i < out.length; i++) {
    out[i] = Number.parseInt(
      stripped.slice(i * 2, i * 2 + 2),
      16,
    )
  }
  return out
}

function random_32_bytes_hex(): `0x${string}` {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  let hex = "0x"
  for (const b of bytes) {
    hex += b.toString(16).padStart(2, "0")
  }
  return hex as `0x${string}`
}

const GeneratedSchema = object({
  stealth_address: string(),
  ephemeral_public_key: string(),
  view_tag: number(),
})
type Generated = InferOutput<typeof GeneratedSchema>

export function Stealth5564Demo() {
  const [spending_priv, set_spending_priv] = useState(() =>
    random_32_bytes_hex(),
  )
  const [viewing_priv, set_viewing_priv] = useState(() =>
    random_32_bytes_hex(),
  )
  const [meta_input, set_meta_input] = useState<string>("")
  const [generated, set_generated] =
    useState<Generated | null>(null)
  const [scan_input, set_scan_input] = useState<string>("")
  const [match_result, set_match_result] = useState<
    string | null
  >(null)
  const [error, set_error] = useState<string | null>(null)

  const meta = useMemo<StealthMetaAddress | null>(() => {
    try {
      return derive_meta_address({
        spending_private_key: hex_to_bytes_local(
          spending_priv as `0x${string}`,
        ),
        viewing_private_key: hex_to_bytes_local(
          viewing_priv as `0x${string}`,
        ),
      })
    } catch {
      return null
    }
  }, [spending_priv, viewing_priv])

  const meta_hex = useMemo(
    () => (meta ? format_stealth_meta_address(meta) : ""),
    [meta],
  )

  function generate() {
    set_error(null)
    set_generated(null)
    try {
      const parsed = meta_input
        ? parse_stealth_meta_address(
            meta_input as `0x${string}`,
          )
        : meta
      if (!parsed) throw new Error("no meta-address")
      const result = generate_stealth_address({
        meta: parsed,
      })
      set_generated({
        stealth_address: result.stealth_address,
        ephemeral_public_key: result.ephemeral_public_key,
        view_tag: result.view_tag,
      })
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    }
  }

  function scan() {
    set_error(null)
    set_match_result(null)
    if (!meta) {
      set_error("Set recipient keys first.")
      return
    }
    try {
      const ephemeral_hex = scan_input as `0x${string}`
      const viewing_bytes = hex_to_bytes_local(
        viewing_priv as `0x${string}`,
      )
      const tag = compute_view_tag({
        viewing_private_key: viewing_bytes,
        ephemeral_public_key: ephemeral_hex,
      })
      const addr = check_stealth_address({
        viewing_private_key: viewing_bytes,
        spending_public_key: meta.spending_public_key,
        ephemeral_public_key: ephemeral_hex,
      })
      set_match_result(`view_tag=${tag} → ${addr}`)
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    }
  }

  return (
    <div className="stealth-5564-root">
      <h3 className="stealth-5564-heading">Recipient</h3>
      <Field
        label="Spending private key"
        value={spending_priv}
        onChange={(v) =>
          set_spending_priv(v as `0x${string}`)
        }
      />
      <Field
        label="Viewing private key"
        value={viewing_priv}
        onChange={(v) =>
          set_viewing_priv(v as `0x${string}`)
        }
      />
      <Button
        variant="secondary"
        onClick={() => {
          set_spending_priv(random_32_bytes_hex())
          set_viewing_priv(random_32_bytes_hex())
        }}
      >
        Randomize recipient
      </Button>
      <div className="stealth-5564-meta-row">
        <Row
          label="Recipient meta-address"
          value={meta_hex}
          mono
        />
      </div>

      <h3 className="stealth-5564-heading">
        Sender — derive a stealth address
      </h3>
      <Field
        label="Recipient meta-address (paste, or use the one above)"
        value={meta_input}
        onChange={set_meta_input}
        placeholder={meta_hex}
      />
      <Button onClick={generate}>
        Generate stealth address
      </Button>
      {generated && (
        <div className="stealth-5564-generated">
          <Row
            label="Stealth address"
            value={generated.stealth_address}
            mono
          />
          <Row
            label="Ephemeral pubkey"
            value={generated.ephemeral_public_key}
            mono
          />
          <Row
            label="View tag"
            value={`0x${generated.view_tag.toString(16).padStart(2, "0")} (${generated.view_tag})`}
            mono
          />
        </div>
      )}

      <h3 className="stealth-5564-heading is-spaced">
        Recipient — check an announcement
      </h3>
      <Field
        label="Ephemeral public key from announcement"
        value={scan_input}
        onChange={set_scan_input}
        placeholder={
          generated?.ephemeral_public_key ?? "0x…"
        }
      />
      <Button variant="secondary" onClick={scan}>
        Recover stealth address
      </Button>
      {match_result && (
        <p className="stealth-5564-match">{match_result}</p>
      )}
      {error && (
        <p className="stealth-5564-error">{error}</p>
      )}
      <p className="stealth-5564-footnote">
        All math runs in-browser. Nothing is broadcast.
        Privates above are demo data — replace with a real
        wallet integration before relying on this.
      </p>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  placeholder?: string
}) {
  return (
    <label className="stealth-5564-field">
      <span className="stealth-5564-field-label">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.currentTarget.value.trim())
        }
        className="stealth-5564-field-input"
      />
    </label>
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
    <div className="stealth-5564-row">
      <span className="stealth-5564-row-label">
        {label}
      </span>
      <span
        className={
          mono
            ? "stealth-5564-row-value is-mono"
            : "stealth-5564-row-value"
        }
      >
        {value}
      </span>
    </div>
  )
}
