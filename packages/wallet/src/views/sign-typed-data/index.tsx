import type { ComponentChildren } from "preact"
import { Button } from "../../components/button"
import { get_private_key } from "../../utils/crypto"
import type {
  SignTypedDataResponse,
  TransactionRejectedResponse,
} from "../../utils/event"
import { sign_typed_data } from "../../utils/sign-typed-data"
import { typed_data_request } from "../../utils/transaction"
import { active_account } from "../../utils/wallet"

function format_primitive(value: unknown): string {
  if (value === null || value === undefined) return ""
  if (typeof value === "bigint") return value.toString()
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

function Field({
  label,
  value,
}: {
  label: string
  value: unknown
}) {
  if (is_record(value)) {
    return (
      <div className="flex flex-col gap-1 text-xs">
        <span className="font-bold">{label}</span>
        <dl className="flex flex-col gap-1 pl-2 border-l-2 border-[#FF5005]/30">
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
        <dl className="flex flex-col gap-1 pl-2 border-l-2 border-[#FF5005]/30">
          {value.map((v, i) => (
            <Field
              // biome-ignore lint/suspicious/noArrayIndexKey: display-only, never reordered
              key={`${label}-${i}`}
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

function SectionLabel({
  children,
}: {
  children: ComponentChildren
}) {
  return (
    <p className="text-xs uppercase tracking-wide text-gray-500">
      {children}
    </p>
  )
}

export function SignTypedData() {
  const req = typed_data_request.value
  if (!req) {
    return (
      <main className="p-4 w-80 text-sm text-gray-500">
        No typed-data request pending.
      </main>
    )
  }
  const { typed_data } = req
  return (
    <main className="flex flex-col gap-3 p-4 w-80 text-base">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-bold leading-tight">
          You are about to sign typed data
        </h1>
        <p className="text-xs text-gray-500">
          EIP-712 — verify the domain matches the site you
          expect.
        </p>
      </header>

      <section className="rounded-md border-2 border-[#FF5005] bg-[color-mix(in_srgb,#FF5005_8%,#faf5f0)] p-3 flex flex-col gap-2">
        <SectionLabel>Domain</SectionLabel>
        <Field label="Domain" value={typed_data.domain} />
      </section>

      <section className="rounded-md border-2 border-[#FF5005] bg-[color-mix(in_srgb,#FF5005_8%,#faf5f0)] p-3 flex flex-col gap-2">
        <SectionLabel>Primary type</SectionLabel>
        <p className="font-mono text-sm font-semibold break-all">
          {typed_data.primaryType}
        </p>
      </section>

      <section className="rounded-md border-2 border-[#FF5005] bg-[color-mix(in_srgb,#FF5005_8%,#faf5f0)] p-3 flex flex-col gap-2">
        <SectionLabel>Message</SectionLabel>
        <Field
          label={typed_data.primaryType}
          value={typed_data.message}
        />
      </section>

      <div className="flex flex-col gap-2">
        <Button
          onClick={() => {
            const private_key = get_private_key(
              active_account.value.key,
            )
            const signature = sign_typed_data(
              typed_data,
              private_key,
            )
            const response: SignTypedDataResponse = {
              id: req.id,
              type: "ETHERNAUTA_RESPONSE_SIGNED_TYPED_DATA",
              signature,
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
              id: req.id,
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
