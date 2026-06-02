// Arbitrum retryable lifecycle — Sepolia create →
// Arb Sepolia redeem / cancel. The demo walks the two-phase
// flow described in the retryable-ticket docs:
//
//   1. Create a retryable ticket on L1 via
//      `send_message({...})` (composes
//      `Inbox.createRetryableTicket`). Auto-redeem on L2
//      runs immediately if `gas_limit * max_fee_per_gas`
//      was sized high enough; otherwise it fails and the
//      ticket sits in retryable storage until the default
//      7-day lifetime elapses (or the dapp acts).
//   2. On L2, the dapp either manually `redeem_retryable`
//      to retry the failed L2 call with fresh gas, or
//      `cancel_retryable` to abandon the ticket and refund
//      the L1 callvalue to `callValueRefundAddress`.
//
// The ticket id is the keccak256 of the retryable's L2 tx,
// which the receipt of the L1 createRetryableTicket call
// emits via an `InboxMessageDelivered` event from the
// Bridge. For demo purposes, paste the ticket id from
// Arbiscan's L2 view of the auto-redeem attempt — the
// L1 tx's "Cross-Chain Messages" tab on
// `sepolia.arbiscan.io` surfaces it. The L1 tx hash + the
// pasted ticket id are persisted to localStorage so the
// dapp can be closed and reopened later.
//
// Each phase rebuilds the bridge resolver because the
// signer's `chain_id` switches from Sepolia (L1) at
// creation time to Arb Sepolia (L2) at redeem/cancel time.

import "./demo.css"
import {
  cancel_retryable,
  create_bridge,
  redeem_retryable,
  send_message,
} from "@ethernauta/arbitrum"
import { eip155_421614 } from "@ethernauta/chain/eip155-421614"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Hash32Schema,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import { useProvider } from "@ethernauta/react"
import {
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { hex_to_bigint } from "@ethernauta/utils"
import { useEffect, useMemo, useState } from "react"
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

const DEFAULT_TARGET =
  "0x000000000000000000000000000000000000dEaD"
const DEFAULT_L2_CALL_VALUE_HEX = "0x0"
const DEFAULT_MAX_SUBMISSION_HEX = "0x2386f26fc10000" // 0.01 ETH
const DEFAULT_GAS_LIMIT_HEX = "0x186a0" // 100_000
const DEFAULT_MAX_FEE_PER_GAS_HEX = "0x3b9aca00" // 1 gwei
const DEFAULT_DATA_HEX = "0x"
const STORAGE_KEY =
  "ethernauta:bridge-arbitrum-retryable:state"

const PersistedStateSchema = object({
  target: AddressSchema,
  l1_tx_hash: Hash32Schema,
  ticket_id: nullable(Bytes32Schema),
  redeem_l2_tx_hash: nullable(Hash32Schema),
  cancel_l2_tx_hash: nullable(Hash32Schema),
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
        className="send-calls-row-value is-mono bridge-arbitrum-retryable-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {href}
      </a>
    </div>
  )
}

export function BridgeArbitrumRetryableDemo() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [_target, set_target] = useState(DEFAULT_TARGET)
  const [_l2_call_value, set_l2_call_value] = useState(
    DEFAULT_L2_CALL_VALUE_HEX,
  )
  const [_max_submission_cost, set_max_submission_cost] =
    useState(DEFAULT_MAX_SUBMISSION_HEX)
  const [_gas_limit, set_gas_limit] = useState(
    DEFAULT_GAS_LIMIT_HEX,
  )
  const [_max_fee_per_gas, set_max_fee_per_gas] = useState(
    DEFAULT_MAX_FEE_PER_GAS_HEX,
  )
  const [_data, set_data] = useState(DEFAULT_DATA_HEX)
  const [_ticket_id_input, set_ticket_id_input] = useState(
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  )
  const [persisted, set_persisted] =
    useState<PersistedState | null>(null)
  const [phase, set_phase] = useState<
    "idle" | "creating" | "redeeming" | "cancelling"
  >("idle")
  const [error, set_error] = useState<string | null>(null)

  useEffect(() => {
    const initial = read_persisted()
    if (initial) set_persisted(initial)
  }, [])

  const create_preview = useMemo(() => {
    const target_result = safeParse(AddressSchema, _target)
    const l2_call_value_result = safeParse(
      Uint256Schema,
      _l2_call_value,
    )
    const max_submission_cost_result = safeParse(
      Uint256Schema,
      _max_submission_cost,
    )
    const gas_limit_result = safeParse(
      Uint256Schema,
      _gas_limit,
    )
    const max_fee_per_gas_result = safeParse(
      Uint256Schema,
      _max_fee_per_gas,
    )
    const data_result = safeParse(BytesSchema, _data)
    if (
      !target_result.success ||
      !l2_call_value_result.success ||
      !max_submission_cost_result.success ||
      !gas_limit_result.success ||
      !max_fee_per_gas_result.success ||
      !data_result.success
    )
      return null
    const msg_value = parse(
      UintSchema,
      `0x${(
        hex_to_bigint(l2_call_value_result.output) +
          hex_to_bigint(max_submission_cost_result.output) +
          hex_to_bigint(gas_limit_result.output) *
            hex_to_bigint(max_fee_per_gas_result.output)
      ).toString(16)}`,
    )
    return {
      target: target_result.output,
      l2_call_value: l2_call_value_result.output,
      max_submission_cost:
        max_submission_cost_result.output,
      gas_limit: gas_limit_result.output,
      max_fee_per_gas: max_fee_per_gas_result.output,
      data: data_result.output,
      msg_value,
    }
  }, [
    _target,
    _l2_call_value,
    _max_submission_cost,
    _gas_limit,
    _max_fee_per_gas,
    _data,
  ])

  const parsed_ticket_id = useMemo(() => {
    const result = safeParse(
      Bytes32Schema,
      _ticket_id_input,
    )
    return result.success ? result.output : null
  }, [_ticket_id_input])

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

  async function create() {
    if (!provider || !create_preview || !owner) return
    set_error(null)
    try {
      set_phase("creating")
      await ensure_chain(SEPOLIA_HEX)
      const refund = parse(AddressSchema, owner)
      const l1_tx_hash = await send_message({
        to: create_preview.target,
        l2_call_value: create_preview.l2_call_value,
        max_submission_cost:
          create_preview.max_submission_cost,
        excess_fee_refund_address: refund,
        call_value_refund_address: refund,
        gas_limit: create_preview.gas_limit,
        max_fee_per_gas: create_preview.max_fee_per_gas,
        data: create_preview.data,
      })(
        bridge({
          l1: SEPOLIA_CHAIN_ID,
          l2: ARB_SEPOLIA_CHAIN_ID,
          signer: provider.signer({
            chain_id: SEPOLIA_CHAIN_ID,
          }),
        }),
      )
      const next: PersistedState = {
        target: create_preview.target,
        l1_tx_hash,
        ticket_id: null,
        redeem_l2_tx_hash: null,
        cancel_l2_tx_hash: null,
      }
      write_persisted(next)
      set_persisted(next)
    } catch (e) {
      set_error(format_error(e))
    } finally {
      set_phase("idle")
    }
  }

  function save_ticket_id() {
    if (!persisted || !parsed_ticket_id) return
    const next: PersistedState = {
      ...persisted,
      ticket_id: parsed_ticket_id,
    }
    write_persisted(next)
    set_persisted(next)
  }

  async function do_redeem() {
    if (!provider || !persisted || !persisted.ticket_id)
      return
    set_error(null)
    try {
      set_phase("redeeming")
      await ensure_chain(ARB_SEPOLIA_HEX)
      const l2_tx_hash = await redeem_retryable({
        ticket_id: persisted.ticket_id,
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
        ...persisted,
        redeem_l2_tx_hash: l2_tx_hash,
      }
      write_persisted(next)
      set_persisted(next)
    } catch (e) {
      set_error(format_error(e))
    } finally {
      set_phase("idle")
    }
  }

  async function do_cancel() {
    if (!provider || !persisted || !persisted.ticket_id)
      return
    set_error(null)
    try {
      set_phase("cancelling")
      await ensure_chain(ARB_SEPOLIA_HEX)
      const l2_tx_hash = await cancel_retryable({
        ticket_id: persisted.ticket_id,
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
        ...persisted,
        cancel_l2_tx_hash: l2_tx_hash,
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
    set_error(null)
  }

  const in_flight = phase !== "idle"

  return (
    <div>
      <Row label="Origin" value="Ethereum Sepolia (L1)" />
      <Row
        label="Destination"
        value="Arbitrum Sepolia (L2)"
      />
      <Row label="Account" value={owner} mono />
      <div className="bridge-arbitrum-retryable-note">
        Arbitrum L1→L2 retryable tickets auto-redeem on L2
        if <code>gas_limit * max_fee_per_gas</code> is sized
        large enough at creation. If auto-redeem fails (out
        of gas, target reverts), the dapp has the ticket's
        lifetime (default 7 days) to{" "}
        <code>redeem_retryable</code> with fresh L2 gas — or{" "}
        <code>cancel_retryable</code> to refund the L1
        callvalue to <code>callValueRefundAddress</code> and
        give up. Use <code>0xdEaD</code> as the target for a
        no-op deposit, or any L2 contract you control.
      </div>

      {!persisted && (
        <div className="bridge-arbitrum-retryable-section">
          <h3>1 · Create retryable ticket on L1</h3>
          <div className="bridge-arbitrum-retryable-form">
            <label className="bridge-arbitrum-retryable-label">
              target (L2 address)
              <input
                className="bridge-arbitrum-retryable-input"
                value={_target}
                onChange={(e) =>
                  set_target(e.currentTarget.value)
                }
              />
            </label>
            <label className="bridge-arbitrum-retryable-label">
              l2_call_value (hex wei)
              <input
                className="bridge-arbitrum-retryable-input"
                value={_l2_call_value}
                onChange={(e) =>
                  set_l2_call_value(e.currentTarget.value)
                }
              />
            </label>
            <label className="bridge-arbitrum-retryable-label">
              max_submission_cost (hex wei)
              <input
                className="bridge-arbitrum-retryable-input"
                value={_max_submission_cost}
                onChange={(e) =>
                  set_max_submission_cost(
                    e.currentTarget.value,
                  )
                }
              />
            </label>
            <label className="bridge-arbitrum-retryable-label">
              gas_limit (hex)
              <input
                className="bridge-arbitrum-retryable-input"
                value={_gas_limit}
                onChange={(e) =>
                  set_gas_limit(e.currentTarget.value)
                }
              />
            </label>
            <label className="bridge-arbitrum-retryable-label">
              max_fee_per_gas (hex wei/gas)
              <input
                className="bridge-arbitrum-retryable-input"
                value={_max_fee_per_gas}
                onChange={(e) =>
                  set_max_fee_per_gas(e.currentTarget.value)
                }
              />
            </label>
            <label className="bridge-arbitrum-retryable-label">
              data (hex)
              <input
                className="bridge-arbitrum-retryable-input"
                value={_data}
                onChange={(e) =>
                  set_data(e.currentTarget.value)
                }
              />
            </label>
          </div>
          {create_preview && (
            <Row
              label="msg.value (computed)"
              value={format_wei(create_preview.msg_value)}
            />
          )}
          <div className="bridge-arbitrum-retryable-actions">
            <Button
              onClick={create}
              disabled={
                in_flight || !create_preview || !provider
              }
            >
              {phase === "creating"
                ? "Signing on Sepolia…"
                : "Create retryable ticket on Sepolia"}
            </Button>
          </div>
        </div>
      )}

      {persisted && (
        <>
          <div className="bridge-arbitrum-retryable-section">
            <h3>2 · L1 receipt</h3>
            <Row
              label="target"
              value={persisted.target}
              mono
            />
            <Row
              label="L1 tx hash"
              value={persisted.l1_tx_hash}
              mono
            />
            <LinkRow
              label="L1 explorer (paste ticket id from L2 tab)"
              href={`https://sepolia.etherscan.io/tx/${persisted.l1_tx_hash}`}
            />
            <LinkRow
              label="Arbiscan L2 mirror"
              href={`https://sepolia.arbiscan.io/tx/${persisted.l1_tx_hash}`}
            />
          </div>

          <div className="bridge-arbitrum-retryable-section">
            <h3>3 · Ticket id</h3>
            <div className="bridge-arbitrum-retryable-form">
              <label className="bridge-arbitrum-retryable-label">
                ticket_id (bytes32) — paste from Arbiscan's
                Cross-Chain Messages tab
                <input
                  className="bridge-arbitrum-retryable-input"
                  value={
                    persisted.ticket_id ?? _ticket_id_input
                  }
                  onChange={(e) =>
                    set_ticket_id_input(
                      e.currentTarget.value,
                    )
                  }
                  readOnly={persisted.ticket_id !== null}
                />
              </label>
            </div>
            {persisted.ticket_id === null && (
              <div className="bridge-arbitrum-retryable-actions">
                <Button
                  onClick={save_ticket_id}
                  disabled={!parsed_ticket_id}
                >
                  Save ticket id
                </Button>
              </div>
            )}
          </div>

          {persisted.ticket_id !== null && (
            <div className="bridge-arbitrum-retryable-section">
              <h3>4 · Redeem or cancel on L2</h3>
              <div className="bridge-arbitrum-retryable-actions">
                <Button
                  onClick={do_redeem}
                  disabled={
                    in_flight ||
                    !provider ||
                    persisted.redeem_l2_tx_hash !== null ||
                    persisted.cancel_l2_tx_hash !== null
                  }
                >
                  {phase === "redeeming"
                    ? "Redeeming on Arb Sepolia…"
                    : "Redeem on Arb Sepolia"}
                </Button>
                <Button
                  onClick={do_cancel}
                  disabled={
                    in_flight ||
                    !provider ||
                    persisted.redeem_l2_tx_hash !== null ||
                    persisted.cancel_l2_tx_hash !== null
                  }
                >
                  {phase === "cancelling"
                    ? "Cancelling on Arb Sepolia…"
                    : "Cancel on Arb Sepolia"}
                </Button>
              </div>
            </div>
          )}

          {persisted.redeem_l2_tx_hash && (
            <div className="bridge-arbitrum-retryable-section">
              <h3>5 · Redeem receipt</h3>
              <Row
                label="L2 tx hash"
                value={persisted.redeem_l2_tx_hash}
                mono
              />
              <LinkRow
                label="L2 explorer"
                href={`https://sepolia.arbiscan.io/tx/${persisted.redeem_l2_tx_hash}`}
              />
            </div>
          )}

          {persisted.cancel_l2_tx_hash && (
            <div className="bridge-arbitrum-retryable-section">
              <h3>5 · Cancel receipt</h3>
              <Row
                label="L2 tx hash"
                value={persisted.cancel_l2_tx_hash}
                mono
              />
              <LinkRow
                label="L2 explorer"
                href={`https://sepolia.arbiscan.io/tx/${persisted.cancel_l2_tx_hash}`}
              />
            </div>
          )}

          <div className="bridge-arbitrum-retryable-actions">
            <Button variant="ghost" onClick={reset}>
              Reset (forget this ticket)
            </Button>
          </div>
        </>
      )}

      {error && (
        <div className="bridge-arbitrum-retryable-error">
          {error}
        </div>
      )}
    </div>
  )
}
