import {
  decode_function_call,
  make_codec,
  to_selector,
} from "@ethernauta/abi"
import { AddressSchema } from "@ethernauta/core"
import { REGISTRY } from "@ethernauta/erc/registry"
import { GenericTransactionSchema } from "@ethernauta/eth"
import type { FunctionSignature } from "@ethernauta/transport"
import { ParametersSchema } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { ComponentChildren } from "preact"
import {
  array,
  type InferOutput,
  literal,
  object,
  optional,
  parse,
  pipe,
  readonly,
  safeParse,
  string,
  union,
} from "valibot"
import { Button } from "../../components/button"
import {
  get_reader,
  selected_chain,
} from "../../utils/chain"
import type {
  EthernautaResponse,
  TransactionRejectedResponse,
} from "../../utils/event"
import { row_key } from "../../utils/row-key"
import {
  get_nonce,
  sign_transaction,
} from "../../utils/sign-transaction"
import { transaction_request } from "../../utils/transaction"
import { active_account } from "../../utils/wallet"

function format_primitive(value: unknown): string {
  if (value === null || value === undefined) return ""
  if (typeof value === "string") return value
  return String(value)
}

function is_record(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  )
}

function looks_like_calldata(
  value: unknown,
): value is `0x${string}` {
  return (
    typeof value === "string" &&
    value.startsWith("0x") &&
    value.length >= 10 &&
    (value.length - 2) % 2 === 0
  )
}

const DecodeEntrySchema = object({
  name: string(),
  signature: string(),
  types: pipe(array(string()), readonly()),
  param_names: pipe(array(string()), readonly()),
  source: union([literal("sidecar"), literal("bundled")]),
})
type DecodeEntry = InferOutput<typeof DecodeEntrySchema>

const TxSummarySchema = object({
  to: optional(string()),
  value: optional(string()),
  input: optional(string()),
})
type TxSummary = InferOutput<typeof TxSummarySchema>

function lookup_registry(
  selector: string,
): DecodeEntry | undefined {
  for (const [sel, entry] of Object.entries(REGISTRY)) {
    if (sel === selector) {
      return { ...entry, source: "bundled" }
    }
  }
  return undefined
}

function parse_signature(
  signature: string,
): { name: string; types: string[] } | undefined {
  const open = signature.indexOf("(")
  const close = signature.lastIndexOf(")")
  if (
    open <= 0 ||
    close <= open ||
    close !== signature.length - 1
  ) {
    return undefined
  }
  const name = signature.slice(0, open)
  const inner = signature.slice(open + 1, close)
  if (inner.length === 0) return { name, types: [] }
  return { name, types: inner.split(",") }
}

function selector_matches(
  signature: string,
  selector_hex: string,
): boolean {
  const bytes = to_selector(signature)
  return bytes_to_hex(bytes) === selector_hex.toLowerCase()
}

function lookup_sidecar(
  selector: string,
  sidecar: FunctionSignature | undefined,
): DecodeEntry | undefined {
  if (!sidecar) return undefined
  if (!selector_matches(sidecar.signature, selector))
    return undefined
  const parsed = parse_signature(sidecar.signature)
  if (!parsed) return undefined
  return {
    name: parsed.name,
    signature: sidecar.signature,
    types: parsed.types,
    param_names: sidecar.names,
    source: "sidecar",
  }
}

function extract_ethernauta_function():
  | FunctionSignature
  | undefined {
  const raw = transaction_request.value.params
  const candidate = Array.isArray(raw)
    ? raw[0]
    : raw.transaction
  const result = safeParse(
    GenericTransactionSchema,
    candidate,
  )
  if (!result.success) return undefined
  return result.output._ethernauta?.function
}

function find_decode_entry(
  hex: `0x${string}`,
): DecodeEntry | undefined {
  const selector = hex.slice(0, 10).toLowerCase()
  const sidecar = extract_ethernauta_function()
  return (
    lookup_sidecar(selector, sidecar) ??
    lookup_registry(selector)
  )
}

function decode_with_entry(
  entry: DecodeEntry,
  hex: `0x${string}`,
): unknown[] | undefined {
  try {
    const codecs = entry.types.map(make_codec)
    const { args } = decode_function_call(codecs, hex)
    return [...args]
  } catch {
    // make_codec rejects tuples / unsupported types, and
    // decode_function_call throws on malformed calldata. Either
    // path means we can't decode — fall through to raw-hex render.
    return undefined
  }
}

function DecodedCall({
  hex,
  entry,
  args,
}: {
  hex: `0x${string}`
  entry: DecodeEntry
  args: unknown[]
}) {
  const args_count = Math.max(
    entry.types.length,
    entry.param_names.length,
  )
  const labels = Array.from(
    { length: args_count },
    (_, i) =>
      entry.param_names[i] || entry.types[i] || String(i),
  )
  return (
    <div className="flex flex-col gap-1 text-xs">
      <div className="font-mono font-bold break-all">
        {entry.name}(
        {entry.types
          .map((t, i) =>
            `${t} ${entry.param_names[i] ?? ""}`.trim(),
          )
          .join(", ")}
        )
      </div>
      <dl className="flex flex-col gap-1 pl-2 border-l-2 border-[var(--border)]">
        {labels.map((label, i) => (
          <Field
            key={row_key(label, args[i])}
            label={label}
            value={args[i]}
          />
        ))}
      </dl>
      <details className="text-[10px] opacity-70">
        <summary className="cursor-pointer">raw</summary>
        <div className="font-mono break-all pt-1">
          {hex}
        </div>
      </details>
    </div>
  )
}

function Field({
  label,
  value,
}: {
  label: string
  value: unknown
}) {
  if (looks_like_calldata(value)) {
    const entry = find_decode_entry(value)
    if (entry) {
      const args = decode_with_entry(entry, value)
      if (args) {
        return (
          <div className="flex flex-col gap-0.5 text-xs">
            <dt className="font-bold">{label}</dt>
            <dd>
              <DecodedCall
                hex={value}
                entry={entry}
                args={args}
              />
            </dd>
          </div>
        )
      }
    }
  }
  if (is_record(value)) {
    return (
      <div className="flex flex-col gap-1 text-xs">
        <span className="font-bold">{label}</span>
        <dl className="flex flex-col gap-1 pl-2 border-l-2 border-[var(--border)]">
          {Object.entries(value).map(([k, v]) => (
            <Field key={k} label={k} value={v} />
          ))}
        </dl>
      </div>
    )
  }
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-col gap-1 text-xs">
        <span className="font-bold">{label}</span>
        <dl className="flex flex-col gap-1 pl-2 border-l-2 border-[var(--border)]">
          {value.map((v, i) => (
            <Field
              key={row_key(label, v)}
              label={String(i)}
              value={v}
            />
          ))}
        </dl>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-0.5 text-xs">
      <dt className="font-bold">{label}</dt>
      <dd className="font-mono break-all">
        {format_primitive(value)}
      </dd>
    </div>
  )
}

function Params() {
  const params = parse(
    ParametersSchema,
    transaction_request.value.params,
  )
  const entries = Array.isArray(params)
    ? params.map(
        (value, index) => [String(index), value] as const,
      )
    : Object.entries(params)
  return (
    <dl className="flex flex-col gap-2">
      {entries.map(([key, value]) => (
        <Field key={key} label={key} value={value} />
      ))}
    </dl>
  )
}

function extract_tx(): TxSummary | null {
  const raw = transaction_request.value.params
  const candidate = Array.isArray(raw)
    ? raw[0]
    : raw.transaction
  const result = safeParse(TxSummarySchema, candidate)
  if (!result.success) return null
  return result.output
}

function is_value_zero(value: string | undefined): boolean {
  if (!value) return true
  if (value === "0x" || value === "0x0") return true
  return /^0x0+$/.test(value)
}

function try_decode(input: string | undefined): {
  hex: `0x${string}`
  entry: DecodeEntry
  args: unknown[]
} | null {
  if (!input || !looks_like_calldata(input)) return null
  const entry = find_decode_entry(input)
  if (!entry) return null
  const args = decode_with_entry(entry, input)
  if (!args) return null
  return { hex: input, entry, args }
}

function SectionLabel({
  children,
}: {
  children: ComponentChildren
}) {
  return (
    <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
      {children}
    </p>
  )
}

function SectionValue({
  children,
}: {
  children: ComponentChildren
}) {
  return (
    <p className="font-mono text-sm font-semibold break-all">
      {children}
    </p>
  )
}

function DecodedSign({
  to,
  value,
  input,
  entry,
  args,
}: {
  to?: string
  value?: string
  input: `0x${string}`
  entry: DecodeEntry
  args: unknown[]
}) {
  const labels =
    entry.param_names.length > 0
      ? entry.param_names
      : entry.types.map((_, i) => String(i))
  return (
    <section className="rounded-md border-2 border-[var(--text)] bg-[var(--surface-strong)] p-3 flex flex-col gap-2">
      {to && (
        <div className="flex flex-col gap-0.5">
          <SectionLabel>To</SectionLabel>
          <SectionValue>{to}</SectionValue>
        </div>
      )}
      {!is_value_zero(value) && (
        <div className="flex flex-col gap-0.5">
          <SectionLabel>Value</SectionLabel>
          <SectionValue>{value}</SectionValue>
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        <SectionLabel>Method</SectionLabel>
        <SectionValue>{entry.name}</SectionValue>
      </div>
      <div className="flex flex-col gap-1">
        <SectionLabel>Params</SectionLabel>
        <dl className="flex flex-col gap-1 pl-2 border-l-2 border-[var(--border)]">
          {labels.map((label, i) => (
            <Field
              key={row_key(label, args[i])}
              label={label}
              value={args[i]}
            />
          ))}
        </dl>
      </div>
      <details className="text-[10px] opacity-70">
        <summary className="cursor-pointer">raw</summary>
        <div className="font-mono break-all pt-1">
          {input}
        </div>
      </details>
    </section>
  )
}

export function Sign() {
  const tx = extract_tx()
  const decoded = try_decode(tx?.input)
  return (
    <main className="flex flex-col gap-3 p-4 w-80 text-base">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-bold leading-tight">
          You are about to sign
        </h1>
      </header>
      {decoded ? (
        <DecodedSign
          to={tx?.to}
          value={tx?.value}
          input={decoded.hex}
          entry={decoded.entry}
          args={decoded.args}
        />
      ) : (
        <>
          <section className="rounded-md border-2 border-[var(--text)] bg-[var(--surface-strong)] p-3">
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Method
            </p>
            <p className="font-mono text-sm font-semibold break-all">
              {transaction_request.value.method}
            </p>
          </section>
          <section className="rounded-md border-2 border-[var(--text)] bg-[var(--surface-strong)] p-3 flex flex-col gap-2">
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Params
            </p>
            <Params />
          </section>
        </>
      )}
      <div className="flex flex-col gap-2">
        <Button
          onClick={async () => {
            const address = parse(
              AddressSchema,
              active_account.value.address,
            )
            const key = active_account.value.key
            const { chain_id, reader } = get_reader(
              selected_chain.value,
            )
            const nonce = await get_nonce(
              address,
              reader({ chain_id }),
            )
            const signed_transaction =
              await sign_transaction({
                key,
                nonce,
                method: transaction_request.value.method,
                params: transaction_request.value.params,
                to: transaction_request.value.to,
              })
            const response: EthernautaResponse = {
              id: transaction_request.value.id,
              type: "ETHERNAUTA_RESPONSE_SIGNED_TRANSACTION",
              signed_transaction: bytes_to_hex(
                signed_transaction,
              ),
            }
            chrome.runtime.sendMessage(response)
            window.close()
          }}
        >
          Sign
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const response: TransactionRejectedResponse = {
              id: transaction_request.value.id,
              type: "ETHERNAUTA_RESPONSE_TRANSACTION_REJECTED",
            }
            chrome.runtime.sendMessage(response)
            window.close()
          }}
        >
          Reject
        </Button>
      </div>
    </main>
  )
}
