import "./demo.css"
import {
  bytes,
  decode_function_result,
} from "@ethernauta/abi"
import { eip155_1 } from "@ethernauta/chain/eip155-1"
import {
  type Address,
  type Bytes,
  BytesSchema,
} from "@ethernauta/core"
import {
  build_callback_calldata,
  eth_call_ccip,
  fetch_ccip,
  type OffchainLookupError,
  parse_offchain_lookup_revert,
  substitute_url,
} from "@ethernauta/eip/3668"
import {
  dns_encode,
  resolve as ensip10_resolve,
  find_resolver,
} from "@ethernauta/ens"
import {
  addr,
  namehash,
  normalize,
} from "@ethernauta/erc/137"
import {
  CallSchema,
  create_reader,
  encode_chain_id,
  http,
  RpcRequestError,
} from "@ethernauta/transport"
import { useState } from "react"
import { parse } from "valibot"
import { Button } from "../../components/button"

const MAINNET_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_1.chainId,
})

const reader = create_reader([
  {
    chainId: MAINNET_CHAIN_ID,
    transports: [
      http("https://eth-mainnet.public.blastapi.io"),
    ],
  },
])

const ctx = reader({ chain_id: MAINNET_CHAIN_ID })
const [dispatcher] = ctx

type SetupData = {
  resolver: Address
  found_at: string
  dns_name: Bytes
  inner_addr_calldata: Bytes
  outer_resolve_calldata: Bytes
}

export function CcipRead3668Demo() {
  const [basename, set_basename] = useState(
    "jesse.base.eth",
  )
  const [setup, set_setup] = useState<SetupData | null>(
    null,
  )
  const [revert_data, set_revert_data] = useState<
    string | null
  >(null)
  const [lookup, set_lookup] =
    useState<OffchainLookupError | null>(null)
  const [substituted_url, set_substituted_url] = useState<
    string | null
  >(null)
  const [gateway_response, set_gateway_response] =
    useState<Bytes | null>(null)
  const [callback_calldata, set_callback_calldata] =
    useState<Bytes | null>(null)
  const [final_result, set_final_result] =
    useState<Bytes | null>(null)
  const [resolved_address, set_resolved_address] =
    useState<Address | null>(null)
  const [shortcut_result, set_shortcut_result] =
    useState<Address | null>(null)
  const [busy, set_busy] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  function reset_loop_state() {
    set_setup(null)
    set_revert_data(null)
    set_lookup(null)
    set_substituted_url(null)
    set_gateway_response(null)
    set_callback_calldata(null)
    set_final_result(null)
    set_resolved_address(null)
    set_shortcut_result(null)
    set_error(null)
  }

  async function do_setup() {
    set_busy(true)
    reset_loop_state()
    try {
      const name = normalize(basename)
      const found = await find_resolver(
        name,
        undefined,
        ctx,
      )
      if (found === null) {
        set_error(
          `No resolver registered for "${name}" or any of its parent labels.`,
        )
        return
      }
      const node = namehash(name)
      const addr_call = addr({ node })({
        chain_id: MAINNET_CHAIN_ID,
        to: found.resolver,
      })
      const dns = dns_encode(name)
      const resolve_call = ensip10_resolve({
        name: dns,
        data: addr_call.data,
      })({
        chain_id: MAINNET_CHAIN_ID,
        to: found.resolver,
      })
      set_setup({
        resolver: found.resolver,
        found_at: found.found_at,
        dns_name: dns,
        inner_addr_calldata: addr_call.data,
        outer_resolve_calldata: resolve_call.data,
      })
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    } finally {
      set_busy(false)
    }
  }

  async function run_initial_call() {
    if (!setup) return
    set_busy(true)
    set_error(null)
    set_revert_data(null)
    try {
      const call = parse(CallSchema, [
        "eth_call",
        [
          {
            to: setup.resolver,
            input: setup.outer_resolve_calldata,
          },
          "latest",
        ],
      ])
      const response = await dispatcher(call)
      if (!("error" in response)) {
        set_error(
          "Expected a revert but got a successful response — this contract did not trigger OffchainLookup.",
        )
        return
      }
      if (typeof response.error.data !== "string") {
        throw new RpcRequestError(response.error)
      }
      set_revert_data(response.error.data)
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    } finally {
      set_busy(false)
    }
  }

  function do_parse_revert() {
    if (!revert_data) return
    set_error(null)
    try {
      const decoded = parse_offchain_lookup_revert(
        parse(BytesSchema, revert_data),
      )
      if (decoded === null) {
        set_error(
          "Revert payload is not an OffchainLookup error — the first 4 bytes did not match the spec selector.",
        )
        return
      }
      set_lookup(decoded)
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    }
  }

  async function do_fetch() {
    if (!lookup) return
    set_busy(true)
    set_error(null)
    set_substituted_url(null)
    set_gateway_response(null)
    try {
      const first_url = lookup.urls[0]
      if (first_url !== undefined) {
        set_substituted_url(
          substitute_url(
            first_url,
            lookup.sender,
            lookup.callData,
          ),
        )
      }
      const response = await fetch_ccip({
        urls: lookup.urls,
        sender: lookup.sender,
        call_data: lookup.callData,
      })
      set_gateway_response(response)
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    } finally {
      set_busy(false)
    }
  }

  async function run_callback() {
    if (!setup || !lookup || !gateway_response) return
    set_busy(true)
    set_error(null)
    set_callback_calldata(null)
    set_final_result(null)
    set_resolved_address(null)
    try {
      const callback = build_callback_calldata(
        lookup.callbackFunction,
        gateway_response,
        lookup.extraData,
      )
      set_callback_calldata(callback)
      const call = parse(CallSchema, [
        "eth_call",
        [{ to: lookup.sender, input: callback }, "latest"],
      ])
      const response = await dispatcher(call)
      if ("error" in response) {
        throw new RpcRequestError(response.error)
      }
      const result_bytes = parse(
        BytesSchema,
        response.result,
      )
      set_final_result(result_bytes)
      const [inner] = decode_function_result(
        [bytes()] as const,
        result_bytes,
      )
      const inner_bytes = parse(BytesSchema, inner)
      const addr_call = addr({
        node: namehash(basename),
      })({
        chain_id: MAINNET_CHAIN_ID,
        to: setup.resolver,
      })
      const decoded = addr_call.decode(inner_bytes)
      set_resolved_address(decoded)
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    } finally {
      set_busy(false)
    }
  }

  async function run_shortcut() {
    if (!setup) return
    set_busy(true)
    set_error(null)
    set_shortcut_result(null)
    try {
      const outer = await eth_call_ccip({
        to: setup.resolver,
        input: setup.outer_resolve_calldata,
      })(ctx)
      const [inner] = decode_function_result(
        [bytes()] as const,
        outer,
      )
      const inner_bytes = parse(BytesSchema, inner)
      const addr_call = addr({
        node: namehash(basename),
      })({
        chain_id: MAINNET_CHAIN_ID,
        to: setup.resolver,
      })
      set_shortcut_result(addr_call.decode(inner_bytes))
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
    } finally {
      set_busy(false)
    }
  }

  return (
    <div className="ccip-root">
      <section className="ccip-steps">
        <h4 className="ccip-section-heading">
          <span>How to run this demo</span>
        </h4>
        <p className="ccip-steps-sub">What you'll see</p>
        <ul className="ccip-steps-list">
          <li>
            EIP-3668 defines an off-chain data resolution
            protocol. A contract reverts with{" "}
            <code>
              OffchainLookup(sender, urls, callData,
              callbackFunction, extraData)
            </code>
            , the client fetches the payload from one of the
            gateway URLs (substituting{" "}
            <code>{"{sender}"}</code> and{" "}
            <code>{"{data}"}</code>), then re-calls the
            contract with the gateway response folded in.
          </li>
          <li>
            The walkthrough below runs each primitive
            independently against a real basename resolver
            on mainnet. The final panel runs the whole loop
            in one call via <code>eth_call_ccip</code> so
            you can compare.
          </li>
        </ul>
        <p className="ccip-steps-sub">Steps</p>
        <ol className="ccip-steps-list">
          <li>
            Type a basename (the default{" "}
            <code>jesse.base.eth</code> works) and click{" "}
            <strong>Set up</strong>. You should see the
            resolver address (lives at <code>base.eth</code>
            ), the DNS-encoded name, the inner{" "}
            <code>addr(node)</code> calldata, and the outer{" "}
            <code>resolve(dnsName, addrCalldata)</code>{" "}
            calldata that ENSIP-10 wildcard resolvers
            expect.
          </li>
          <li>
            Click <strong>Run initial eth_call</strong>. The
            resolver reverts with the{" "}
            <code>OffchainLookup</code> custom error. You'll
            see the raw revert payload (hex starting with
            selector <code>0x556f1830</code>).
          </li>
          <li>
            Click <strong>Parse OffchainLookup</strong>. The{" "}
            <code>parse_offchain_lookup_revert</code>{" "}
            primitive decodes the ABI-encoded revert into{" "}
            <code>sender</code>, <code>urls</code>,{" "}
            <code>callData</code>,{" "}
            <code>callbackFunction</code>, and{" "}
            <code>extraData</code>.
          </li>
          <li>
            Click <strong>Substitute + fetch</strong>.{" "}
            <code>substitute_url</code> fills{" "}
            <code>{"{sender}"}</code> /{" "}
            <code>{"{data}"}</code> templates in the first
            URL (shown for reference).{" "}
            <code>fetch_ccip</code> iterates the URL list —
            GET when <code>{"{data}"}</code> is in the
            template, POST otherwise; 4xx aborts the whole
            call; 5xx skips to the next URL.
          </li>
          <li>
            Click{" "}
            <strong>Build callback + final call</strong>.{" "}
            <code>build_callback_calldata</code> prepends
            the <code>callbackFunction</code> selector to{" "}
            <code>
              abi.encode(gatewayResponse, extraData)
            </code>
            . The demo runs that final <code>eth_call</code>{" "}
            and ABI-decodes the result back into the
            resolved address.
          </li>
          <li>
            For comparison, click{" "}
            <strong>Shortcut: eth_call_ccip</strong>. The
            wrapper runs the full loop (with recursion up to{" "}
            <code>max_redirects=4</code>) and hands back the
            same final bytes the manual walk produced.
          </li>
        </ol>
      </section>

      <Section
        heading="0. Setup"
        tag="Ethereum mainnet · @ethernauta/ens internals"
      >
        <p className="ccip-section-lead">
          Derive the resolver address and the ENSIP-10
          calldata for{" "}
          <code>{basename || "<basename>"}</code>. For
          wildcard basenames the resolver lives at a parent
          label, so we walk the registry until we find one.
        </p>
        <Field
          label="Basename"
          value={basename}
          onChange={set_basename}
        />
        <div className="ccip-actions">
          <Button
            onClick={do_setup}
            disabled={busy || basename.length === 0}
          >
            Set up
          </Button>
        </div>
        {setup && (
          <div>
            <Row label="Resolver" value={setup.resolver} />
            <Row
              label="Resolver found at"
              value={setup.found_at}
            />
            <Row
              label="DNS-encoded name"
              value={shorten(setup.dns_name, 30, 12)}
            />
            <Row
              label="Inner addr(node) calldata"
              value={shorten(
                setup.inner_addr_calldata,
                30,
                12,
              )}
            />
            <Row
              label="Outer resolve() calldata"
              value={shorten(
                setup.outer_resolve_calldata,
                30,
                12,
              )}
            />
          </div>
        )}
      </Section>

      <Section
        heading="1. Initial eth_call — expect revert"
        tag="No CCIP-Read involved yet"
      >
        <p className="ccip-section-lead">
          A plain <code>eth_call</code> against the
          resolver. Wildcard CCIP resolvers always revert
          with <code>OffchainLookup</code> on{" "}
          <code>resolve(name, data)</code>.
        </p>
        <div className="ccip-actions">
          <Button
            onClick={run_initial_call}
            disabled={busy || !setup}
          >
            Run initial eth_call
          </Button>
        </div>
        {revert_data && (
          <div>
            <p className="ccip-section-lead">
              Revert payload (the first 4 bytes are the{" "}
              <code>OffchainLookup</code> selector{" "}
              <code>0x556f1830</code>):
            </p>
            <div className="ccip-hex">
              {wrap(revert_data, 64)}
            </div>
          </div>
        )}
      </Section>

      <Section
        heading="2. Parse the OffchainLookup revert"
        tag="parse_offchain_lookup_revert"
      >
        <p className="ccip-section-lead">
          ABI-decode the revert into its named fields. No
          network call — pure decode.
        </p>
        <div className="ccip-actions">
          <Button
            onClick={do_parse_revert}
            disabled={busy || !revert_data}
          >
            Parse OffchainLookup
          </Button>
        </div>
        {lookup && (
          <div>
            <Row label="sender" value={lookup.sender} />
            <Row
              label="callbackFunction"
              value={lookup.callbackFunction}
            />
            <Row
              label="callData"
              value={shorten(lookup.callData, 30, 12)}
            />
            <Row
              label="extraData"
              value={shorten(lookup.extraData, 30, 12)}
            />
            <details className="ccip-details">
              <summary className="ccip-summary">
                URLs ({lookup.urls.length})
              </summary>
              <pre className="ccip-pre">
                {lookup.urls.join("\n")}
              </pre>
            </details>
          </div>
        )}
      </Section>

      <Section
        heading="3. Substitute URL + fetch from gateway"
        tag="substitute_url + fetch_ccip"
      >
        <p className="ccip-section-lead">
          <code>substitute_url</code> fills the{" "}
          <code>{"{sender}"}</code> and{" "}
          <code>{"{data}"}</code> placeholders (sender
          lowercased per spec). <code>fetch_ccip</code>{" "}
          tries each URL in order; 4xx aborts the whole
          call, 5xx falls through to the next URL.
        </p>
        <div className="ccip-actions">
          <Button
            onClick={do_fetch}
            disabled={busy || !lookup}
          >
            Substitute + fetch
          </Button>
        </div>
        {substituted_url && (
          <div>
            <p className="ccip-section-lead">
              Substituted URL (first in the list):
            </p>
            <div className="ccip-hex">
              {wrap(substituted_url, 80)}
            </div>
          </div>
        )}
        {gateway_response && (
          <div>
            <p className="ccip-section-lead">
              Gateway response (raw bytes — the gateway
              signs the off-chain data and the resolver's
              callback verifies the signature on chain):
            </p>
            <div className="ccip-hex">
              {wrap(gateway_response, 64)}
            </div>
          </div>
        )}
      </Section>

      <Section
        heading="4. Build callback + run final eth_call"
        tag="build_callback_calldata + decode"
      >
        <p className="ccip-section-lead">
          <code>build_callback_calldata</code> prepends the
          callback selector to{" "}
          <code>abi.encode(response, extraData)</code>. The
          final <code>eth_call</code> goes back to the same
          resolver — which now has enough information to
          return the answer without reverting.
        </p>
        <div className="ccip-actions">
          <Button
            onClick={run_callback}
            disabled={busy || !gateway_response}
          >
            Build callback + final eth_call
          </Button>
        </div>
        {callback_calldata && (
          <div>
            <p className="ccip-section-lead">
              Callback calldata:
            </p>
            <div className="ccip-hex">
              {wrap(callback_calldata, 64)}
            </div>
          </div>
        )}
        {final_result && (
          <div>
            <p className="ccip-section-lead">
              Final eth_call result (the outer{" "}
              <code>resolve()</code> wraps the inner{" "}
              <code>addr(node)</code> output):
            </p>
            <div className="ccip-hex">
              {wrap(final_result, 64)}
            </div>
          </div>
        )}
        {resolved_address && (
          <Row
            label="Resolved address"
            value={resolved_address}
          />
        )}
      </Section>

      <Section
        heading="5. Shortcut — eth_call_ccip"
        tag="The full loop in one call"
      >
        <p className="ccip-section-lead">
          The wrapper handles every step above plus
          recursive OffchainLookup follow-ups (default{" "}
          <code>max_redirects=4</code>). Same result, no
          stepper.
        </p>
        <div className="ccip-actions">
          <Button
            onClick={run_shortcut}
            disabled={busy || !setup}
          >
            Shortcut: eth_call_ccip
          </Button>
        </div>
        {shortcut_result && (
          <Row
            label="Resolved address"
            value={shortcut_result}
          />
        )}
      </Section>

      {error && <p className="ccip-error">{error}</p>}
    </div>
  )
}

function shorten(
  hex: string,
  head: number,
  tail: number,
): string {
  if (hex.length <= head + tail + 1) return hex
  return `${hex.slice(0, head)}…${hex.slice(-tail)}`
}

function wrap(hex: string, width: number): string {
  const segments: string[] = []
  for (let i = 0; i < hex.length; i += width) {
    segments.push(hex.slice(i, i + width))
  }
  return segments.join("\n")
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
    <section className="ccip-section">
      <h4 className="ccip-section-heading">
        <span>{heading}</span>
        <span className="ccip-section-tag">{tag}</span>
      </h4>
      {children}
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (next: string) => void
}) {
  return (
    <label className="ccip-field">
      <span className="ccip-field-label">{label}</span>
      <input
        value={value}
        onChange={(e) =>
          onChange(e.currentTarget.value.trim())
        }
        className="ccip-field-input"
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
    <div className="ccip-row">
      <span className="ccip-row-label">{label}</span>
      <span className="ccip-row-value">{value}</span>
    </div>
  )
}
