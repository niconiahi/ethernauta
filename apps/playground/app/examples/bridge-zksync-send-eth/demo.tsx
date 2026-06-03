// Sepolia → Era Sepolia ETH deposit via the zkSync
// `Bridgehub.requestL2TransactionDirect` entrypoint. Calls
// the `send_eth` verb through the zkSync-wrapped `create_bridge`
// factory:
//   send_eth({...})(bridge({ l1, l2, signer }))
//
// The wallet only signs (path 2 per M3); the verb reads the
// destination chain's L2 base cost from
// `Bridgehub.l2TransactionBaseCost`, computes
// `mintValue = amount + base_cost`, ABI-encodes the 9-field
// `L2TransactionRequestDirect` struct, asks the wallet to sign,
// and broadcasts `eth_sendRawTransaction` on L1.

import "./demo.css"
import { eip155_300 } from "@ethernauta/chain/eip155-300"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import {
  AddressSchema,
  type Hash32,
  Uint256Schema,
} from "@ethernauta/core"
import { useProvider } from "@ethernauta/react"
import {
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import {
  bigint_to_hex,
  hex_to_bigint,
} from "@ethernauta/utils"
import {
  create_bridge,
  require_deploy_addresses,
  send_eth,
} from "@ethernauta/zksync"
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

const DEFAULT_AMOUNT_HEX = "0x38d7ea4c68000" // 0.001 ETH
const DEFAULT_L2_GAS_LIMIT_HEX = bigint_to_hex(1_000_000n)
const PUBDATA_BYTE_LIMIT_HEX = "0x320"

const L1_BRIDGEHUB = require_deploy_addresses(
  ERA_SEPOLIA_CHAIN_ID,
).l1.bridgehub

function format_wei(wei_hex: string): string {
  try {
    const wei = hex_to_bigint(parse(Uint256Schema, wei_hex))
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
        className="send-calls-row-value is-mono bridge-zksync-send-eth-link"
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

const DEFAULT_RECIPIENT =
  "0x0000000000000000000000000000000000000000"

export function BridgeZksyncSendEthDemo() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [_to, set_to] = useState<string>(
    owner ?? DEFAULT_RECIPIENT,
  )
  const [_amount, set_amount] = useState(DEFAULT_AMOUNT_HEX)
  const [tx_hash, set_tx_hash] = useState<Hash32 | null>(
    null,
  )
  const [error, set_error] = useState<string | null>(null)
  const [in_flight, set_in_flight] = useState(false)

  const preview = useMemo(() => {
    const to_result = safeParse(AddressSchema, _to)
    const amount_result = safeParse(Uint256Schema, _amount)
    if (!to_result.success || !amount_result.success)
      return null
    return {
      to: to_result.output,
      amount_label: format_wei(_amount),
    }
  }, [_to, _amount])

  if (!owner) return <SignInHint />

  async function run() {
    if (!provider) return
    set_error(null)
    set_tx_hash(null)
    set_in_flight(true)
    try {
      const to = parse(AddressSchema, _to)
      const amount = parse(Uint256Schema, _amount)
      const hash = await send_eth({ to, amount })(
        bridge({
          l1: SEPOLIA_CHAIN_ID,
          l2: ERA_SEPOLIA_CHAIN_ID,
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
    ? "Reading base cost + signing + broadcasting…"
    : "Bridge ETH to Era Sepolia"

  return (
    <div>
      <Row label="Origin" value="Ethereum Sepolia" />
      <Row label="Destination" value="zkSync Era Sepolia" />
      <Row label="Account" value={owner} mono />
      <Row
        label="L1 Bridgehub proxy"
        value={L1_BRIDGEHUB}
        mono
      />
      <Row
        label="Bridge function"
        value="requestL2TransactionDirect(L2TransactionRequestDirect)"
        mono
      />
      <Row
        label="l2GasPerPubdataByteLimit (fixed)"
        value={PUBDATA_BYTE_LIMIT_HEX}
        mono
      />
      <Row
        label="l2GasLimit (default)"
        value={DEFAULT_L2_GAS_LIMIT_HEX}
        mono
      />
      <div className="bridge-zksync-send-eth-form">
        <label className="bridge-zksync-send-eth-label">
          L2 recipient (address)
          <input
            className="bridge-zksync-send-eth-input"
            value={_to}
            onChange={(e) => set_to(e.currentTarget.value)}
          />
        </label>
        <label className="bridge-zksync-send-eth-label">
          amount (hex wei)
          <input
            className="bridge-zksync-send-eth-input"
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
            label="L2 recipient (validated)"
            value={preview.to}
            mono
          />
          <Row
            label="amount (decoded)"
            value={preview.amount_label}
          />
        </>
      ) : (
        <div className="bridge-zksync-send-eth-error">
          recipient or amount is invalid — fix it to
          preview.
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
            label="L2 recipient on Era Sepolia"
            href={`https://sepolia.explorer.zksync.io/address/${preview?.to ?? owner}`}
          />
        </>
      )}
      {error && (
        <div className="bridge-zksync-send-eth-error">
          {error}
        </div>
      )}
    </div>
  )
}
