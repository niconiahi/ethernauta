// Sepolia → OP Sepolia ERC-20 deposit via the OP
// L1StandardBridge. Calls the `send_erc20` verb through the
// OP-wrapped `create_bridge` factory:
//   send_erc20({...})(bridge({ l1, l2, signer }))
//
// The user must approve the L1 bridge proxy for `amount` of
// `l1_token` first (the bridge moves the token via ERC-20
// `transferFrom`). msg.value = 0.

import "./demo.css"
import {
  address as address_codec,
  bytes as bytes_codec,
  encode_function_call,
  function_selector,
  uint32 as uint32_codec,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import { eip155_11155420 } from "@ethernauta/chain/eip155-11155420"
import {
  AddressSchema,
  BytesSchema,
  type Hash32,
  Uint32Schema,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import {
  create_bridge,
  require_deploy_addresses,
  send_erc20,
} from "@ethernauta/op"
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
const OP_SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155420.chainId,
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
    chainId: OP_SEPOLIA_CHAIN_ID,
    transports: [
      http("https://sepolia.optimism.io"),
      http(
        "https://optimism-sepolia.gateway.tenderly.co",
      ),
    ],
  },
])

const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000"
const DEFAULT_RECIPIENT =
  "0x000000000000000000000000000000000000dEaD"
const DEFAULT_AMOUNT_HEX = "0x0"
const DEFAULT_MIN_GAS_HEX = "0x30d40" // 200_000

const PARAM_CODECS = [
  address_codec(),
  address_codec(),
  address_codec(),
  uint256_codec(),
  uint32_codec(),
  bytes_codec(),
] as const
const BRIDGE_ERC20_TO_SELECTOR = function_selector(
  "bridgeERC20To",
  PARAM_CODECS,
)
const EMPTY_BYTES = parse(BytesSchema, "0x")
const L1_BRIDGE_PROXY = require_deploy_addresses(
  OP_SEPOLIA_CHAIN_ID,
).contracts.L1StandardBridgeProxy

function format_uint(hex: string): string {
  try {
    return hex_to_bigint(
      parse(UintSchema, hex),
    ).toLocaleString("en-US")
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
        className="send-calls-row-value is-mono bridge-send-erc20-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {href}
      </a>
    </div>
  )
}

export function BridgeSendErc20Demo() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [_l1_token, set_l1_token] = useState(ZERO_ADDRESS)
  const [_l2_token, set_l2_token] = useState(ZERO_ADDRESS)
  const [_recipient, set_recipient] = useState(
    DEFAULT_RECIPIENT,
  )
  const [_amount, set_amount] = useState(DEFAULT_AMOUNT_HEX)
  const [_min_gas, set_min_gas] = useState(
    DEFAULT_MIN_GAS_HEX,
  )
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
    const l2_token_result = safeParse(
      AddressSchema,
      _l2_token,
    )
    const recipient_result = safeParse(
      AddressSchema,
      _recipient,
    )
    const amount_result = safeParse(Uint256Schema, _amount)
    const min_gas_result = safeParse(Uint32Schema, _min_gas)
    if (
      !l1_token_result.success ||
      !l2_token_result.success ||
      !recipient_result.success ||
      !amount_result.success ||
      !min_gas_result.success
    ) {
      return null
    }
    const calldata = bytes_to_hex(
      encode_function_call({
        name: "bridgeERC20To",
        args: PARAM_CODECS,
        values: [
          l1_token_result.output,
          l2_token_result.output,
          recipient_result.output,
          amount_result.output,
          min_gas_result.output,
          EMPTY_BYTES,
        ],
      }),
    )
    return {
      calldata,
      amount_label: format_uint(_amount),
      min_gas_label: format_uint(_min_gas),
    }
  }, [_l1_token, _l2_token, _recipient, _amount, _min_gas])

  if (!owner) return <SignInHint />

  async function run() {
    if (!provider) return
    set_error(null)
    set_tx_hash(null)
    set_in_flight(true)
    try {
      const l1_token = parse(AddressSchema, _l1_token)
      const l2_token = parse(AddressSchema, _l2_token)
      const recipient = parse(AddressSchema, _recipient)
      const amount = parse(Uint256Schema, _amount)
      const min_gas = parse(Uint32Schema, _min_gas)
      const hash = await send_erc20({
        l1_token,
        l2_token,
        to: recipient,
        amount,
        min_gas_limit: min_gas,
      })(
        bridge({
          l1: SEPOLIA_CHAIN_ID,
          l2: OP_SEPOLIA_CHAIN_ID,
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
    : "Bridge ERC-20 to OP Sepolia"

  return (
    <div>
      <Row label="Origin" value="Ethereum Sepolia" />
      <Row label="Destination" value="OP Sepolia" />
      <Row label="Account" value={owner} mono />
      <Row
        label="L1 bridge proxy"
        value={L1_BRIDGE_PROXY}
        mono
      />
      <Row
        label="Bridge function"
        value="bridgeERC20To(address,address,address,uint256,uint32,bytes)"
        mono
      />
      <Row
        label="Function selector"
        value={BRIDGE_ERC20_TO_SELECTOR}
        mono
      />
      <div className="bridge-send-erc20-note">
        The L1 bridge moves the token via ERC-20{" "}
        <code>transferFrom</code>, so you must{" "}
        <code>approve(L1StandardBridgeProxy, amount)</code>{" "}
        on the L1 token contract before calling. Fill the
        form with a real Sepolia ERC-20 you control and its
        OP Sepolia twin.
      </div>
      <div className="bridge-send-erc20-form">
        <label className="bridge-send-erc20-label">
          l1_token (Sepolia ERC-20)
          <input
            className="bridge-send-erc20-input"
            value={_l1_token}
            onChange={(e) =>
              set_l1_token(e.currentTarget.value)
            }
          />
        </label>
        <label className="bridge-send-erc20-label">
          l2_token (OP Sepolia twin)
          <input
            className="bridge-send-erc20-input"
            value={_l2_token}
            onChange={(e) =>
              set_l2_token(e.currentTarget.value)
            }
          />
        </label>
        <label className="bridge-send-erc20-label">
          to (L2 recipient)
          <input
            className="bridge-send-erc20-input"
            value={_recipient}
            onChange={(e) =>
              set_recipient(e.currentTarget.value)
            }
          />
        </label>
        <label className="bridge-send-erc20-label">
          amount (hex, token base units)
          <input
            className="bridge-send-erc20-input"
            value={_amount}
            onChange={(e) =>
              set_amount(e.currentTarget.value)
            }
          />
        </label>
        <label className="bridge-send-erc20-label">
          min_gas_limit (hex)
          <input
            className="bridge-send-erc20-input"
            value={_min_gas}
            onChange={(e) =>
              set_min_gas(e.currentTarget.value)
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
            label="min_gas_limit (decoded)"
            value={preview.min_gas_label}
          />
          <Row
            label="calldata that will be signed"
            value={preview.calldata}
            mono
          />
        </>
      ) : (
        <div className="bridge-send-erc20-error">
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
            label="L2 recipient on OP Sepolia"
            href={`https://sepolia-optimism.etherscan.io/address/${_recipient}`}
          />
        </>
      )}
      {error && (
        <div className="bridge-send-erc20-error">
          {error}
        </div>
      )}
    </div>
  )
}
