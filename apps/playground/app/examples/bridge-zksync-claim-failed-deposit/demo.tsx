// Sepolia → Era Sepolia ERC-20 deposit lifecycle ending in L1
// refund through `L1Nullifier.claimFailedDeposit`. Three phases:
//
//   1. submit a deliberately-failing deposit on L1 by setting
//      `l2_gas_limit` below the era-contracts `L1_TX_MIN_L2_GAS_BASE`
//      (= 173_484) so the L1→L2 priority op runs out of gas on L2;
//   2. wait for the failure to be sealed in a batch, then assemble
//      the 9-field FailedDepositProof off-band — `zks_getL2ToL1LogProof`
//      gives `batchNumber`, `id` (= l2MessageIndex), and `proof`;
//      `zks_getTransactionDetails` gives `l2TxNumberInBatch`. A
//      future `fetch_failed_deposit_proof` helper will package this
//      automatically; for now, paste the assembled JSON;
//   3. call `claim_failed_deposit` on L1 — the L1Nullifier verifies
//      the proof and credits the depositor.
//
// localStorage persists deposit tx hash + proof across phases. The
// bridge resolver rebuilds per phase because the signer chain is
// L1 (Sepolia) at both initiation and claim. Same `paste-from-RPC`
// idiom as Arbitrum's withdraw demo.

import "./demo.css"
import { eip155_300 } from "@ethernauta/chain/eip155-300"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import {
  AddressSchema,
  Hash32Schema,
  Uint256Schema,
} from "@ethernauta/core"
import { useProvider } from "@ethernauta/react"
import {
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { bigint_to_hex } from "@ethernauta/utils"
import {
  claim_failed_deposit,
  create_bridge,
  FailedDepositProofSchema,
  require_deploy_addresses,
  send_erc20,
} from "@ethernauta/zksync"
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
const ERA_SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_300.chainId,
})

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

// `L1_TX_MIN_L2_GAS_BASE = 173_484` per era-contracts. Picking a
// value below this guarantees the L2-side execution OOGs and the
// deposit ends up in the failed-deposit queue ready to be claimed.
const FAILING_L2_GAS_LIMIT_HEX = bigint_to_hex(50_000n)
const DEFAULT_AMOUNT_HEX = "0xde0b6b3a7640000" // 1 token
const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000"
const STORAGE_KEY =
  "ethernauta:bridge-zksync-claim-failed-deposit:state"

const ERA_DEPLOYS = require_deploy_addresses(
  ERA_SEPOLIA_CHAIN_ID,
)
const L1_NULLIFIER = ERA_DEPLOYS.l1.l1Nullifier

const PersistedStateSchema = object({
  owner: AddressSchema,
  l1_token: AddressSchema,
  amount: Uint256Schema,
  deposit_l1_tx_hash: Hash32Schema,
  proof: nullable(FailedDepositProofSchema),
  claim_l1_tx_hash: nullable(Hash32Schema),
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
        className="send-calls-row-value is-mono bridge-zksync-claim-failed-deposit-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {href}
      </a>
    </div>
  )
}

export function BridgeZksyncClaimFailedDepositDemo() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [_l1_token, set_l1_token] = useState(ZERO_ADDRESS)
  const [_amount, set_amount] = useState(DEFAULT_AMOUNT_HEX)
  const [_proof_input, set_proof_input] = useState("")
  const [persisted, set_persisted] =
    useState<PersistedState | null>(null)
  const [phase, set_phase] = useState<
    "idle" | "submitting" | "claiming"
  >("idle")
  const [error, set_error] = useState<string | null>(null)

  useEffect(() => {
    const initial = read_persisted()
    if (initial) set_persisted(initial)
  }, [])

  const parsed_proof = useMemo(() => {
    try {
      const decoded = JSON.parse(_proof_input)
      const result = safeParse(
        FailedDepositProofSchema,
        decoded,
      )
      return result.success ? result.output : null
    } catch {
      return null
    }
  }, [_proof_input])

  const preview = useMemo(() => {
    const l1_token_result = safeParse(
      AddressSchema,
      _l1_token,
    )
    const amount_result = safeParse(Uint256Schema, _amount)
    if (!l1_token_result.success || !amount_result.success)
      return null
    return {
      l1_token: l1_token_result.output,
      amount: amount_result.output,
    }
  }, [_l1_token, _amount])

  if (!owner) return <SignInHint />

  async function submit_failing_deposit() {
    if (!provider || !preview || !owner) return
    set_error(null)
    try {
      set_phase("submitting")
      const l2_gas_limit = parse(
        Uint256Schema,
        FAILING_L2_GAS_LIMIT_HEX,
      )
      const deposit_l1_tx_hash = await send_erc20({
        l1_token: preview.l1_token,
        to: parse(AddressSchema, owner),
        amount: preview.amount,
        l2_gas_limit,
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
        owner: parse(AddressSchema, owner),
        l1_token: preview.l1_token,
        amount: preview.amount,
        deposit_l1_tx_hash,
        proof: null,
        claim_l1_tx_hash: null,
      }
      write_persisted(next)
      set_persisted(next)
    } catch (e) {
      set_error(format_error(e))
    } finally {
      set_phase("idle")
    }
  }

  function save_proof() {
    if (!persisted || !parsed_proof) return
    const next: PersistedState = {
      ...persisted,
      proof: parsed_proof,
    }
    write_persisted(next)
    set_persisted(next)
  }

  async function do_claim() {
    if (!provider || !persisted || !persisted.proof) return
    set_error(null)
    try {
      set_phase("claiming")
      const claim_l1_tx_hash = await claim_failed_deposit({
        proof: persisted.proof,
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
        claim_l1_tx_hash,
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
        value="zkSync Era Sepolia (L2)"
      />
      <Row label="Account" value={owner} mono />
      <Row
        label="L1Nullifier (claim target)"
        value={L1_NULLIFIER}
        mono
      />
      <div className="bridge-zksync-claim-failed-deposit-note">
        zkSync's failed-deposit lifecycle is its L1→L2
        counterpart to Arbitrum's retryable-redeem path: when
        the L2-side execution of a priority deposit reverts
        (out-of-gas, target revert, etc.), the deposited
        tokens are stuck in the L1 escrow until the depositor
        proves the failure on L1 and calls{" "}
        <code>L1Nullifier.claimFailedDeposit</code>. This
        demo deliberately triggers an L2 OOG by setting{" "}
        <code>l2_gas_limit</code> to{" "}
        <code>{FAILING_L2_GAS_LIMIT_HEX}</code> — well below
        the era-contracts <code>L1_TX_MIN_L2_GAS_BASE</code>{" "}
        of 173_484 — so the deposit is guaranteed to fail.
      </div>

      {!persisted && (
        <div className="bridge-zksync-claim-failed-deposit-section">
          <h3>1 · Submit failing deposit on L1</h3>
          <div className="bridge-zksync-claim-failed-deposit-form">
            <label className="bridge-zksync-claim-failed-deposit-label">
              l1_token (Sepolia ERC-20)
              <input
                className="bridge-zksync-claim-failed-deposit-input"
                value={_l1_token}
                onChange={(e) =>
                  set_l1_token(e.currentTarget.value)
                }
              />
            </label>
            <label className="bridge-zksync-claim-failed-deposit-label">
              amount (hex, token base units)
              <input
                className="bridge-zksync-claim-failed-deposit-input"
                value={_amount}
                onChange={(e) =>
                  set_amount(e.currentTarget.value)
                }
              />
            </label>
          </div>
          <div className="bridge-zksync-claim-failed-deposit-actions">
            <Button
              onClick={submit_failing_deposit}
              disabled={in_flight || !preview || !provider}
            >
              {phase === "submitting"
                ? "Submitting on Sepolia…"
                : "Submit failing deposit"}
            </Button>
          </div>
        </div>
      )}

      {persisted && (
        <>
          <div className="bridge-zksync-claim-failed-deposit-section">
            <h3>2 · L1 deposit receipt</h3>
            <Row
              label="l1_token"
              value={persisted.l1_token}
              mono
            />
            <Row
              label="amount"
              value={persisted.amount}
              mono
            />
            <Row
              label="L1 tx hash"
              value={persisted.deposit_l1_tx_hash}
              mono
            />
            <LinkRow
              label="Etherscan L1 view"
              href={`https://sepolia.etherscan.io/tx/${persisted.deposit_l1_tx_hash}`}
            />
            <LinkRow
              label="Era Sepolia explorer (look for the failed L1→L2 op)"
              href={`https://sepolia.explorer.zksync.io/address/${persisted.owner}`}
            />
          </div>

          <div className="bridge-zksync-claim-failed-deposit-section">
            <h3>3 · Paste FailedDepositProof</h3>
            <div className="bridge-zksync-claim-failed-deposit-note">
              Once the L1→L2 op fails on L2 and lands in a
              committed batch (~5 min on Era Sepolia),
              assemble the 9-field proof off-band and paste
              the JSON below. The fields come from:
              <ul>
                <li>
                  <code>chainIdNumeric</code> = <code>0x12c</code>{" "}
                  (300)
                </li>
                <li>
                  <code>depositSender</code> = your L1 address
                </li>
                <li>
                  <code>l1Token</code>, <code>amount</code> = the
                  same values you submitted above
                </li>
                <li>
                  <code>l2TxHash</code> = canonical L2 hash of
                  the failed priority op (derivable from the L1
                  receipt's <code>NewPriorityRequest</code> event
                  — slice 4c will surface a helper)
                </li>
                <li>
                  <code>l2BatchNumber</code>,{" "}
                  <code>l2MessageIndex</code> (= <code>id</code>),{" "}
                  <code>merkleProof</code> = from{" "}
                  <code>zks_getL2ToL1LogProof</code>
                </li>
                <li>
                  <code>l2TxNumberInBatch</code> = from{" "}
                  <code>zks_getTransactionDetails</code>
                </li>
              </ul>
            </div>
            <div className="bridge-zksync-claim-failed-deposit-form">
              <label className="bridge-zksync-claim-failed-deposit-label">
                proof (JSON)
                <textarea
                  className="bridge-zksync-claim-failed-deposit-input"
                  value={
                    persisted.proof
                      ? JSON.stringify(
                          persisted.proof,
                          null,
                          2,
                        )
                      : _proof_input
                  }
                  onChange={(e) =>
                    set_proof_input(e.currentTarget.value)
                  }
                  readOnly={persisted.proof !== null}
                  rows={14}
                />
              </label>
            </div>
            {persisted.proof === null && (
              <div className="bridge-zksync-claim-failed-deposit-actions">
                <Button
                  onClick={save_proof}
                  disabled={!parsed_proof}
                >
                  Save proof
                </Button>
              </div>
            )}
          </div>

          {persisted.proof && (
            <div className="bridge-zksync-claim-failed-deposit-section">
              <h3>4 · Claim on L1</h3>
              <div className="bridge-zksync-claim-failed-deposit-actions">
                <Button
                  onClick={do_claim}
                  disabled={
                    in_flight ||
                    !provider ||
                    persisted.claim_l1_tx_hash !== null
                  }
                >
                  {phase === "claiming"
                    ? "Claiming on Sepolia…"
                    : "Claim failed deposit on Sepolia"}
                </Button>
              </div>
            </div>
          )}

          {persisted.claim_l1_tx_hash && (
            <div className="bridge-zksync-claim-failed-deposit-section">
              <h3>5 · L1 claim receipt</h3>
              <Row
                label="L1 claim tx hash"
                value={persisted.claim_l1_tx_hash}
                mono
              />
              <LinkRow
                label="Etherscan claim view"
                href={`https://sepolia.etherscan.io/tx/${persisted.claim_l1_tx_hash}`}
              />
            </div>
          )}

          <div className="bridge-zksync-claim-failed-deposit-actions">
            <Button variant="ghost" onClick={reset}>
              Reset (forget this deposit)
            </Button>
          </div>
        </>
      )}

      {error && (
        <div className="bridge-zksync-claim-failed-deposit-error">
          {error}
        </div>
      )}
    </div>
  )
}
