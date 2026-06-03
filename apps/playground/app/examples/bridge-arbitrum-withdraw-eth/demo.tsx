// Arbitrum Sepolia → Sepolia ETH withdrawal — full lifecycle
// across the four-state union surfaced by `get_status`:
//
//   1. initiated_l2 — the L2 burn (`ArbSys.withdrawEth`)
//      landed but the L2→L1 message isn't yet reflected in
//      the send merkle tree.
//   2. confirming — the message is in the tree, but the
//      covering Rollup assertion has not yet been confirmed
//      on L1 (within the ~6.4-day confirm window; Sepolia
//      accelerated to ~1h).
//   3. executable — `Outbox.roots(sendRoot)` is non-zero;
//      `fetch_message_proof` + `execute_withdraw` can ship.
//   4. executed — the L1 Outbox transaction landed.
//
// Once the L2 burn lands, the demo fetches the L2 receipt and
// decodes its `ArbSys.L2ToL1Tx` event via
// `decode_l2_to_l1_tx_from_receipt` to recover the canonical
// `WithdrawalTransaction` payload. The bridge resolver is
// rebuilt per phase because the signer switches from Arb
// Sepolia at initiation to Sepolia at execution.

import "./demo.css"
import {
  type ArbitrumBridgeStatus,
  create_bridge,
  decode_l2_to_l1_tx_from_receipt,
  execute_withdraw,
  fetch_message_proof,
  get_status,
  start_withdraw_eth,
  WithdrawalTransactionSchema,
} from "@ethernauta/arbitrum"
import { eip155_421614 } from "@ethernauta/chain/eip155-421614"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import {
  AddressSchema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import { eth_getTransactionReceipt } from "@ethernauta/eth"
import { useProvider } from "@ethernauta/react"
import {
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { hex_to_bigint } from "@ethernauta/utils"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type { InferOutput } from "valibot"
import { nullable, object, parse, safeParse } from "valibot"

import { Button } from "../../components/button"
import { SignInHint } from "../../components/sign-in-hint"
import { use_session } from "../../lib/auth/use-session"
import { PROVIDER_STORE_KEY } from "../../lib/provider-store"
import { Row } from "../send-calls/row"

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})
const ARB_SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_421614.chainId,
})
const SEPOLIA_HEX = `0x${eip155_11155111.chainId.toString(16)}`
const ARB_SEPOLIA_HEX = `0x${eip155_421614.chainId.toString(16)}`

const bridge = create_bridge([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [
      http("https://ethereum-sepolia-rpc.publicnode.com"),
      http("https://sepolia.gateway.tenderly.co"),
      http("https://rpc.sepolia.org"),
    ],
  },
  {
    chainId: ARB_SEPOLIA_CHAIN_ID,
    transports: [
      http("https://sepolia-rollup.arbitrum.io/rpc"),
      http("https://arbitrum-sepolia.publicnode.com"),
    ],
  },
])

const DEFAULT_AMOUNT_HEX = "0x38d7ea4c68000" // 0.001 ETH
const POLL_INTERVAL_MS = 30_000
const STORAGE_KEY =
  "ethernauta:bridge-arbitrum-withdraw-eth:state"

const PersistedStateSchema = object({
  recipient: AddressSchema,
  amount: UintSchema,
  l2_tx_hash: Hash32Schema,
  message: nullable(WithdrawalTransactionSchema),
  execute_l1_tx_hash: nullable(Hash32Schema),
})
type PersistedState = InferOutput<
  typeof PersistedStateSchema
>

function read_persisted(): PersistedState | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const decoded = JSON.parse(raw)
    const result = safeParse(PersistedStateSchema, decoded)
    return result.success ? result.output : null
  } catch {
    return null
  }
}

function write_persisted(state: PersistedState): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state),
  )
}

function clear_persisted(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_KEY)
}

function format_wei(wei_hex: string): string {
  try {
    const wei = hex_to_bigint(parse(UintSchema, wei_hex))
    const whole = wei / 10n ** 18n
    const frac = (wei % 10n ** 18n)
      .toString()
      .padStart(18, "0")
      .replace(/0+$/, "")
    return frac.length === 0
      ? `${whole} ETH`
      : `${whole}.${frac} ETH`
  } catch {
    return "(invalid)"
  }
}

function format_error(e: unknown): string {
  if (e instanceof AggregateError) {
    const details = e.errors
      .map((inner, i) => {
        const message =
          inner instanceof Error
            ? inner.message
            : String(inner)
        return `  [${i}] ${message}`
      })
      .join("\n")
    return `${e.message}:\n${details}`
  }
  if (e instanceof Error) return e.message
  return "Unknown error"
}

function LinkRow({
  label,
  href,
}: {
  label: string
  href: string
}) {
  return (
    <div className="send-calls-row">
      <span className="send-calls-row-label">{label}</span>
      <a
        className="send-calls-row-value is-mono bridge-arbitrum-withdraw-eth-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {href}
      </a>
    </div>
  )
}

function status_label(
  status: ArbitrumBridgeStatus,
): string {
  switch (status.state) {
    case "submitted_l1":
      return "submitted on L1"
    case "included_l1":
      return "included on L1"
    case "in_progress_l2":
      return "in progress on L2"
    case "succeeded_l2":
      return "succeeded on L2"
    case "failed_l2":
      return "failed on L2"
    case "initiated_l2":
      return "initiated on L2 — waiting for the message to enter the send merkle tree"
    case "confirming":
      return "confirming on L1 — Rollup assertion not yet confirmed (≈6.4 days mainnet / ≈1h Sepolia)"
    case "executable":
      return "executable — Outbox.roots has the send-root; ready to finalize on L1"
    case "executed":
      return "executed on L1 — withdrawal complete"
  }
}

export function BridgeArbitrumWithdrawEthDemo() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [_recipient, set_recipient] = useState<string>(
    owner ?? "0x000000000000000000000000000000000000dEaD",
  )
  const [_amount, set_amount] = useState(DEFAULT_AMOUNT_HEX)
  const [persisted, set_persisted] =
    useState<PersistedState | null>(null)
  const [status, set_status] =
    useState<ArbitrumBridgeStatus | null>(null)
  const [phase, set_phase] = useState<
    "idle" | "starting" | "executing"
  >("idle")
  const [error, set_error] = useState<string | null>(null)
  const polling_ref = useRef<number | null>(null)

  useEffect(() => {
    const initial = read_persisted()
    if (initial) set_persisted(initial)
  }, [])

  useEffect(() => {
    if (
      owner &&
      _recipient.toLowerCase() ===
        "0x000000000000000000000000000000000000dead"
    ) {
      set_recipient(owner)
    }
  }, [owner, _recipient])

  const refresh_status = useCallback(
    async (state: PersistedState) => {
      try {
        const transport = bridge({
          l1: SEPOLIA_CHAIN_ID,
          l2: ARB_SEPOLIA_CHAIN_ID,
        })
        if (!state.message) {
          set_status(null)
          return
        }
        const next = await get_status({
          direction: "withdraw",
          message: state.message,
        })(transport)
        set_status(next)
      } catch (e) {
        set_error(format_error(e))
      }
    },
    [],
  )

  useEffect(() => {
    if (!persisted || !persisted.message) return
    refresh_status(persisted)
    const id = window.setInterval(() => {
      refresh_status(persisted)
    }, POLL_INTERVAL_MS)
    polling_ref.current = id
    return () => {
      window.clearInterval(id)
      polling_ref.current = null
    }
  }, [persisted, refresh_status])

  // Auto-decode the WithdrawalTransaction from the L2 receipt
  // once the L2 burn is mined. Replaces the older paste-from-
  // explorer idiom.
  useEffect(() => {
    if (!persisted || persisted.message !== null) return
    let cancelled = false
    let timer_id: number | null = null
    const attempt = async (): Promise<void> => {
      try {
        const transport = bridge({
          l1: SEPOLIA_CHAIN_ID,
          l2: ARB_SEPOLIA_CHAIN_ID,
        })
        const receipt = await eth_getTransactionReceipt([
          persisted.l2_tx_hash,
        ])([
          transport.l2.reader,
          { chain_id: ARB_SEPOLIA_CHAIN_ID },
        ])
        if (cancelled) return
        if (receipt === null) {
          timer_id = window.setTimeout(attempt, 15_000)
          return
        }
        const decoded = decode_l2_to_l1_tx_from_receipt({
          logs: receipt.logs,
        })
        if (cancelled) return
        if (decoded === null) {
          set_error(
            "L2 receipt contained no L2ToL1Tx event — verify the L2 tx hash",
          )
          return
        }
        const next: PersistedState = {
          ...persisted,
          message: decoded,
        }
        write_persisted(next)
        set_persisted(next)
      } catch (e) {
        if (!cancelled) set_error(format_error(e))
      }
    }
    attempt()
    return () => {
      cancelled = true
      if (timer_id !== null) window.clearTimeout(timer_id)
    }
  }, [persisted])

  const preview = useMemo(() => {
    const recipient_result = safeParse(
      AddressSchema,
      _recipient,
    )
    const amount_result = safeParse(UintSchema, _amount)
    if (!recipient_result.success || !amount_result.success)
      return null
    return {
      recipient: recipient_result.output,
      amount: amount_result.output,
      amount_label: format_wei(_amount),
    }
  }, [_recipient, _amount])

  if (!owner) return <SignInHint />

  async function ensure_chain(
    chain_id_hex: string,
  ): Promise<void> {
    if (!provider) return
    await provider.provider_detail.provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chain_id_hex }],
    })
  }

  async function start_withdraw() {
    if (!provider || !preview) return
    set_error(null)
    try {
      set_phase("starting")
      await ensure_chain(ARB_SEPOLIA_HEX)
      const l2_tx_hash = await start_withdraw_eth({
        to: preview.recipient,
        amount: preview.amount,
      })(
        bridge({
          l1: SEPOLIA_CHAIN_ID,
          l2: ARB_SEPOLIA_CHAIN_ID,
          signer: provider.signer({
            chain_id: ARB_SEPOLIA_CHAIN_ID,
          }),
        }),
      )
      const next: PersistedState = {
        recipient: preview.recipient,
        amount: preview.amount,
        l2_tx_hash,
        message: null,
        execute_l1_tx_hash: null,
      }
      write_persisted(next)
      set_persisted(next)
    } catch (e) {
      set_error(format_error(e))
    } finally {
      set_phase("idle")
    }
  }

  async function do_execute() {
    if (!provider || !persisted || !persisted.message)
      return
    set_error(null)
    try {
      set_phase("executing")
      await ensure_chain(SEPOLIA_HEX)
      const transport_for_proof = bridge({
        l1: SEPOLIA_CHAIN_ID,
        l2: ARB_SEPOLIA_CHAIN_ID,
      })
      const proof = await fetch_message_proof({
        message: persisted.message,
      })(transport_for_proof)
      const l1_tx_hash = await execute_withdraw({ proof })(
        bridge({
          l1: SEPOLIA_CHAIN_ID,
          l2: ARB_SEPOLIA_CHAIN_ID,
          signer: provider.signer({
            chain_id: SEPOLIA_CHAIN_ID,
          }),
        }),
      )
      const next: PersistedState = {
        ...persisted,
        execute_l1_tx_hash: l1_tx_hash,
      }
      write_persisted(next)
      set_persisted(next)
    } catch (e) {
      set_error(format_error(e))
    } finally {
      set_phase("idle")
    }
  }

  function reset() {
    clear_persisted()
    set_persisted(null)
    set_status(null)
    set_error(null)
  }

  const in_flight = phase !== "idle"
  const executable =
    status !== null && status.state === "executable"

  return (
    <div>
      <Row label="Origin" value="Arbitrum Sepolia (L2)" />
      <Row
        label="Destination"
        value="Ethereum Sepolia (L1)"
      />
      <Row label="Account" value={owner} mono />
      <div className="bridge-arbitrum-withdraw-eth-note">
        Arbitrum withdrawals go through the canonical L2→L1
        message path: burn on L2 via{" "}
        <code>ArbSys.withdrawEth</code>, wait for the
        covering Rollup assertion to be confirmed on L1
        (~6.4 days on mainnet / ~1 hour on Sepolia), then
        redeem on L1 via{" "}
        <code>Outbox.executeTransaction</code> with a merkle
        proof. The send-root the proof anchors to has to be
        present in <code>Outbox.roots</code> for the L1
        redeem to succeed — <code>get_status</code> surfaces{" "}
        <code>confirming</code> until that lands, then{" "}
        <code>executable</code>.
      </div>

      {!persisted && (
        <div className="bridge-arbitrum-withdraw-eth-section">
          <h3>1 · Initiate withdrawal on L2</h3>
          <div className="bridge-arbitrum-withdraw-eth-form">
            <label className="bridge-arbitrum-withdraw-eth-label">
              recipient (L1 address)
              <input
                className="bridge-arbitrum-withdraw-eth-input"
                value={_recipient}
                onChange={(e) =>
                  set_recipient(e.currentTarget.value)
                }
              />
            </label>
            <label className="bridge-arbitrum-withdraw-eth-label">
              amount (hex wei)
              <input
                className="bridge-arbitrum-withdraw-eth-input"
                value={_amount}
                onChange={(e) =>
                  set_amount(e.currentTarget.value)
                }
              />
            </label>
          </div>
          {preview && (
            <Row
              label="amount (computed)"
              value={preview.amount_label}
            />
          )}
          <div className="bridge-arbitrum-withdraw-eth-actions">
            <Button
              onClick={start_withdraw}
              disabled={in_flight || !preview || !provider}
            >
              {phase === "starting"
                ? "Signing on Arb Sepolia…"
                : "Start withdrawal on Arb Sepolia"}
            </Button>
          </div>
        </div>
      )}

      {persisted && (
        <>
          <div className="bridge-arbitrum-withdraw-eth-section">
            <h3>2 · L2 receipt</h3>
            <Row
              label="recipient"
              value={persisted.recipient}
              mono
            />
            <Row
              label="amount"
              value={format_wei(persisted.amount)}
            />
            <Row
              label="L2 tx hash"
              value={persisted.l2_tx_hash}
              mono
            />
            <LinkRow
              label="Arbiscan L2 view (open the L2 → L1 messages tab)"
              href={`https://sepolia.arbiscan.io/tx/${persisted.l2_tx_hash}`}
            />
          </div>

          <div className="bridge-arbitrum-withdraw-eth-section">
            <h3>3 · Decoded WithdrawalTransaction</h3>
            <div className="bridge-arbitrum-withdraw-eth-note">
              Recovered directly from the L2 receipt's{" "}
              <code>ArbSys.L2ToL1Tx</code> event via{" "}
              <code>decode_l2_to_l1_tx_from_receipt</code> —
              no paste-from-explorer step.
            </div>
            {persisted.message === null ? (
              <div className="bridge-arbitrum-withdraw-eth-status">
                waiting for the L2 receipt + decoding the
                L2ToL1Tx event…
              </div>
            ) : (
              <div className="bridge-arbitrum-withdraw-eth-form">
                <label className="bridge-arbitrum-withdraw-eth-label">
                  message
                  <textarea
                    className="bridge-arbitrum-withdraw-eth-input"
                    value={JSON.stringify(
                      persisted.message,
                      null,
                      2,
                    )}
                    readOnly
                    rows={10}
                  />
                </label>
              </div>
            )}
          </div>

          {persisted.message && (
            <div className="bridge-arbitrum-withdraw-eth-section">
              <h3>4 · Lifecycle status</h3>
              {status && (
                <div className="bridge-arbitrum-withdraw-eth-status">
                  {status_label(status)}
                </div>
              )}
              <div className="bridge-arbitrum-withdraw-eth-actions">
                <Button
                  onClick={do_execute}
                  disabled={
                    in_flight ||
                    !provider ||
                    !executable ||
                    persisted.execute_l1_tx_hash !== null
                  }
                >
                  {phase === "executing"
                    ? "Executing on Sepolia…"
                    : "Execute withdrawal on Sepolia"}
                </Button>
              </div>
            </div>
          )}

          {persisted.execute_l1_tx_hash && (
            <div className="bridge-arbitrum-withdraw-eth-section">
              <h3>5 · L1 execute receipt</h3>
              <Row
                label="L1 tx hash"
                value={persisted.execute_l1_tx_hash}
                mono
              />
              <LinkRow
                label="L1 explorer"
                href={`https://sepolia.etherscan.io/tx/${persisted.execute_l1_tx_hash}`}
              />
            </div>
          )}

          <div className="bridge-arbitrum-withdraw-eth-actions">
            <Button variant="ghost" onClick={reset}>
              Reset (forget this withdrawal)
            </Button>
          </div>
        </>
      )}

      {error && (
        <div className="bridge-arbitrum-withdraw-eth-error">
          {error}
        </div>
      )}
    </div>
  )
}
