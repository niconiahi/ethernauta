import { personal_sign_message } from "@ethernauta/crypto"
import {
  parse_siwe_message,
  type SiweMessage,
} from "@ethernauta/eip/4361"
import { Button } from "../../components/button"
import { get_private_key } from "../../utils/crypto"
import type {
  PersonalSignResponse,
  TransactionRejectedResponse,
} from "../../utils/event"
import { personal_sign_request } from "../../utils/transaction"
import { active_account } from "../../utils/wallet"

function display_message(raw: string): string {
  if (raw.startsWith("0x")) {
    try {
      const bytes = new Uint8Array(
        (raw.slice(2).match(/.{1,2}/g) ?? []).map((h) =>
          Number.parseInt(h, 16),
        ),
      )
      return new TextDecoder("utf-8", {
        fatal: true,
      }).decode(bytes)
    } catch {
      return raw
    }
  }
  return raw
}

function SiweView({ siwe }: { siwe: SiweMessage }) {
  return (
    <section className="rounded-md border-2 border-[var(--text)] bg-[var(--surface-strong)] p-3 flex flex-col gap-2 text-sm">
      <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
        Sign in with Ethereum
      </p>
      <Row label="Site" value={siwe.domain} />
      <Row label="URI" value={siwe.uri} />
      <Row label="Chain ID" value={siwe.chainId} />
      <Row label="Nonce" value={siwe.nonce} />
      <Row label="Issued" value={siwe.issuedAt} />
      {siwe.expirationTime && (
        <Row label="Expires" value={siwe.expirationTime} />
      )}
      {siwe.statement && (
        <Row label="Statement" value={siwe.statement} />
      )}
    </section>
  )
}

function Row({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </span>
      <span className="font-mono break-all">{value}</span>
    </div>
  )
}

export function PersonalSign() {
  const req = personal_sign_request.value
  if (!req) {
    return (
      <main className="p-4 w-80 text-sm text-[var(--text-muted)]">
        No personal-sign request pending.
      </main>
    )
  }
  const display = display_message(req.message)
  const siwe = parse_siwe_message(display)
  return (
    <main className="flex flex-col gap-3 p-4 w-80 text-base">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-bold leading-tight">
          You are about to sign a message
        </h1>
        <p className="text-xs text-[var(--text-muted)]">
          EIP-191 — prefixed personal_sign.
        </p>
      </header>
      <section className="rounded-md border-2 border-[var(--text)] bg-[var(--surface-strong)] p-3 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
          Account
        </p>
        <p className="font-mono text-xs break-all">
          {req.address}
        </p>
      </section>
      {siwe ? (
        <SiweView siwe={siwe} />
      ) : (
        <section className="rounded-md border-2 border-[var(--text)] bg-[var(--surface-strong)] p-3 flex flex-col gap-2">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Message
          </p>
          <pre className="whitespace-pre-wrap break-words text-sm font-mono">
            {display}
          </pre>
        </section>
      )}
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => {
            const private_key = get_private_key(
              active_account.value.key,
            )
            const signature = personal_sign_message(
              req.message,
              private_key,
            )
            const response: PersonalSignResponse = {
              id: req.id,
              type: "ETHERNAUTA_RESPONSE_PERSONAL_SIGNED",
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
