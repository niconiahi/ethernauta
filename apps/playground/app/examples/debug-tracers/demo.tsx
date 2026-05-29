import "./demo.css"
import { eip155_1 } from "@ethernauta/chain/eip155-1"
import {
  AddressSchema,
  BytesSchema,
} from "@ethernauta/core"
import type {
  CallFrame,
  FourByteTrace,
  PreState,
  StructLogResult,
  TraceResult,
} from "@ethernauta/eth"
import {
  BlockNumberOrTagOrHashSchema,
  debug_traceCall,
  STRUCT_TYPE,
  TRACER_TYPE,
  type TracerType,
} from "@ethernauta/eth"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { useState } from "react"
import { parse } from "valibot"
import { Button } from "../../components/button"

const MAINNET_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_1.chainId,
})

// USDC mainnet · balanceOf(vitalik). A STATICCALL with one
// SLOAD — readable on every tracer.
const DEFAULT_FROM =
  "0x0000000000000000000000000000000000000000"
const DEFAULT_TO =
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
const DEFAULT_DATA =
  "0x70a08231000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045"

type TracerChoice = TracerType | "struct"

const TRACER_CHOICES: ReadonlyArray<{
  value: TracerChoice
  label: string
  description: string
}> = [
  {
    value: TRACER_TYPE.CALL,
    label: "callTracer",
    description:
      "Recursive call-frame tree. Best for understanding control flow.",
  },
  {
    value: TRACER_TYPE.PRESTATE,
    label: "prestateTracer",
    description:
      "State touched by the call (or a pre/post diff with diffMode).",
  },
  {
    value: TRACER_TYPE.FOURBYTE,
    label: "4byteTracer",
    description: "Histogram of function selectors invoked.",
  },
  {
    value: STRUCT_TYPE.literal,
    label: "struct (default)",
    description:
      "Per-opcode log. Largest output; useful for low-level debugging.",
  },
]

export function DebugTracersDemo() {
  const [debug_url, set_debug_url] = useState("")
  const [from_addr, set_from_addr] = useState(DEFAULT_FROM)
  const [to_addr, set_to_addr] = useState(DEFAULT_TO)
  const [data, set_data] = useState(DEFAULT_DATA)
  const [block, set_block] = useState("latest")
  const [tracer, set_tracer] = useState<TracerChoice>(
    TRACER_TYPE.CALL,
  )
  const [result, set_result] = useState<TraceResult | null>(
    null,
  )
  const [busy, set_busy] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  async function run_trace() {
    set_busy(true)
    set_error(null)
    set_result(null)
    try {
      const reader = create_reader([
        {
          chainId: MAINNET_CHAIN_ID,
          transports: [http(debug_url)],
        },
      ])
      const ctx = reader({ chain_id: MAINNET_CHAIN_ID })
      const tracer_config =
        tracer === STRUCT_TYPE.literal
          ? undefined
          : { tracer }
      const trace_result = await debug_traceCall({
        transaction: {
          from: parse(AddressSchema, from_addr),
          to: parse(AddressSchema, to_addr),
          input: parse(BytesSchema, data),
        },
        blockNumberOrTagOrHash: parse(
          BlockNumberOrTagOrHashSchema,
          block,
        ),
        tracerConfig: tracer_config,
      })(ctx)
      set_result(trace_result)
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    } finally {
      set_busy(false)
    }
  }

  return (
    <div className="dbg-root">
      <section className="dbg-steps">
        <h4 className="dbg-section-heading">
          <span>How to run this demo</span>
        </h4>
        <p className="dbg-steps-sub">What you'll see</p>
        <ul className="dbg-steps-list">
          <li>
            <code>debug_traceCall</code> replays an{" "}
            <code>eth_call</code> at a historical block's
            state and returns a payload shaped by the
            selected tracer. The library parses each payload
            against its matching schema and tags it with the
            tracer name, so the result is a discriminated{" "}
            <code>TraceResult</code> the consumer switches
            on.
          </li>
          <li>
            The four supported tracers are{" "}
            <code>callTracer</code>,{" "}
            <code>prestateTracer</code>,{" "}
            <code>4byteTracer</code>, and the default struct
            logger (no <code>tracer</code> field on the
            request). Each renders below with the shape the
            library exposes.
          </li>
        </ul>
        <p className="dbg-steps-sub">Before you start</p>
        <ul className="dbg-steps-list">
          <li>
            A debug-capable RPC URL. Most public endpoints
            don't expose <code>debug_*</code>. Options that
            do:{" "}
            <a
              href="https://docs.alchemy.com/reference/debug-tracecall"
              target="_blank"
              rel="noreferrer"
            >
              Alchemy
            </a>{" "}
            (with a paid tier),{" "}
            <a
              href="https://docs.tenderly.co/web3-gateway/web3-gateway"
              target="_blank"
              rel="noreferrer"
            >
              Tenderly's gateway
            </a>
            , or self-hosted geth / reth / erigon. The chain
            the URL talks to determines whether the default{" "}
            <code>to</code> + <code>input</code> below
            resolves (the defaults are{" "}
            <code>USDC.balanceOf(vitalik)</code> on Ethereum
            mainnet).
          </li>
        </ul>
        <p className="dbg-steps-sub">Steps</p>
        <ol className="dbg-steps-list">
          <li>
            Paste your debug-capable RPC URL in{" "}
            <strong>Debug RPC URL</strong>.
          </li>
          <li>
            Leave the{" "}
            <strong>from / to / data / block</strong>{" "}
            defaults (mainnet USDC <code>balanceOf</code>)
            or paste your own call.
          </li>
          <li>
            Pick a tracer with the radio buttons. Each
            renders the matching tracer's typed output
            below.
          </li>
          <li>
            Click <strong>Run debug_traceCall</strong>. The
            result panel shows the typed payload —
            call-frame tree, prestate map, 4byte histogram,
            or per-opcode steps depending on which tracer
            you picked.
          </li>
        </ol>
      </section>

      <Section heading="1. Inputs" tag="debug_traceCall">
        <Field
          label="Debug RPC URL"
          value={debug_url}
          onChange={set_debug_url}
          placeholder="https://… (must expose debug_*)"
        />
        <Field
          label="from"
          value={from_addr}
          onChange={set_from_addr}
        />
        <Field
          label="to"
          value={to_addr}
          onChange={set_to_addr}
        />
        <Field
          label="input (calldata)"
          value={data}
          onChange={set_data}
        />
        <Field
          label="block"
          value={block}
          onChange={set_block}
          placeholder="latest | finalized | 0x<number> | 0x<hash>"
        />
        <div>
          <p className="dbg-section-lead">Tracer</p>
          <div className="dbg-radio-group">
            {TRACER_CHOICES.map((choice) => (
              <label
                key={choice.value}
                className="dbg-radio"
              >
                <input
                  type="radio"
                  name="tracer"
                  value={choice.value}
                  checked={tracer === choice.value}
                  onChange={() => set_tracer(choice.value)}
                />
                <code>{choice.label}</code>
              </label>
            ))}
          </div>
          <p className="dbg-section-lead">
            {
              TRACER_CHOICES.find((c) => c.value === tracer)
                ?.description
            }
          </p>
        </div>
        <div className="dbg-actions">
          <Button
            onClick={run_trace}
            disabled={busy || debug_url.length === 0}
          >
            Run debug_traceCall
          </Button>
        </div>
      </Section>

      {result && result.tracer === TRACER_TYPE.CALL && (
        <Section
          heading="callTracer · CallFrame tree"
          tag="recursive · @ethernauta/eth"
        >
          <pre className="dbg-pre">
            {render_call_frame(result.result, 0)}
          </pre>
          <details className="dbg-details">
            <summary className="dbg-summary">
              Raw JSON
            </summary>
            <pre className="dbg-pre">
              {JSON.stringify(result.result, null, 2)}
            </pre>
          </details>
        </Section>
      )}

      {result && result.tracer === TRACER_TYPE.PRESTATE && (
        <Section
          heading="prestateTracer · state map"
          tag="@ethernauta/eth"
        >
          {render_prestate(result.result)}
        </Section>
      )}

      {result && result.tracer === TRACER_TYPE.FOURBYTE && (
        <Section
          heading="4byteTracer · selector histogram"
          tag="@ethernauta/eth"
        >
          {render_fourbyte(result.result)}
        </Section>
      )}

      {result && result.tracer === STRUCT_TYPE.literal && (
        <Section
          heading="struct (default) · per-opcode log"
          tag="@ethernauta/eth"
        >
          {render_struct(result.result)}
        </Section>
      )}

      {error && <p className="dbg-error">{error}</p>}
    </div>
  )
}

function render_call_frame(
  frame: CallFrame,
  depth: number,
): string {
  const indent = "  ".repeat(depth)
  const target = frame.to ?? "(create)"
  const head = `${indent}${frame.type} ${target} gas=${frame.gasUsed}`
  const err = frame.error
    ? `\n${indent}  ↳ error: ${frame.error}`
    : ""
  const revert = frame.revertReason
    ? `\n${indent}  ↳ revert: ${frame.revertReason}`
    : ""
  const children = (frame.calls ?? [])
    .map((c) => render_call_frame(c, depth + 1))
    .join("\n")
  return `${head}${err}${revert}${
    children.length > 0 ? `\n${children}` : ""
  }`
}

function render_prestate(prestate: PreState) {
  if ("pre" in prestate && "post" in prestate) {
    return (
      <div>
        <p className="dbg-section-lead">
          Diff mode — accounts whose state changed during
          the call. Each address maps to{" "}
          <code>AccountState</code> (balance, nonce, code,
          storage).
        </p>
        <details className="dbg-details" open>
          <summary className="dbg-summary">
            pre — {Object.keys(prestate.pre).length}{" "}
            account(s)
          </summary>
          <pre className="dbg-pre">
            {JSON.stringify(prestate.pre, null, 2)}
          </pre>
        </details>
        <details className="dbg-details">
          <summary className="dbg-summary">
            post — {Object.keys(prestate.post).length}{" "}
            account(s)
          </summary>
          <pre className="dbg-pre">
            {JSON.stringify(prestate.post, null, 2)}
          </pre>
        </details>
      </div>
    )
  }
  return (
    <div>
      <p className="dbg-section-lead">
        Map mode — every account touched during the call.{" "}
        {Object.keys(prestate).length} account(s).
      </p>
      <pre className="dbg-pre">
        {JSON.stringify(prestate, null, 2)}
      </pre>
    </div>
  )
}

function render_fourbyte(fourbyte: FourByteTrace) {
  const entries = Object.entries(fourbyte).sort(
    ([, a], [, b]) => b - a,
  )
  if (entries.length === 0) {
    return (
      <p className="dbg-section-lead">
        No function calls observed — the call may have been
        a plain ETH transfer or hit a contract without
        dispatch.
      </p>
    )
  }
  return (
    <table className="dbg-table">
      <thead>
        <tr>
          <th>selector</th>
          <th>count</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(([key, count]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const STRUCT_LOG_LIMIT = 100

function render_struct(struct: StructLogResult) {
  const total = struct.structLogs.length
  const shown = struct.structLogs.slice(0, STRUCT_LOG_LIMIT)
  return (
    <div>
      <Row label="gas used" value={struct.gas.toString()} />
      <Row
        label="failed"
        value={struct.failed ? "true" : "false"}
      />
      <Row
        label="return value"
        value={struct.returnValue}
      />
      <Row label="total ops" value={total.toString()} />
      <p className="dbg-section-lead">
        First {Math.min(STRUCT_LOG_LIMIT, total)} of {total}{" "}
        opcode steps:
      </p>
      <table className="dbg-table">
        <thead>
          <tr>
            <th>#</th>
            <th>depth</th>
            <th>pc</th>
            <th>op</th>
            <th>gas</th>
            <th>cost</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((step, i) => (
            <tr key={`${i}-${step.pc}`}>
              <td>{i}</td>
              <td>{step.depth}</td>
              <td>{step.pc}</td>
              <td>{step.op}</td>
              <td>{step.gas}</td>
              <td>{step.gasCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
    <section className="dbg-section">
      <h4 className="dbg-section-heading">
        <span>{heading}</span>
        <span className="dbg-section-tag">{tag}</span>
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
    <label className="dbg-field">
      <span className="dbg-field-label">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.currentTarget.value.trim())
        }
        className="dbg-field-input"
      />
    </label>
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
    <div className="dbg-row">
      <span className="dbg-row-label">{label}</span>
      <span className="dbg-row-value">{value}</span>
    </div>
  )
}
