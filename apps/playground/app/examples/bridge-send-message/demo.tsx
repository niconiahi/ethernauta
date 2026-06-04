// Sepolia → OP Sepolia arbitrary message via the OP
// OptimismPortal.depositTransaction. Calls the `send_message`
// verb through the OP-wrapped `create_bridge` factory:
//   send_message({...})(bridge({ l1, l2, signer }))
//
// msg.value mirrors the `value` ABI parameter — the L1 ETH
// locked equals the L2 mint amount.

import "./demo.css"
import {
  address as address_codec,
  bool as bool_codec,
  bytes as bytes_codec,
  encode_function_call,
  function_selector,
  uint64 as uint64_codec,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import { eip155_11155420 } from "@ethernauta/chain/eip155-11155420"
import {
  AddressSchema,
  BytesSchema,
  type Hash32,
  Uint64Schema,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import {
  create_bridge,
  require_deploy_addresses,
  send_message,
} from "@ethernauta/op"
import { useProvider } from "@ethernauta/react"
import {
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import {
  bytes_to_hex,
  hex_to_bigint,
} from "@ethernauta/utils"
import { useMemo, useState } from "react"
import { boolean, parse, safeParse } from "valibot"

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
      http("https://optimism-sepolia.gateway.tenderly.co"),
    ],
  },
])

const DEFAULT_TO =
  "0x000000000000000000000000000000000000dEaD"
const DEFAULT_VALUE_HEX = "0x0"
const DEFAULT_GAS_LIMIT_HEX = "0x30d40" // 200_000
const DEFAULT_DATA_HEX = "0x"

const PARAM_CODECS = [
  address_codec(),
  uint256_codec(),
  uint64_codec(),
  bool_codec(),
  bytes_codec(),
] as const
const DEPOSIT_TRANSACTION_SELECTOR = function_selector(
  "depositTransaction",
  PARAM_CODECS,
)
const PORTAL_PROXY = require_deploy_addresses(
  OP_SEPOLIA_CHAIN_ID,
).contracts.OptimismPortalProxy

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
        className="send-calls-row-value is-mono bridge-send-message-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {href}
      </a>
    </div>
  )
}

export function BridgeSendMessageDemo() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [_to, set_to] = useState(DEFAULT_TO)
  const [_value, set_value] = useState(DEFAULT_VALUE_HEX)
  const [_gas_limit, set_gas_limit] = useState(
    DEFAULT_GAS_LIMIT_HEX,
  )
  const [is_creation, set_is_creation] = useState(false)
  const [_data, set_data] = useState(DEFAULT_DATA_HEX)
  const [tx_hash, set_tx_hash] = useState<Hash32 | null>(
    null,
  )
  const [error, set_error] = useState<string | null>(null)
  const [in_flight, set_in_flight] = useState(false)

  const preview = useMemo(() => {
    const to_result = safeParse(AddressSchema, _to)
    const value_result = safeParse(Uint256Schema, _value)
    const gas_result = safeParse(Uint64Schema, _gas_limit)
    const data_result = safeParse(BytesSchema, _data)
    const creation_result = safeParse(
      boolean(),
      is_creation,
    )
    if (
      !to_result.success ||
      !value_result.success ||
      !gas_result.success ||
      !data_result.success ||
      !creation_result.success
    ) {
      return null
    }
    const calldata = bytes_to_hex(
      encode_function_call({
        name: "depositTransaction",
        args: PARAM_CODECS,
        values: [
          to_result.output,
          value_result.output,
          gas_result.output,
          creation_result.output,
          data_result.output,
        ],
      }),
    )
    return {
      calldata,
      value_label: format_wei(_value),
      gas_label: format_uint(_gas_limit),
    }
  }, [_to, _value, _gas_limit, is_creation, _data])

  if (!owner) return <SignInHint />

  async function run() {
    if (!provider) return
    set_error(null)
    set_tx_hash(null)
    set_in_flight(true)
    try {
      const to = parse(AddressSchema, _to)
      const value = parse(Uint256Schema, _value)
      const gas_limit = parse(Uint64Schema, _gas_limit)
      const data = parse(BytesSchema, _data)
      const hash = await send_message({
        to,
        value,
        gas_limit,
        is_creation,
        data,
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
    : "Send message to OP Sepolia"

  return (
    <div>
      <Row label="Origin" value="Ethereum Sepolia" />
      <Row label="Destination" value="OP Sepolia" />
      <Row label="Account" value={owner} mono />
      <Row
        label="L1 portal proxy"
        value={PORTAL_PROXY}
        mono
      />
      <Row
        label="Portal function"
        value="depositTransaction(address,uint256,uint64,bool,bytes)"
        mono
      />
      <Row
        label="Function selector"
        value={DEPOSIT_TRANSACTION_SELECTOR}
        mono
      />
      <div className="bridge-send-message-form">
        <label className="bridge-send-message-label">
          to (L2 target)
          <input
            className="bridge-send-message-input"
            value={_to}
            onChange={(e) => set_to(e.currentTarget.value)}
          />
        </label>
        <label className="bridge-send-message-label">
          value (hex wei) — L1 ETH locked, L2 ETH minted
          <input
            className="bridge-send-message-input"
            value={_value}
            onChange={(e) =>
              set_value(e.currentTarget.value)
            }
          />
        </label>
        <label className="bridge-send-message-label">
          gas_limit (hex)
          <input
            className="bridge-send-message-input"
            value={_gas_limit}
            onChange={(e) =>
              set_gas_limit(e.currentTarget.value)
            }
          />
        </label>
        <label className="bridge-send-message-checkbox-label">
          <input
            type="checkbox"
            checked={is_creation}
            onChange={(e) =>
              set_is_creation(e.currentTarget.checked)
            }
          />
          is_creation (L2 contract deployment via CREATE)
        </label>
        <label className="bridge-send-message-label">
          data (hex)
          <textarea
            className="bridge-send-message-textarea"
            value={_data}
            onChange={(e) =>
              set_data(e.currentTarget.value)
            }
          />
        </label>
      </div>
      {preview ? (
        <>
          <Row
            label="value (decoded)"
            value={preview.value_label}
          />
          <Row
            label="gas_limit (decoded)"
            value={preview.gas_label}
          />
          <Row
            label="calldata that will be signed"
            value={preview.calldata}
            mono
          />
        </>
      ) : (
        <div className="bridge-send-message-error">
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
            label="L2 target on OP Sepolia"
            href={`https://sepolia-optimism.etherscan.io/address/${_to}`}
          />
        </>
      )}
      {error && (
        <div className="bridge-send-message-error">
          {error}
        </div>
      )}
    </div>
  )
}
