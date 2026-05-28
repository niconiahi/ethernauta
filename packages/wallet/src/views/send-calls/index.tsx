// https://eips.ethereum.org/EIPS/eip-5792

import {
  AddressSchema,
  BytesSchema,
  type Hash32,
  UintSchema,
} from "@ethernauta/core"
import type { SendCallsResult } from "@ethernauta/eip/5792"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { useState } from "preact/hooks"
import { parse } from "valibot"
import { Button } from "../../components/button"
import {
  generate_batch_id,
  set_batch,
} from "../../utils/calls-registry"
import {
  CHAINS,
  get_chain,
  get_reader,
  get_writer,
  selected_chain,
} from "../../utils/chain"
import {
  get_private_key,
  hex_to_big,
} from "../../utils/crypto"
import type {
  SignTransactionResponse,
  TransactionRejectedResponse,
} from "../../utils/event"
import {
  type Eip1559TransactionUnsigned,
  encode_eip155_transaction_unsigned,
  get_nonce,
} from "../../utils/sign-transaction"
import { send_calls_request } from "../../utils/transaction"
import { active_account } from "../../utils/wallet"

// testnet defaults — refunded under EIP-1559. revisit once
// eth_estimateGas + fee-market RPCs are wired through.
const MAX_PRIORITY_FEE_PER_GAS = 2_000_000_000n
const MAX_FEE_PER_GAS = 30_000_000_000n
const GAS_LIMIT = 500_000n
const ZERO_UINT = parse(UintSchema, "0x0")
const EMPTY_BYTES = parse(BytesSchema, "0x")

export function SendCalls() {
  const req = send_calls_request.value
  const [status, set_status] = useState<
    "idle" | "broadcasting" | "error"
  >("idle")
  const [error, set_error] = useState<string | null>(null)
  if (!req) {
    return (
      <main className="p-4 w-80 text-sm text-[var(--text-muted)]">
        No send-calls request pending.
      </main>
    )
  }
  const param = req.parameter
  const chain_ref = Number(hex_to_big(param.chainId))
  const chain = get_chain(chain_ref)
  const active_chain_id = selected_chain.value.id
  const wrong_chain =
    chain !== undefined && chain_ref !== active_chain_id
  const atomic_required = param.atomicRequired === true
  return (
    <main className="flex flex-col gap-3 p-4 w-80 text-base">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-bold leading-tight">
          Send a batch of calls
        </h1>
        <p className="text-xs text-[var(--text-muted)]">
          ERC-5792 — wallet_sendCalls.
        </p>
      </header>
      <section className="rounded-md border-2 border-[var(--text)] bg-[var(--surface-strong)] p-3 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
          Chain
        </p>
        <p className="font-mono text-xs break-all">
          {chain
            ? `${chain.name} (${chain.id})`
            : `Unknown chain: ${param.chainId}`}
        </p>
      </section>
      <section className="rounded-md border-2 border-[var(--text)] bg-[var(--surface-strong)] p-3 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
          {param.calls.length} call
          {param.calls.length === 1 ? "" : "s"}
        </p>
        <ol className="flex flex-col gap-2 list-decimal pl-5">
          {param.calls.map((call, i) => (
            <li
              key={`${i}-${call.to ?? "self"}`}
              className="text-xs flex flex-col gap-0.5"
            >
              <span className="font-mono break-all">
                to: {call.to ?? "(self)"}
              </span>
              {call.value && call.value !== ZERO_UINT && (
                <span className="font-mono">
                  value: {call.value}
                </span>
              )}
              {call.data && call.data !== EMPTY_BYTES && (
                <details className="opacity-70">
                  <summary className="cursor-pointer">
                    calldata
                  </summary>
                  <div className="font-mono break-all pt-1">
                    {call.data}
                  </div>
                </details>
              )}
            </li>
          ))}
        </ol>
      </section>
      {wrong_chain && (
        <p className="text-xs text-amber-700">
          This batch is for {chain?.name} ({chain_ref}).
          Your wallet is on {selected_chain.value.name} (
          {active_chain_id}). Switch chains in the wallet,
          then retry.
        </p>
      )}
      {atomic_required && (
        <p className="text-xs text-amber-700">
          Dapp requested atomic execution. This wallet runs
          calls sequentially — request will be rejected.
        </p>
      )}
      {error && (
        <p className="text-xs text-[var(--danger)] break-words">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-2">
        <Button
          disabled={
            status === "broadcasting" ||
            !chain ||
            wrong_chain ||
            atomic_required
          }
          onClick={async () => {
            if (!chain) return
            set_status("broadcasting")
            set_error(null)
            try {
              const private_key = get_private_key(
                active_account.value.key,
              )
              const { chain_id, reader } = get_reader(chain)
              const { writer } = get_writer(chain)
              const address = parse(
                AddressSchema,
                active_account.value.address,
              )
              const start_nonce = await get_nonce(
                address,
                reader,
                chain_id,
              )
              const transaction_hashes: Hash32[] = []
              for (const [
                i,
                call,
              ] of param.calls.entries()) {
                const tx: Eip1559TransactionUnsigned = {
                  chain_id: BigInt(chain.id),
                  nonce: start_nonce + BigInt(i),
                  max_priority_fee_per_gas:
                    MAX_PRIORITY_FEE_PER_GAS,
                  max_fee_per_gas: MAX_FEE_PER_GAS,
                  gas_limit: GAS_LIMIT,
                  to: call.to ?? address,
                  value: call.value
                    ? hex_to_big(call.value)
                    : 0n,
                  data: call.data
                    ? hex_to_bytes(call.data)
                    : new Uint8Array(),
                  access_list: [],
                }
                const raw =
                  encode_eip155_transaction_unsigned(
                    tx,
                    private_key,
                  )
                const transaction_hash =
                  await eth_sendRawTransaction([
                    parse(BytesSchema, bytes_to_hex(raw)),
                  ])(writer({ chain_id }))
                transaction_hashes.push(transaction_hash)
              }
              const batch_id = generate_batch_id()
              await set_batch({
                id: batch_id,
                chainId: param.chainId,
                atomic: false,
                transaction_hashes,
              })
              const result: SendCallsResult = {
                id: batch_id,
              }
              const response: SignTransactionResponse = {
                id: req.id,
                type: "ETHERNAUTA_RESPONSE_SIGNED_TRANSACTION",
                signed_transaction: JSON.stringify(result),
              }
              chrome.runtime.sendMessage(response)
              window.close()
            } catch (e) {
              set_status("error")
              set_error(
                e instanceof Error
                  ? e.message
                  : "Unknown error",
              )
            }
          }}
        >
          {status === "broadcasting"
            ? "Broadcasting…"
            : "Approve & broadcast"}
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
      <p className="text-[10px] text-[var(--text-muted)] leading-snug">
        Sequential strategy: each call is sent as its own
        EIP-1559 transaction. Future versions can wrap the
        batch atomically via EIP-7702 / ERC-4337.{" "}
        {CHAINS.length} chain
        {CHAINS.length === 1 ? "" : "s"} configured.
      </p>
    </main>
  )
}
