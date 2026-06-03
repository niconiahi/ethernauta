// Era Sepolia → Sepolia ETH withdrawal — full lifecycle across
// the four-state withdraw union surfaced by `get_status`:
//
//   1. initiated_l2 — the L2 burn
//      (`L2BaseToken.withdraw(_l1Receiver)`) landed but the
//      L2→L1 log isn't yet indexed by the L2 node.
//   2. batch_pending — the log is indexed, but the originating
//      batch hasn't been committed + verified on L1 yet (~5 min
//      on Era Sepolia, ~10 hours on mainnet).
//   3. ready_to_finalize — `zks_getL2ToL1LogProof` returns a
//      bundle; the L1Nullifier hasn't recorded the unlock yet.
//      `fetch_message_proof` + `execute_withdraw` can ship.
//   4. finalized — `L1Nullifier.isWithdrawalFinalized` is
//      `true`; the L1 transfer has landed.
//
// The user pastes `l2_to_l1_log_index` + `l2_tx_number_in_batch`
// + `message` from the Era Sepolia explorer's tx page (or
// derives them via `zks_getL2ToL1LogProof` + the L2 receipt's
// `l1BatchTxIndex` field). That paste-then-persist shape mirrors
// `bridge-zksync-claim-failed-deposit`. A future helper will
// derive these fields from the L2 receipt's L1Messenger event
// log directly. The bridge resolver is rebuilt per phase because
// the signer switches from Era Sepolia at initiation to Sepolia
// at execution.

import "./demo.css"
import {
  AddressSchema,
  BytesSchema,
  Hash32Schema,
  Uint16Schema,
  UintSchema,
} from "@ethernauta/core"
import { useProvider } from "@ethernauta/react"
import { encode_chain_id, http } from "@ethernauta/transport"
import { hex_to_bigint } from "@ethernauta/utils"
import { eip155_300 } from "@ethernauta/chain/eip155-300"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import {
  create_bridge,
  execute_withdraw,
  fetch_message_proof,
  get_status,
  L2_BASE_TOKEN_ADDRESS,
  start_withdraw_eth,
  type ZksyncBridgeStatus,
} from "@ethernauta/zksync"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type { InferOutput } from "valibot"
import {
  nullable,
  number,
  object,
  parse,
  safeParse,
} from "valibot"

import { Button } from "../../components/button"
import { SignInHint } from "../../components/sign-in-hint"
import { use_session } from "../../lib/auth/use-session"
import { PROVIDER_STORE_KEY } from "../../lib/provider-store"
import { Row } from "../send-calls/row"

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})
const ERA_SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_300.chainId,
})
const SEPOLIA_HEX = `0x${eip155_11155111.chainId.toString(16)}`
const ERA_SEPOLIA_HEX = `0x${eip155_300.chainId.toString(16)}`

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
    chainId: ERA_SEPOLIA_CHAIN_ID,
    transports: [
      http("https://sepolia.era.zksync.dev"),
      http("https://zksync-sepolia.drpc.org"),
    ],
  },
])

const DEFAULT_AMOUNT_HEX = "0x38d7ea4c68000" // 0.001 ETH
const POLL_INTERVAL_MS = 30_000
const STORAGE_KEY =
  "ethernauta:bridge-zksync-withdraw-eth:state"

const WithdrawInputsSchema = object({
  l2_to_l1_log_index: number(),
  l2_tx_number_in_batch: Uint16Schema,
  message: BytesSchema,
})
type WithdrawInputs = InferOutput<typeof WithdrawInputsSchema>

const PersistedStateSchema = object({
  recipient: AddressSchema,
  amount: UintSchema,
  l2_tx_hash: Hash32Schema,
  inputs: nullable(WithdrawInputsSchema),
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
        className="send-calls-row-value is-mono bridge-zksync-withdraw-eth-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {href}
      </a>
    </div>
  )
}

function status_label(status: ZksyncBridgeStatus): string {
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
      return "initiated on L2 — waiting for the L2→L1 log to be indexed"
    case "batch_pending":
      return "batch pending — L2→L1 log indexed; waiting for the covering batch to be committed + verified on L1 (~5 min on Era Sepolia)"
    case "ready_to_finalize":
      return "ready to finalize — proof available; sign on Sepolia to release the L1 ETH"
    case "finalized":
      return "finalized on L1 — withdrawal complete"
  }
}

export function BridgeZksyncWithdrawEthDemo() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [_recipient, set_recipient] = useState<string>(
    owner ?? "0x000000000000000000000000000000000000dEaD",
  )
  const [_amount, set_amount] = useState(DEFAULT_AMOUNT_HEX)
  const [_inputs_input, set_inputs_input] = useState("")
  const [persisted, set_persisted] =
    useState<PersistedState | null>(null)
  const [status, set_status] =
    useState<ZksyncBridgeStatus | null>(null)
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
          l2: ERA_SEPOLIA_CHAIN_ID,
        })
        if (!state.inputs) {
          set_status(null)
          return
        }
        const next = await get_status({
          direction: "withdraw",
          l2_tx_hash: state.l2_tx_hash,
          l2_to_l1_log_index:
            state.inputs.l2_to_l1_log_index,
        })(transport)
        set_status(next)
      } catch (e) {
        set_error(format_error(e))
      }
    },
    [],
  )

  useEffect(() => {
    if (!persisted || !persisted.inputs) return
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

  const parsed_inputs = useMemo<WithdrawInputs | null>(() => {
    try {
      const decoded = JSON.parse(_inputs_input)
      const result = safeParse(
        WithdrawInputsSchema,
        decoded,
      )
      return result.success ? result.output : null
    } catch {
      return null
    }
  }, [_inputs_input])

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
      await ensure_chain(ERA_SEPOLIA_HEX)
      const l2_tx_hash = await start_withdraw_eth({
        to: preview.recipient,
        amount: preview.amount,
      })(
        bridge({
          l1: SEPOLIA_CHAIN_ID,
          l2: ERA_SEPOLIA_CHAIN_ID,
          signer: provider.signer({
            chain_id: ERA_SEPOLIA_CHAIN_ID,
          }),
        }),
      )
      const next: PersistedState = {
        recipient: preview.recipient,
        amount: preview.amount,
        l2_tx_hash,
        inputs: null,
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

  function save_inputs() {
    if (!persisted || !parsed_inputs) return
    const next: PersistedState = {
      ...persisted,
      inputs: parsed_inputs,
    }
    write_persisted(next)
    set_persisted(next)
  }

  async function do_execute() {
    if (!provider || !persisted || !persisted.inputs) return
    set_error(null)
    try {
      set_phase("executing")
      await ensure_chain(SEPOLIA_HEX)
      const transport_for_proof = bridge({
        l1: SEPOLIA_CHAIN_ID,
        l2: ERA_SEPOLIA_CHAIN_ID,
      })
      const proof = await fetch_message_proof({
        l2_tx_hash: persisted.l2_tx_hash,
        l2_to_l1_log_index:
          persisted.inputs.l2_to_l1_log_index,
        l2_tx_number_in_batch:
          persisted.inputs.l2_tx_number_in_batch,
        message: persisted.inputs.message,
      })(transport_for_proof)
      const l1_tx_hash = await execute_withdraw({
        proof,
        l2_sender: L2_BASE_TOKEN_ADDRESS,
      })(
        bridge({
          l1: SEPOLIA_CHAIN_ID,
          l2: ERA_SEPOLIA_CHAIN_ID,
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
  const ready =
    status !== null && status.state === "ready_to_finalize"

  return (
    <div>
      <Row label="Origin" value="zkSync Era Sepolia (L2)" />
      <Row label="Destination" value="Ethereum Sepolia (L1)" />
      <Row label="Account" value={owner} mono />
      <Row
        label="L2BaseToken predeploy (l2Sender for finalize)"
        value={L2_BASE_TOKEN_ADDRESS}
        mono
      />
      <div className="bridge-zksync-withdraw-eth-note">
        zkSync withdrawals are validity-proof finalized on L1 via{" "}
        <code>L1Nullifier.finalizeDeposit</code> ("Deposit" by
        name because the asset-router treats every L2→L1 unlock
        as the L1 completion of a prior deposit/withdrawal pair).
        Burn on L2 via <code>L2BaseToken.withdraw</code>, wait
        for the covering batch to be committed + verified on L1
        (~5 min on Era Sepolia, ~10 hours on mainnet), then
        redeem on L1 carrying the proof bundle returned by{" "}
        <code>zks_getL2ToL1LogProof</code>.
      </div>

      {!persisted && (
        <div className="bridge-zksync-withdraw-eth-section">
          <h3>1 · Initiate withdrawal on L2</h3>
          <div className="bridge-zksync-withdraw-eth-form">
            <label className="bridge-zksync-withdraw-eth-label">
              recipient (L1 address)
              <input
                className="bridge-zksync-withdraw-eth-input"
                value={_recipient}
                onChange={(e) =>
                  set_recipient(e.currentTarget.value)
                }
              />
            </label>
            <label className="bridge-zksync-withdraw-eth-label">
              amount (hex wei)
              <input
                className="bridge-zksync-withdraw-eth-input"
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
          <div className="bridge-zksync-withdraw-eth-actions">
            <Button
              onClick={start_withdraw}
              disabled={in_flight || !preview || !provider}
            >
              {phase === "starting"
                ? "Signing on Era Sepolia…"
                : "Start withdrawal on Era Sepolia"}
            </Button>
          </div>
        </div>
      )}

      {persisted && (
        <>
          <div className="bridge-zksync-withdraw-eth-section">
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
              label="Era Sepolia explorer"
              href={`https://sepolia.explorer.zksync.io/tx/${persisted.l2_tx_hash}`}
            />
          </div>

          <div className="bridge-zksync-withdraw-eth-section">
            <h3>3 · Paste withdraw inputs</h3>
            <div className="bridge-zksync-withdraw-eth-note">
              From the L2 receipt + the L1Messenger event the L2
              burn emitted, assemble:
              <ul>
                <li>
                  <code>l2_to_l1_log_index</code> — index of the
                  L2→L1 log inside the receipt's{" "}
                  <code>l2ToL1Logs</code> array (usually{" "}
                  <code>0</code> for a single-message withdraw)
                </li>
                <li>
                  <code>l2_tx_number_in_batch</code> — receipt's{" "}
                  <code>l1BatchTxIndex</code> (hex,{" "}
                  <code>uint16</code>)
                </li>
                <li>
                  <code>message</code> — bytes payload from the
                  L1Messenger <code>L1MessageSent</code> event
                  (hex, <code>0x</code>-prefixed)
                </li>
              </ul>
              A future helper will derive this from the L2 receipt
              automatically.
            </div>
            <div className="bridge-zksync-withdraw-eth-form">
              <label className="bridge-zksync-withdraw-eth-label">
                inputs (JSON)
                <textarea
                  className="bridge-zksync-withdraw-eth-input"
                  value={
                    persisted.inputs
                      ? JSON.stringify(
                          persisted.inputs,
                          null,
                          2,
                        )
                      : _inputs_input
                  }
                  onChange={(e) =>
                    set_inputs_input(e.currentTarget.value)
                  }
                  readOnly={persisted.inputs !== null}
                  rows={10}
                />
              </label>
            </div>
            {persisted.inputs === null && (
              <div className="bridge-zksync-withdraw-eth-actions">
                <Button
                  onClick={save_inputs}
                  disabled={!parsed_inputs}
                >
                  Save inputs
                </Button>
              </div>
            )}
          </div>

          {persisted.inputs && (
            <div className="bridge-zksync-withdraw-eth-section">
              <h3>4 · Lifecycle status</h3>
              {status && (
                <div className="bridge-zksync-withdraw-eth-status">
                  {status_label(status)}
                </div>
              )}
              <div className="bridge-zksync-withdraw-eth-actions">
                <Button
                  onClick={do_execute}
                  disabled={
                    in_flight ||
                    !provider ||
                    !ready ||
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
            <div className="bridge-zksync-withdraw-eth-section">
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

          <div className="bridge-zksync-withdraw-eth-actions">
            <Button variant="ghost" onClick={reset}>
              Reset (forget this withdrawal)
            </Button>
          </div>
        </>
      )}

      {error && (
        <div className="bridge-zksync-withdraw-eth-error">
          {error}
        </div>
      )}
    </div>
  )
}
