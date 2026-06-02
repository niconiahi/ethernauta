// Sepolia → Arbitrum Sepolia ERC-20 deposit through the
// Arbitrum L1GatewayRouter. Calls the `send_erc20` verb
// through the Arbitrum-wrapped `create_bridge` factory:
//   send_erc20({...})(bridge({ l1, l2, signer }))
//
// The user must approve the **gateway returned by
// `L1GatewayRouter.getGateway(l1_token)`** (not the router
// itself) for `amount` of `l1_token` before calling. The
// verb does the `getGateway` read on `l1.reader` first and
// throws if no gateway is registered. msg.value covers the
// retryable's submission fee + L2 gas — the verb computes
// it from `max_submission_cost`, `max_gas`, `gas_price_bid`.

import "./demo.css"
import {
  address as address_codec,
  bytes as bytes_codec,
  encode_function_call,
  encode_sequence,
  function_selector,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  create_bridge,
  require_deploy_addresses,
  send_erc20,
} from "@ethernauta/arbitrum"
import { eip155_421614 } from "@ethernauta/chain/eip155-421614"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import {
  AddressSchema,
  BytesSchema,
  type Hash32,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import { useProvider } from "@ethernauta/react"
import {
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import {
  bigint_to_hex,
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

const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000"
const DEFAULT_RECIPIENT =
  "0x000000000000000000000000000000000000dEaD"
const DEFAULT_AMOUNT_HEX = "0x0"
const DEFAULT_MAX_GAS_HEX = "0x186a0" // 100_000
const DEFAULT_GAS_PRICE_BID_HEX = "0x3b9aca00" // 1 gwei
const DEFAULT_SUBMISSION_COST_HEX = "0x2386f26fc10000" // 0.01 ETH

const PARAM_CODECS = [
  address_codec(),
  address_codec(),
  uint256_codec(),
  uint256_codec(),
  uint256_codec(),
  bytes_codec(),
] as const
const OUTBOUND_TRANSFER_SELECTOR = function_selector(
  "outboundTransfer",
  PARAM_CODECS,
)
const EMPTY_BYTES = parse(BytesSchema, "0x")
const L1_GATEWAY_ROUTER = require_deploy_addresses(
  ARB_SEPOLIA_CHAIN_ID,
).contracts?.l1GatewayRouter

function format_uint(hex: string): string {
  try {
    return hex_to_bigint(
      parse(UintSchema, hex),
    ).toLocaleString("en-US")
  } catch {
    return "(invalid)"
  }
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
        className="send-calls-row-value is-mono bridge-arbitrum-send-erc20-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {href}
      </a>
    </div>
  )
}

export function BridgeArbitrumSendErc20Demo() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [_l1_token, set_l1_token] = useState(ZERO_ADDRESS)
  const [_recipient, set_recipient] = useState(
    DEFAULT_RECIPIENT,
  )
  const [_amount, set_amount] = useState(DEFAULT_AMOUNT_HEX)
  const [_max_gas, set_max_gas] = useState(
    DEFAULT_MAX_GAS_HEX,
  )
  const [_gas_price_bid, set_gas_price_bid] = useState(
    DEFAULT_GAS_PRICE_BID_HEX,
  )
  const [_max_submission_cost, set_max_submission_cost] =
    useState(DEFAULT_SUBMISSION_COST_HEX)
  const [tx_hash, set_tx_hash] = useState<Hash32 | null>(
    null,
  )
  const [error, set_error] = useState<string | null>(null)
  const [in_flight, set_in_flight] = useState(false)

  const preview = useMemo(() => {
    const l1_token_result = safeParse(
      AddressSchema,
      _l1_token,
    )
    const recipient_result = safeParse(
      AddressSchema,
      _recipient,
    )
    const amount_result = safeParse(Uint256Schema, _amount)
    const max_gas_result = safeParse(
      Uint256Schema,
      _max_gas,
    )
    const gas_price_bid_result = safeParse(
      Uint256Schema,
      _gas_price_bid,
    )
    const max_submission_cost_result = safeParse(
      Uint256Schema,
      _max_submission_cost,
    )
    if (
      !l1_token_result.success ||
      !recipient_result.success ||
      !amount_result.success ||
      !max_gas_result.success ||
      !gas_price_bid_result.success ||
      !max_submission_cost_result.success
    ) {
      return null
    }
    const data = parse(
      BytesSchema,
      bytes_to_hex(
        encode_sequence(
          [uint256_codec(), bytes_codec()],
          [max_submission_cost_result.output, EMPTY_BYTES],
        ),
      ),
    )
    const calldata = bytes_to_hex(
      encode_function_call({
        name: "outboundTransfer",
        args: PARAM_CODECS,
        values: [
          l1_token_result.output,
          recipient_result.output,
          amount_result.output,
          max_gas_result.output,
          gas_price_bid_result.output,
          data,
        ],
      }),
    )
    const msg_value = parse(
      UintSchema,
      bigint_to_hex(
        hex_to_bigint(max_submission_cost_result.output) +
          hex_to_bigint(max_gas_result.output) *
            hex_to_bigint(gas_price_bid_result.output),
      ),
    )
    return {
      calldata,
      data,
      msg_value,
      amount_label: format_uint(_amount),
    }
  }, [
    _l1_token,
    _recipient,
    _amount,
    _max_gas,
    _gas_price_bid,
    _max_submission_cost,
  ])

  if (!owner) return <SignInHint />

  async function run() {
    if (!provider) return
    set_error(null)
    set_tx_hash(null)
    set_in_flight(true)
    try {
      const l1_token = parse(AddressSchema, _l1_token)
      const recipient = parse(AddressSchema, _recipient)
      const amount = parse(Uint256Schema, _amount)
      const max_gas = parse(Uint256Schema, _max_gas)
      const gas_price_bid = parse(
        Uint256Schema,
        _gas_price_bid,
      )
      const max_submission_cost = parse(
        Uint256Schema,
        _max_submission_cost,
      )
      const hash = await send_erc20({
        l1_token,
        to: recipient,
        amount,
        max_gas,
        gas_price_bid,
        max_submission_cost,
      })(
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
    : "Bridge ERC-20 to Arbitrum Sepolia"

  return (
    <div>
      <Row label="Origin" value="Ethereum Sepolia" />
      <Row label="Destination" value="Arbitrum Sepolia" />
      <Row label="Account" value={owner} mono />
      <Row
        label="L1GatewayRouter"
        value={L1_GATEWAY_ROUTER ?? "(not in registry)"}
        mono
      />
      <Row
        label="Bridge function"
        value="outboundTransfer(address,address,uint256,uint256,uint256,bytes)"
        mono
      />
      <Row
        label="Function selector"
        value={OUTBOUND_TRANSFER_SELECTOR}
        mono
      />
      <div className="bridge-arbitrum-send-erc20-note">
        The L1GatewayRouter forwards to the gateway returned
        by <code>getGateway(l1_token)</code>; that gateway
        is what pulls the token via{" "}
        <code>transferFrom</code>, so you must approve the
        **gateway address** (not the router) for{" "}
        <code>amount</code> beforehand. The verb does the{" "}
        <code>getGateway</code> read first and throws if no
        gateway is registered. msg.value covers the
        retryable submission fee + L2 gas budget — the demo
        shows the computed value below.
      </div>
      <div className="bridge-arbitrum-send-erc20-form">
        <label className="bridge-arbitrum-send-erc20-label">
          l1_token (Sepolia ERC-20)
          <input
            className="bridge-arbitrum-send-erc20-input"
            value={_l1_token}
            onChange={(e) =>
              set_l1_token(e.currentTarget.value)
            }
          />
        </label>
        <label className="bridge-arbitrum-send-erc20-label">
          to (L2 recipient)
          <input
            className="bridge-arbitrum-send-erc20-input"
            value={_recipient}
            onChange={(e) =>
              set_recipient(e.currentTarget.value)
            }
          />
        </label>
        <label className="bridge-arbitrum-send-erc20-label">
          amount (hex, token base units)
          <input
            className="bridge-arbitrum-send-erc20-input"
            value={_amount}
            onChange={(e) =>
              set_amount(e.currentTarget.value)
            }
          />
        </label>
        <label className="bridge-arbitrum-send-erc20-label">
          max_gas (hex, L2 gas limit)
          <input
            className="bridge-arbitrum-send-erc20-input"
            value={_max_gas}
            onChange={(e) =>
              set_max_gas(e.currentTarget.value)
            }
          />
        </label>
        <label className="bridge-arbitrum-send-erc20-label">
          gas_price_bid (hex, L2 wei/gas)
          <input
            className="bridge-arbitrum-send-erc20-input"
            value={_gas_price_bid}
            onChange={(e) =>
              set_gas_price_bid(e.currentTarget.value)
            }
          />
        </label>
        <label className="bridge-arbitrum-send-erc20-label">
          max_submission_cost (hex wei)
          <input
            className="bridge-arbitrum-send-erc20-input"
            value={_max_submission_cost}
            onChange={(e) =>
              set_max_submission_cost(e.currentTarget.value)
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
            label="msg.value (computed)"
            value={format_wei(preview.msg_value)}
          />
          <Row
            label="data tuple (maxSubmissionCost, extraData)"
            value={preview.data}
            mono
          />
          <Row
            label="calldata that will be signed"
            value={preview.calldata}
            mono
          />
        </>
      ) : (
        <div className="bridge-arbitrum-send-erc20-error">
          One of the inputs above is invalid — fix it to
          preview the calldata.
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
            label="L2 recipient on Arb Sepolia"
            href={`https://sepolia.arbiscan.io/address/${_recipient}`}
          />
        </>
      )}
      {error && (
        <div className="bridge-arbitrum-send-erc20-error">
          {error}
        </div>
      )}
    </div>
  )
}
