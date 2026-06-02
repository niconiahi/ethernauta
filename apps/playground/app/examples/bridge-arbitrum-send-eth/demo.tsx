// Sepolia → Arbitrum Sepolia ETH deposit via the Arbitrum
// `Inbox.depositEth()` entrypoint. Calls the `send_eth` verb
// through the Arbitrum-wrapped `create_bridge` factory:
//   send_eth({...})(bridge({ l1, l2, signer }))
//
// The wallet only signs (path 2 per M3); the verb encodes
// `depositEth()` calldata, asks the wallet to sign, and
// broadcasts `eth_sendRawTransaction` on L1. The L2 credit
// lands on the caller's L2-aliased address (no `to`
// parameter — `Inbox.depositEth` always credits
// `aliasL1Address(msg.sender)`; arbitrary-recipient deposits
// land in slice 3b under `send_message`, which composes
// `Inbox.createRetryableTicket`).

import "./demo.css"
import {
  encode_function_call,
  function_selector,
} from "@ethernauta/abi"
import {
  create_bridge,
  require_deploy_addresses,
  send_eth,
} from "@ethernauta/arbitrum"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import { eip155_421614 } from "@ethernauta/chain/eip155-421614"
import {
  type Hash32,
  UintSchema,
} from "@ethernauta/core"
import { useProvider } from "@ethernauta/react"
import { encode_chain_id, http } from "@ethernauta/transport"
import {
  bytes_to_hex,
  hex_to_bigint,
} from "@ethernauta/utils"
import { useMemo, useState } from "react"
import { parse, safeParse } from "valibot"

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

const DEFAULT_AMOUNT_HEX = "0x38d7ea4c68000" // 0.001 ETH (10^15)

const DEPOSIT_ETH_SELECTOR = function_selector(
  "depositEth",
  [],
)
const L1_INBOX_PROXY = require_deploy_addresses(
  ARB_SEPOLIA_CHAIN_ID,
).contracts?.inbox

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
        className="send-calls-row-value is-mono bridge-arbitrum-send-eth-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {href}
      </a>
    </div>
  )
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

export function BridgeArbitrumSendEthDemo() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [_amount, set_amount] = useState(DEFAULT_AMOUNT_HEX)
  const [tx_hash, set_tx_hash] = useState<Hash32 | null>(
    null,
  )
  const [error, set_error] = useState<string | null>(null)
  const [in_flight, set_in_flight] = useState(false)

  const preview = useMemo(() => {
    const amount_result = safeParse(UintSchema, _amount)
    if (!amount_result.success) return null
    const calldata = bytes_to_hex(
      encode_function_call({
        name: "depositEth",
        args: [] as const,
        values: [] as const,
      }),
    )
    return {
      calldata,
      amount_label: format_wei(_amount),
    }
  }, [_amount])

  if (!owner) return <SignInHint />

  async function run() {
    if (!provider) return
    set_error(null)
    set_tx_hash(null)
    set_in_flight(true)
    try {
      const amount = parse(UintSchema, _amount)
      const hash = await send_eth({ amount })(
        bridge({
          l1: SEPOLIA_CHAIN_ID,
          l2: ARB_SEPOLIA_CHAIN_ID,
          signer: provider.signer({
            chain_id: SEPOLIA_CHAIN_ID,
          }),
        }),
      )
      set_tx_hash(hash)
    } catch (e) {
      set_error(format_error(e))
    } finally {
      set_in_flight(false)
    }
  }

  const button_label = in_flight
    ? "Signing + broadcasting…"
    : "Bridge ETH to Arbitrum Sepolia"

  return (
    <div>
      <Row label="Origin" value="Ethereum Sepolia" />
      <Row label="Destination" value="Arbitrum Sepolia" />
      <Row label="Account" value={owner} mono />
      <Row
        label="L1 Inbox proxy"
        value={L1_INBOX_PROXY ?? "(not in registry)"}
        mono
      />
      <Row
        label="Bridge function"
        value="depositEth()"
        mono
      />
      <Row
        label="Function selector"
        value={DEPOSIT_ETH_SELECTOR}
        mono
      />
      <Row
        label="L2 recipient"
        value="aliasL1Address(msg.sender) — derived from the L1 signer"
      />
      <div className="bridge-arbitrum-send-eth-form">
        <label className="bridge-arbitrum-send-eth-label">
          amount (hex wei)
          <input
            className="bridge-arbitrum-send-eth-input"
            value={_amount}
            onChange={(e) =>
              set_amount(e.currentTarget.value)
            }
          />
        </label>
      </div>
      {preview ? (
        <>
          <Row
            label="amount (decoded)"
            value={preview.amount_label}
          />
          <Row
            label="calldata that will be signed"
            value={preview.calldata}
            mono
          />
        </>
      ) : (
        <div className="bridge-arbitrum-send-eth-error">
          amount is invalid — fix it to preview.
        </div>
      )}
      <Button
        onClick={run}
        disabled={in_flight || !provider}
      >
        {button_label}
      </Button>
      {tx_hash && (
        <>
          <Row label="L1 tx hash" value={tx_hash} mono />
          <LinkRow
            label="L1 explorer"
            href={`https://sepolia.etherscan.io/tx/${tx_hash}`}
          />
          <LinkRow
            label="L2 account (aliased) on Arb Sepolia"
            href={`https://sepolia.arbiscan.io/address/${owner}`}
          />
        </>
      )}
      {error && (
        <div className="bridge-arbitrum-send-eth-error">
          {error}
        </div>
      )}
    </div>
  )
}
