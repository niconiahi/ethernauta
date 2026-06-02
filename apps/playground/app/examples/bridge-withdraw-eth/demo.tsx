// OP Sepolia → Sepolia ETH withdrawal — full lifecycle through
// the OP-stack fault-proofs path. The flow walks four UI
// states driven by `get_status` polling:
//
//   1. initiated_l2 / awaiting_game_proposal / game_in_progress
//      — the L2 burn landed; waiting for a dispute game to be
//      proposed and resolved on L1.
//   2. ready_to_prove — a resolved game now covers the
//      withdrawal's L2 block. `fetch_message_proof` builds the
//      OpMessageProof bundle; `prove_withdraw` submits it on L1.
//   3. proof_pending_maturity — proof submitted; waiting for
//      the portal's `proofMaturityDelaySeconds` +
//      `disputeGameFinalityDelaySeconds` to elapse.
//   4. ready_to_finalize → finalized — `execute_withdraw`
//      releases the L1 ETH.
//
// `start_withdraw_eth` is composed directly via the bridge
// bundle. After the L2 broadcast, the demo fetches the L2
// receipt, decodes the `MessagePassed` event emitted by the
// L2ToL1MessagePasser predeploy, and stores the resulting
// `WithdrawalTransaction` + L2 block number in localStorage so
// the user can leave and come back hours later when proofs
// mature. `get_status` is polled every 15s with the prover set
// to the signed-in user's address.

import "./demo.css"
import {
  address as address_codec,
  bytes as bytes_codec,
  bytes32 as bytes32_codec,
  decode_logs,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import { eip155_11155420 } from "@ethernauta/chain/eip155-11155420"
import {
  type Address,
  AddressSchema,
  Hash32Schema,
  Uint32Schema,
  type Uint256,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import { eth_getTransactionReceipt } from "@ethernauta/eth"
import {
  execute_withdraw,
  fetch_message_proof,
  get_status,
  L2_TO_L1_MESSAGE_PASSER_ADDRESS,
  type OpBridgeStatus,
  type OpMessageProof,
  prove_withdraw,
  start_withdraw_eth,
  WithdrawalTransactionSchema,
} from "@ethernauta/op"
import { useProvider } from "@ethernauta/react"
import {
  create_bridge,
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

const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})
const OP_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155420.chainId,
})

const bridge = create_bridge([
  {
    chainId: SEPOLIA,
    transports: [
      http("https://ethereum-sepolia-rpc.publicnode.com"),
      http("https://sepolia.gateway.tenderly.co"),
      http("https://rpc.sepolia.org"),
    ],
  },
  {
    chainId: OP_SEPOLIA,
    transports: [http("https://sepolia.optimism.io")],
  },
])

const DEFAULT_AMOUNT_HEX = "0x38d7ea4c68000" // 0.001 ETH
const DEFAULT_MIN_GAS_HEX = "0x30d40" // 200_000
const POLL_INTERVAL_MS = 15_000
const STORAGE_KEY = "ethernauta:bridge-withdraw-eth:state"

const MESSAGE_PASSED_CODECS = [
  uint256_codec(),
  address_codec(),
  address_codec(),
  uint256_codec(),
  uint256_codec(),
  bytes_codec(),
  bytes32_codec(),
] as const
const MESSAGE_PASSED_INDEXED = [
  true,
  true,
  true,
  false,
  false,
  false,
  false,
]

const PersistedStateSchema = object({
  recipient: AddressSchema,
  amount: Uint256Schema,
  l2_tx_hash: Hash32Schema,
  withdrawal_transaction: WithdrawalTransactionSchema,
  withdrawal_l2_block_number: Uint256Schema,
  withdrawal_hash: Hash32Schema,
  prove_l1_tx_hash: nullable(Hash32Schema),
  finalize_l1_tx_hash: nullable(Hash32Schema),
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
        className="send-calls-row-value is-mono bridge-withdraw-eth-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {href}
      </a>
    </div>
  )
}

function status_label(status: OpBridgeStatus): string {
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
      return "initiated on L2 — waiting for game proposal"
    case "awaiting_game_proposal":
      return "awaiting game proposal"
    case "game_in_progress":
      return "game in progress"
    case "ready_to_prove":
      return "ready to prove"
    case "proof_pending_maturity":
      return "proof pending maturity"
    case "ready_to_finalize":
      return "ready to finalize"
    case "finalized":
      return "finalized"
    case "game_invalidated":
      return "game invalidated"
  }
}

function format_eta(mature_at_seconds: Uint256): string {
  const target = hex_to_bigint(mature_at_seconds)
  const now = BigInt(Math.floor(Date.now() / 1000))
  if (target <= now) return "any moment now"
  const remaining = target - now
  const days = remaining / 86_400n
  const hours = (remaining % 86_400n) / 3_600n
  const minutes = (remaining % 3_600n) / 60n
  if (days > 0n) return `~${days}d ${hours}h`
  if (hours > 0n) return `~${hours}h ${minutes}m`
  return `~${minutes}m`
}

export function BridgeWithdrawEthDemo() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [recipient, set_recipient] = useState<string>(
    owner ?? "0x000000000000000000000000000000000000dEaD",
  )
  const [amount, set_amount] = useState(DEFAULT_AMOUNT_HEX)
  const [min_gas, set_min_gas] = useState(
    DEFAULT_MIN_GAS_HEX,
  )
  const [persisted, set_persisted] =
    useState<PersistedState | null>(null)
  const [status, set_status] =
    useState<OpBridgeStatus | null>(null)
  const [phase, set_phase] = useState<
    "idle" | "starting" | "proving" | "finalizing"
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
      recipient.toLowerCase() ===
        "0x000000000000000000000000000000000000dead"
    ) {
      set_recipient(owner)
    }
  }, [owner, recipient])

  const refresh_status = useCallback(
    async (state: PersistedState, prover: Address) => {
      try {
        const resolved = bridge({
          origin: OP_SEPOLIA,
          destination: SEPOLIA,
        })
        const next = await get_status({
          direction: "withdraw",
          withdrawal_transaction:
            state.withdrawal_transaction,
          withdrawal_l2_block_number:
            state.withdrawal_l2_block_number,
          prover,
        })(resolved)
        set_status(next)
      } catch (e) {
        set_error(format_error(e))
      }
    },
    [],
  )

  useEffect(() => {
    if (!persisted || !owner) return
    const prover = parse(AddressSchema, owner)
    refresh_status(persisted, prover)
    const id = window.setInterval(() => {
      refresh_status(persisted, prover)
    }, POLL_INTERVAL_MS)
    polling_ref.current = id
    return () => {
      window.clearInterval(id)
      polling_ref.current = null
    }
  }, [persisted, owner, refresh_status])

  const preview = useMemo(() => {
    const recipient_result = safeParse(
      AddressSchema,
      recipient,
    )
    const amount_result = safeParse(Uint256Schema, amount)
    const min_gas_result = safeParse(Uint32Schema, min_gas)
    if (
      !recipient_result.success ||
      !amount_result.success ||
      !min_gas_result.success
    ) {
      return null
    }
    return {
      recipient: recipient_result.output,
      amount: amount_result.output,
      min_gas_limit: min_gas_result.output,
      amount_label: format_wei(amount),
    }
  }, [recipient, amount, min_gas])

  if (!owner) return <SignInHint />

  async function start_withdraw() {
    if (!provider || !preview) return
    set_error(null)
    try {
      set_phase("starting")
      const resolved = bridge({
        origin: OP_SEPOLIA,
        destination: SEPOLIA,
        signer: ({ chain_id }) => {
          const [signer] = provider.signer({ chain_id })
          return signer
        },
      })
      const l2_tx_hash = await start_withdraw_eth({
        to: preview.recipient,
        amount: preview.amount,
        min_gas_limit: preview.min_gas_limit,
      })(resolved)
      const receipt = await eth_getTransactionReceipt([
        l2_tx_hash,
      ])([resolved.origin.reader, { chain_id: OP_SEPOLIA }])
      if (receipt === null) {
        throw new Error(
          "L2 receipt not yet available — try again",
        )
      }
      const message_passer_logs = receipt.logs.filter(
        (log) =>
          log.address.toLowerCase() ===
          L2_TO_L1_MESSAGE_PASSER_ADDRESS.toLowerCase(),
      )
      const decoded = decode_logs(
        [
          {
            name: "MessagePassed",
            args: MESSAGE_PASSED_CODECS,
            indexed: MESSAGE_PASSED_INDEXED,
          },
        ],
        message_passer_logs,
      )
      const event = decoded[0]
      if (!event) {
        throw new Error(
          "no MessagePassed event found in L2 receipt",
        )
      }
      const [
        nonce,
        sender,
        target,
        value_field,
        gas_limit_field,
        data_field,
        withdrawal_hash_field,
      ] = event.args
      const withdrawal_transaction = parse(
        WithdrawalTransactionSchema,
        {
          nonce,
          sender,
          target,
          value: value_field,
          gasLimit: gas_limit_field,
          data: data_field,
        },
      )
      const withdrawal_hash = parse(
        Hash32Schema,
        withdrawal_hash_field,
      )
      const block_number_bigint = hex_to_bigint(
        receipt.blockNumber,
      )
      const withdrawal_l2_block_number = parse(
        Uint256Schema,
        `0x${block_number_bigint.toString(16)}`,
      )
      const next: PersistedState = {
        recipient: preview.recipient,
        amount: preview.amount,
        l2_tx_hash,
        withdrawal_transaction,
        withdrawal_l2_block_number,
        withdrawal_hash,
        prove_l1_tx_hash: null,
        finalize_l1_tx_hash: null,
      }
      write_persisted(next)
      set_persisted(next)
    } catch (e) {
      set_error(format_error(e))
    } finally {
      set_phase("idle")
    }
  }

  async function prove() {
    if (!provider || !persisted) return
    set_error(null)
    try {
      set_phase("proving")
      const resolved = bridge({
        origin: OP_SEPOLIA,
        destination: SEPOLIA,
        signer: ({ chain_id }) => {
          const [signer] = provider.signer({ chain_id })
          return signer
        },
      })
      const proof: OpMessageProof =
        await fetch_message_proof({
          withdrawal_transaction:
            persisted.withdrawal_transaction,
          withdrawal_l2_block_number:
            persisted.withdrawal_l2_block_number,
        })(resolved)
      const l1_tx_hash = await prove_withdraw({ proof })(
        resolved,
      )
      const next: PersistedState = {
        ...persisted,
        prove_l1_tx_hash: l1_tx_hash,
      }
      write_persisted(next)
      set_persisted(next)
      const prover = parse(AddressSchema, owner)
      await refresh_status(next, prover)
    } catch (e) {
      set_error(format_error(e))
    } finally {
      set_phase("idle")
    }
  }

  async function finalize() {
    if (!provider || !persisted) return
    set_error(null)
    try {
      set_phase("finalizing")
      const resolved = bridge({
        origin: OP_SEPOLIA,
        destination: SEPOLIA,
        signer: ({ chain_id }) => {
          const [signer] = provider.signer({ chain_id })
          return signer
        },
      })
      const l1_tx_hash = await execute_withdraw({
        message: persisted.withdrawal_transaction,
      })(resolved)
      const next: PersistedState = {
        ...persisted,
        finalize_l1_tx_hash: l1_tx_hash,
      }
      write_persisted(next)
      set_persisted(next)
      const prover = parse(AddressSchema, owner)
      await refresh_status(next, prover)
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

  return (
    <div>
      <Row label="Origin" value="OP Sepolia (L2)" />
      <Row
        label="Destination"
        value="Ethereum Sepolia (L1)"
      />
      <Row label="Account" value={owner} mono />
      <div className="bridge-withdraw-eth-note">
        OP-stack ETH withdrawals under fault proofs take ~7
        days from L2 burn to L1 release on Sepolia (the
        portal's proof-maturity + dispute-game-finality
        windows). This demo persists the withdrawal handle
        to localStorage so you can come back later — the
        prove and finalize buttons activate when{" "}
        <code>get_status</code> reports{" "}
        <code>ready_to_prove</code> and{" "}
        <code>ready_to_finalize</code>.
      </div>

      {!persisted && (
        <div className="bridge-withdraw-eth-section">
          <h3>1 · Start withdrawal on L2</h3>
          <div className="bridge-withdraw-eth-form">
            <label className="bridge-withdraw-eth-label">
              to (L1 recipient)
              <input
                className="bridge-withdraw-eth-input"
                value={recipient}
                onChange={(e) =>
                  set_recipient(e.currentTarget.value)
                }
              />
            </label>
            <label className="bridge-withdraw-eth-label">
              amount (hex wei)
              <input
                className="bridge-withdraw-eth-input"
                value={amount}
                onChange={(e) =>
                  set_amount(e.currentTarget.value)
                }
              />
            </label>
            <label className="bridge-withdraw-eth-label">
              min_gas_limit (hex)
              <input
                className="bridge-withdraw-eth-input"
                value={min_gas}
                onChange={(e) =>
                  set_min_gas(e.currentTarget.value)
                }
              />
            </label>
          </div>
          {preview && (
            <Row
              label="amount (decoded)"
              value={preview.amount_label}
            />
          )}
          <div className="bridge-withdraw-eth-actions">
            <Button
              onClick={start_withdraw}
              disabled={in_flight || !preview || !provider}
            >
              {phase === "starting"
                ? "Starting on OP Sepolia…"
                : "start_withdraw_eth on OP Sepolia"}
            </Button>
          </div>
        </div>
      )}

      {persisted && (
        <>
          <div className="bridge-withdraw-eth-section">
            <h3>2 · Withdrawal handle</h3>
            <Row
              label="L2 tx hash"
              value={persisted.l2_tx_hash}
              mono
            />
            <LinkRow
              label="L2 explorer"
              href={`https://sepolia-optimism.etherscan.io/tx/${persisted.l2_tx_hash}`}
            />
            <Row
              label="withdrawal hash"
              value={persisted.withdrawal_hash}
              mono
            />
            <Row
              label="L2 block"
              value={persisted.withdrawal_l2_block_number}
              mono
            />
            <Row
              label="amount"
              value={format_wei(persisted.amount)}
            />
            <Row
              label="recipient (L1)"
              value={persisted.recipient}
              mono
            />
          </div>

          <div className="bridge-withdraw-eth-section">
            <h3>3 · Status</h3>
            <span className="bridge-withdraw-eth-state">
              {status ? status_label(status) : "loading…"}
            </span>
            {status?.state === "proof_pending_maturity" && (
              <Row
                label="mature in"
                value={format_eta(status.mature_at_seconds)}
              />
            )}
            <div className="bridge-withdraw-eth-actions">
              <Button
                onClick={prove}
                disabled={
                  in_flight ||
                  !provider ||
                  status?.state !== "ready_to_prove"
                }
              >
                {phase === "proving"
                  ? "Building proof + waiting for wallet…"
                  : "prove_withdraw on Sepolia"}
              </Button>
              <Button
                onClick={finalize}
                disabled={
                  in_flight ||
                  !provider ||
                  status?.state !== "ready_to_finalize"
                }
              >
                {phase === "finalizing"
                  ? "Finalizing on Sepolia…"
                  : "execute_withdraw on Sepolia"}
              </Button>
              <Button variant="ghost" onClick={reset}>
                Reset (forget this withdrawal)
              </Button>
            </div>
          </div>

          {persisted.prove_l1_tx_hash && (
            <div className="bridge-withdraw-eth-section">
              <h3>4 · Prove receipt</h3>
              <Row
                label="prove L1 tx hash"
                value={persisted.prove_l1_tx_hash}
                mono
              />
              <LinkRow
                label="L1 explorer"
                href={`https://sepolia.etherscan.io/tx/${persisted.prove_l1_tx_hash}`}
              />
            </div>
          )}

          {persisted.finalize_l1_tx_hash && (
            <div className="bridge-withdraw-eth-section">
              <h3>5 · Finalize receipt</h3>
              <Row
                label="finalize L1 tx hash"
                value={persisted.finalize_l1_tx_hash}
                mono
              />
              <LinkRow
                label="L1 explorer"
                href={`https://sepolia.etherscan.io/tx/${persisted.finalize_l1_tx_hash}`}
              />
            </div>
          )}
        </>
      )}

      {error && (
        <div className="bridge-withdraw-eth-error">
          {error}
        </div>
      )}
    </div>
  )
}
