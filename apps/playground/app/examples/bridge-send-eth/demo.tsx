// Sepolia → OP Sepolia ETH deposit via the OP L1StandardBridge.
// Wires the user-picked EIP-1193 provider into create_bridge as
// the origin (L1) signer and posts a bridgeETHTo call to the L1
// proxy. The wallet only signs (path 2 per M3); this dapp
// broadcasts via eth_sendRawTransaction. Returns the L1 tx hash
// — the L2 credit lands ~1 minute later, surfaced via the
// explorer link.

import "./demo.css"
import {
  address as address_codec,
  bytes as bytes_codec,
  encode_function_call,
  function_selector,
  uint32 as uint32_codec,
} from "@ethernauta/abi"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import { eip155_11155420 } from "@ethernauta/chain/eip155-11155420"
import {
  AddressSchema,
  type Bytes,
  BytesSchema,
  type Hash32,
  Uint32Schema,
  UintSchema,
} from "@ethernauta/core"
import {
  eth_sendRawTransaction,
  eth_signTransaction,
} from "@ethernauta/eth"
import { require_deploy_addresses } from "@ethernauta/op"
import { useProvider } from "@ethernauta/react"
import {
  create_bridge,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { bytes_to_hex, hex_to_bigint } from "@ethernauta/utils"
import { useMemo, useState } from "react"
import { parse, safeParse } from "valibot"

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

const DEFAULT_RECIPIENT =
  "0x000000000000000000000000000000000000dEaD"
const DEFAULT_AMOUNT_HEX = "0x38d7ea4c68000" // 0.001 ETH (10^15)
const DEFAULT_MIN_GAS_HEX = "0x30d40" // 200_000

const PARAM_CODECS = [
  address_codec(),
  uint32_codec(),
  bytes_codec(),
] as const
const BRIDGE_ETH_TO_SELECTOR = function_selector(
  "bridgeETHTo",
  PARAM_CODECS,
)
const EMPTY_BYTES = parse(BytesSchema, "0x")
const L1_BRIDGE_PROXY = require_deploy_addresses(OP_SEPOLIA)
  .contracts.L1StandardBridgeProxy

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
        className="send-calls-row-value is-mono bridge-send-eth-link"
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

function format_uint(hex: string): string {
  try {
    return hex_to_bigint(
      parse(UintSchema, hex),
    ).toLocaleString("en-US")
  } catch {
    return "(invalid)"
  }
}

export function BridgeSendEthDemo() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [recipient, set_recipient] = useState(
    DEFAULT_RECIPIENT,
  )
  const [amount, set_amount] = useState(DEFAULT_AMOUNT_HEX)
  const [min_gas, set_min_gas] = useState(DEFAULT_MIN_GAS_HEX)
  const [signed_bytes, set_signed_bytes] = useState<
    Bytes | null
  >(null)
  const [tx_hash, set_tx_hash] = useState<Hash32 | null>(null)
  const [error, set_error] = useState<string | null>(null)
  const [phase, set_phase] = useState<
    "idle" | "signing" | "broadcasting"
  >("idle")

  const preview = useMemo(() => {
    const recipient_result = safeParse(
      AddressSchema,
      recipient,
    )
    const amount_result = safeParse(UintSchema, amount)
    const min_gas_result = safeParse(Uint32Schema, min_gas)
    if (
      !recipient_result.success ||
      !amount_result.success ||
      !min_gas_result.success
    ) {
      return null
    }
    const calldata = bytes_to_hex(
      encode_function_call({
        name: "bridgeETHTo",
        args: PARAM_CODECS,
        values: [
          recipient_result.output,
          min_gas_result.output,
          EMPTY_BYTES,
        ],
      }),
    )
    return {
      calldata,
      amount_label: format_wei(amount),
      min_gas_label: format_uint(min_gas),
    }
  }, [recipient, amount, min_gas])

  if (!owner) return <SignInHint />

  async function run() {
    if (!provider) return
    set_error(null)
    set_signed_bytes(null)
    set_tx_hash(null)
    try {
      const resolved = bridge({
        origin: SEPOLIA,
        destination: OP_SEPOLIA,
        signer: ({ chain_id }) => {
          const [signer] = provider.signer({ chain_id })
          return signer
        },
      })
      const origin_signer = resolved.origin.signer
      if (!origin_signer)
        throw new Error(
          "bridge did not wire an origin signer",
        )
      const parsed_recipient = parse(AddressSchema, recipient)
      const parsed_amount = parse(UintSchema, amount)
      const parsed_min_gas = parse(Uint32Schema, min_gas)
      const calldata = encode_function_call({
        name: "bridgeETHTo",
        args: PARAM_CODECS,
        values: [
          parsed_recipient,
          parsed_min_gas,
          EMPTY_BYTES,
        ],
      })
      set_phase("signing")
      const signed = await eth_signTransaction([
        {
          to: L1_BRIDGE_PROXY,
          value: parsed_amount,
          input: parse(BytesSchema, bytes_to_hex(calldata)),
          _ethernauta: {
            function: {
              signature: "bridgeETHTo(address,uint32,bytes)",
              names: ["_to", "_minGasLimit", "_extraData"],
            },
          },
        },
      ])([origin_signer, { chain_id: SEPOLIA }])
      set_signed_bytes(signed)
      set_phase("broadcasting")
      const hash = await eth_sendRawTransaction([signed])([
        resolved.origin.reader,
        { chain_id: SEPOLIA },
      ])
      set_tx_hash(hash)
    } catch (e) {
      set_error(format_error(e))
    } finally {
      set_phase("idle")
    }
  }

  const in_flight = phase !== "idle"
  const button_label =
    phase === "signing"
      ? "Waiting for wallet signature…"
      : phase === "broadcasting"
        ? "Broadcasting on Sepolia…"
        : "send_eth on Sepolia"

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
        value="bridgeETHTo(address,uint32,bytes)"
        mono
      />
      <Row
        label="Function selector"
        value={BRIDGE_ETH_TO_SELECTOR}
        mono
      />
      <div className="bridge-send-eth-form">
        <label className="bridge-send-eth-label">
          to (L2 recipient)
          <input
            className="bridge-send-eth-input"
            value={recipient}
            onChange={(e) =>
              set_recipient(e.currentTarget.value)
            }
          />
        </label>
        <label className="bridge-send-eth-label">
          amount (hex wei)
          <input
            className="bridge-send-eth-input"
            value={amount}
            onChange={(e) =>
              set_amount(e.currentTarget.value)
            }
          />
        </label>
        <label className="bridge-send-eth-label">
          min_gas_limit (hex)
          <input
            className="bridge-send-eth-input"
            value={min_gas}
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
        <div className="bridge-send-eth-error">
          One of the inputs above is invalid — fix it to
          preview the calldata.
        </div>
      )}
      <Button onClick={run} disabled={in_flight || !provider}>
        {button_label}
      </Button>
      {signed_bytes && (
        <Row
          label="signed bytes (from wallet)"
          value={signed_bytes}
          mono
        />
      )}
      {tx_hash && (
        <>
          <Row label="L1 tx hash" value={tx_hash} mono />
          <LinkRow
            label="L1 explorer"
            href={`https://sepolia.etherscan.io/tx/${tx_hash}`}
          />
          <LinkRow
            label="L2 recipient on OP Sepolia"
            href={`https://sepolia-optimism.etherscan.io/address/${recipient}`}
          />
        </>
      )}
      {error && (
        <div className="bridge-send-eth-error">{error}</div>
      )}
    </div>
  )
}
