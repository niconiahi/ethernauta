import "./demo.css"
import {
  address,
  bytes,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import {
  type Address,
  AddressSchema,
  type Bytes,
  BytesSchema,
  type Uint256,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import {
  ENTRY_POINT_V07_ADDRESS,
  type UserOperation,
} from "@ethernauta/eip/4337"
import {
  apply_to_user_op,
  type PaymasterData,
  type PaymasterStubData,
  pm_getPaymasterData,
  pm_getPaymasterStubData,
} from "@ethernauta/erc/7677"
import { http } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { useState } from "react"
import { parse } from "valibot"
import { Button } from "../../components/button"

const SEPOLIA_REF_HEX = parse(
  UintSchema,
  `0x${eip155_11155111.chainId.toString(16)}`,
)

const EXECUTE_CODECS = [
  address(),
  uint256(),
  bytes(),
] as const

function encode_execute(
  target: Address,
  value: Uint256,
  data: Bytes,
): Bytes {
  return parse(
    BytesSchema,
    bytes_to_hex(
      encode_function_call({
        name: "execute",
        args: EXECUTE_CODECS,
        values: [target, value, data] as const,
      }),
    ),
  )
}

const ZERO_NONCE = parse(UintSchema, "0x0")
const ONE_WEI = parse(Uint256Schema, "0x1")
const ZERO_BYTES = parse(BytesSchema, "0x")
const CALL_GAS_LIMIT = parse(UintSchema, "0x186a0")
const VERIFICATION_GAS_LIMIT = parse(UintSchema, "0x186a0")
const PRE_VERIFICATION_GAS = parse(UintSchema, "0xc350")
const MAX_FEE_PER_GAS = parse(UintSchema, "0x6fc23ac00")
const MAX_PRIORITY_FEE_PER_GAS = parse(
  UintSchema,
  "0x77359400",
)
const PLACEHOLDER_SIGNATURE = parse(
  BytesSchema,
  `0x${"00".repeat(65)}`,
)

export function Paymaster7677Demo() {
  const [sender, set_sender] = useState("")
  const [recipient, set_recipient] = useState(
    "0x0000000000000000000000000000000000000001",
  )
  const [paymaster_url, set_paymaster_url] = useState("")

  const [draft, set_draft] = useState<UserOperation | null>(
    null,
  )
  const [stub, set_stub] =
    useState<PaymasterStubData | null>(null)
  const [stub_applied, set_stub_applied] =
    useState<UserOperation | null>(null)
  const [final_data, set_final_data] =
    useState<PaymasterData | null>(null)
  const [final_applied, set_final_applied] =
    useState<UserOperation | null>(null)

  const [busy, set_busy] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  function reset() {
    set_draft(null)
    set_stub(null)
    set_stub_applied(null)
    set_final_data(null)
    set_final_applied(null)
    set_error(null)
  }

  function build_draft() {
    set_error(null)
    try {
      const op: UserOperation = {
        sender: parse(AddressSchema, sender),
        nonce: ZERO_NONCE,
        callData: encode_execute(
          parse(AddressSchema, recipient),
          ONE_WEI,
          ZERO_BYTES,
        ),
        callGasLimit: CALL_GAS_LIMIT,
        verificationGasLimit: VERIFICATION_GAS_LIMIT,
        preVerificationGas: PRE_VERIFICATION_GAS,
        maxFeePerGas: MAX_FEE_PER_GAS,
        maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
        signature: PLACEHOLDER_SIGNATURE,
      }
      set_draft(op)
      set_stub(null)
      set_stub_applied(null)
      set_final_data(null)
      set_final_applied(null)
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    }
  }

  async function fetch_stub() {
    if (!draft || !paymaster_url) return
    set_busy(true)
    set_error(null)
    try {
      const result = await pm_getPaymasterStubData({
        userOp: {
          sender: draft.sender,
          nonce: draft.nonce,
          callData: draft.callData,
          callGasLimit: draft.callGasLimit,
          verificationGasLimit: draft.verificationGasLimit,
          preVerificationGas: draft.preVerificationGas,
          maxFeePerGas: draft.maxFeePerGas,
          maxPriorityFeePerGas: draft.maxPriorityFeePerGas,
        },
        entryPoint: ENTRY_POINT_V07_ADDRESS,
        chainId: SEPOLIA_REF_HEX,
      })(http(paymaster_url))
      set_stub(result)
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    } finally {
      set_busy(false)
    }
  }

  function apply_stub() {
    if (!draft || !stub) return
    set_error(null)
    try {
      set_stub_applied(apply_to_user_op(draft, stub))
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    }
  }

  async function fetch_final() {
    if (!stub_applied || !paymaster_url) return
    set_busy(true)
    set_error(null)
    try {
      const result = await pm_getPaymasterData({
        userOp: {
          sender: stub_applied.sender,
          nonce: stub_applied.nonce,
          callData: stub_applied.callData,
          callGasLimit: stub_applied.callGasLimit,
          verificationGasLimit:
            stub_applied.verificationGasLimit,
          preVerificationGas:
            stub_applied.preVerificationGas,
          maxFeePerGas: stub_applied.maxFeePerGas,
          maxPriorityFeePerGas:
            stub_applied.maxPriorityFeePerGas,
        },
        entryPoint: ENTRY_POINT_V07_ADDRESS,
        chainId: SEPOLIA_REF_HEX,
      })(http(paymaster_url))
      set_final_data(result)
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    } finally {
      set_busy(false)
    }
  }

  function apply_final() {
    if (!stub_applied || !final_data) return
    set_error(null)
    try {
      set_final_applied(
        apply_to_user_op(stub_applied, final_data),
      )
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="pm-root">
      <section className="pm-steps">
        <h4 className="pm-section-heading">
          <span>How to run this demo</span>
        </h4>
        <p className="pm-steps-sub">What you'll see</p>
        <ul className="pm-steps-list">
          <li>
            ERC-7677 defines a paymaster RPC protocol with
            two methods:{" "}
            <code>pm_getPaymasterStubData</code> returns
            dummy paymaster fields + realistic gas limits
            (used for bundler estimation);{" "}
            <code>pm_getPaymasterData</code> returns the
            real signed paymaster payload (the paymaster has
            now committed to sponsoring the call).
          </li>
          <li>
            The library binds both methods plus a small{" "}
            <code>apply_to_user_op</code> helper that merges
            a paymaster response onto a v0.7{" "}
            <code>UserOperation</code>. This demo runs the
            paymaster surface in isolation — no bundler
            submission, no signing, no tx.
          </li>
        </ul>
        <p className="pm-steps-sub">Before you start</p>
        <ul className="pm-steps-list">
          <li>
            A paymaster URL that supports ERC-7677 on
            Sepolia. Pimlico's URL{" "}
            <code>
              https://api.pimlico.io/v2/sepolia/rpc?apikey=YOUR_KEY
            </code>{" "}
            works (free tier at{" "}
            <a
              href="https://dashboard.pimlico.io"
              target="_blank"
              rel="noreferrer"
            >
              dashboard.pimlico.io
            </a>
            ). Alchemy, Biconomy, and any compliant
            paymaster also work.
          </li>
          <li>
            A smart account on Sepolia (deployed or
            counterfactual). For this demo we won't sign or
            submit anything, but the paymaster will simulate
            against the address you provide.
          </li>
        </ul>
        <p className="pm-steps-sub">Steps</p>
        <ol className="pm-steps-list">
          <li>
            Paste your smart account address in{" "}
            <strong>Smart account (sender)</strong>, leave
            the recipient at its default (or set it to
            anything), and paste the paymaster URL.
          </li>
          <li>
            Click <strong>Build draft UserOp</strong>. The
            draft has the smart-account fields but no
            paymaster fields. You'll see the JSON below.
          </li>
          <li>
            Click <strong>pm_getPaymasterStubData</strong>.
            The paymaster returns a v0.7 stub payload:{" "}
            <code>paymaster</code> +{" "}
            <code>paymasterData</code> (dummy values),{" "}
            <code>paymasterVerificationGasLimit</code>, and{" "}
            <code>paymasterPostOpGasLimit</code> (realistic
            gas limits the bundler will use for estimation),
            plus an optional <code>sponsor</code> name and{" "}
            <code>isFinal</code> flag.
          </li>
          <li>
            Click <strong>apply_to_user_op (stub)</strong>.
            The helper merges the stub response onto the
            draft, populating the four paymaster fields the
            v0.7 schema declares.
          </li>
          <li>
            Click <strong>pm_getPaymasterData</strong>. The
            paymaster returns the final v0.7 payload:{" "}
            <code>paymaster</code> +{" "}
            <code>paymasterData</code> (real signed values)
            without gas limits — those stay as the stub
            assigned them.
          </li>
          <li>
            Click <strong>apply_to_user_op (final)</strong>.
            The merged op is now ready to be signed and
            submitted to a bundler.
          </li>
        </ol>
      </section>

      <Section
        heading="1. Inputs"
        tag="Sepolia · EntryPoint v0.7"
      >
        <Field
          label="Smart account (sender)"
          value={sender}
          onChange={set_sender}
          placeholder="0x… SimpleAccount v0.7 on Sepolia"
        />
        <Field
          label="Recipient"
          value={recipient}
          onChange={set_recipient}
          placeholder="0x… (target of the inner execute call)"
        />
        <Field
          label="Paymaster URL"
          value={paymaster_url}
          onChange={set_paymaster_url}
          placeholder="https://api.pimlico.io/v2/sepolia/rpc?apikey=…"
        />
        <div className="pm-actions">
          <Button
            onClick={build_draft}
            disabled={
              busy ||
              sender.length === 0 ||
              recipient.length === 0
            }
          >
            Build draft UserOp
          </Button>
          {(draft || stub || final_data) && (
            <Button
              variant="secondary"
              onClick={reset}
              disabled={busy}
            >
              Reset
            </Button>
          )}
        </div>
      </Section>

      {draft && (
        <Section
          heading="2. Draft UserOp"
          tag="No paymaster fields yet"
        >
          <p className="pm-section-lead">
            The v0.7 UserOperation. Smart-account fields are
            populated; <code>paymaster</code>,{" "}
            <code>paymasterData</code>, and the paymaster
            gas-limit fields are absent because we haven't
            asked the paymaster yet.
          </p>
          <details className="pm-details" open>
            <summary className="pm-summary">JSON</summary>
            <pre className="pm-pre">
              {JSON.stringify(draft, null, 2)}
            </pre>
          </details>
        </Section>
      )}

      {draft && (
        <Section
          heading="3. Fetch stub data"
          tag="pm_getPaymasterStubData"
        >
          <p className="pm-section-lead">
            Asks the paymaster for placeholder fields. The
            paymaster returns realistic gas limits (so the
            bundler can estimate against them) plus a dummy{" "}
            <code>paymasterData</code> the size of the real
            signature.
          </p>
          <div className="pm-actions">
            <Button
              onClick={fetch_stub}
              disabled={busy || !paymaster_url}
            >
              pm_getPaymasterStubData
            </Button>
          </div>
          {stub && (
            <details className="pm-details" open>
              <summary className="pm-summary">
                Response (
                {"paymaster" in stub ? "v0.7" : "v0.6"})
              </summary>
              <pre className="pm-pre">
                {JSON.stringify(stub, null, 2)}
              </pre>
            </details>
          )}
        </Section>
      )}

      {stub && (
        <Section
          heading="4. Apply stub to UserOp"
          tag="apply_to_user_op"
        >
          <p className="pm-section-lead">
            Merges the stub onto the draft. v0.6 responses
            (carrying <code>paymasterAndData</code>) throw a
            typed error because the v0.7 UserOperation
            schema has no slot for the packed shape — those
            callers compose manually.
          </p>
          <div className="pm-actions">
            <Button onClick={apply_stub} disabled={busy}>
              apply_to_user_op (stub)
            </Button>
          </div>
          {stub_applied && (
            <details className="pm-details" open>
              <summary className="pm-summary">
                Merged UserOp
              </summary>
              <pre className="pm-pre">
                {JSON.stringify(stub_applied, null, 2)}
              </pre>
            </details>
          )}
        </Section>
      )}

      {stub_applied && (
        <Section
          heading="5. Fetch final data"
          tag="pm_getPaymasterData"
        >
          <p className="pm-section-lead">
            The paymaster signs over the final UserOp shape
            and returns the real <code>paymaster</code> +{" "}
            <code>paymasterData</code>. Gas limits are not
            re-emitted — they were the stub's job.
          </p>
          <div className="pm-actions">
            <Button
              onClick={fetch_final}
              disabled={busy || !paymaster_url}
            >
              pm_getPaymasterData
            </Button>
          </div>
          {final_data && (
            <details className="pm-details" open>
              <summary className="pm-summary">
                Response (
                {"paymaster" in final_data
                  ? "v0.7"
                  : "v0.6"}
                )
              </summary>
              <pre className="pm-pre">
                {JSON.stringify(final_data, null, 2)}
              </pre>
            </details>
          )}
        </Section>
      )}

      {final_data && (
        <Section
          heading="6. Apply final data"
          tag="apply_to_user_op"
        >
          <p className="pm-section-lead">
            The merged op now carries the real paymaster
            signature. The next step (out of scope for this
            demo) is signing the v0.7 userOpHash with the
            EOA owner and submitting to a bundler.
          </p>
          <div className="pm-actions">
            <Button onClick={apply_final} disabled={busy}>
              apply_to_user_op (final)
            </Button>
          </div>
          {final_applied && (
            <details className="pm-details" open>
              <summary className="pm-summary">
                Final UserOp (ready to sign + submit)
              </summary>
              <pre className="pm-pre">
                {JSON.stringify(final_applied, null, 2)}
              </pre>
            </details>
          )}
        </Section>
      )}

      {error && <p className="pm-error">{error}</p>}
    </div>
  )
}

function Section({
  heading,
  tag,
  children,
}: {
  heading: string
  tag: string
  children: React.ReactNode
}) {
  return (
    <section className="pm-section">
      <h4 className="pm-section-heading">
        <span>{heading}</span>
        <span className="pm-section-tag">{tag}</span>
      </h4>
      {children}
    </section>
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
    <label className="pm-field">
      <span className="pm-field-label">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.currentTarget.value.trim())
        }
        className="pm-field-input"
      />
    </label>
  )
}
