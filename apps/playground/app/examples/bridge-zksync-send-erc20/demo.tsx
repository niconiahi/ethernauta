// Sepolia → Era Sepolia ERC-20 deposit through the zkSync
// Bridgehub via the post-v26 "two bridges" pattern. Calls the
// `send_erc20` verb through the zkSync-wrapped `create_bridge`
// factory:
//   send_erc20({...})(bridge({ l1, l2, signer }))
//
// The verb reads the destination chain's L2 base cost from
// `Bridgehub.l2TransactionBaseCost`, ABI-encodes the 9-field
// outer struct with `secondBridgeAddress = deploys.l1.assetRouter`
// + `secondBridgeCalldata = abi.encode(l1_token, amount, to)`,
// asks the wallet to sign, and broadcasts on L1 (path 2 per M3).
//
// Approval reminder: the user must `approve(L1NativeTokenVault,
// amount)` on `l1_token` before calling — the asset router
// forwards to the NTV which is the contract that calls
// `transferFrom`. The verb does NOT do this approval for you.

import "./demo.css"
import {
  address as address_codec,
  encode_sequence,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import { eip155_300 } from "@ethernauta/chain/eip155-300"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import {
  AddressSchema,
  BytesSchema,
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
  bytes_to_hex,
  hex_to_bigint,
} from "@ethernauta/utils"
import {
  create_bridge,
  require_deploy_addresses,
  send_erc20,
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

const DEFAULT_AMOUNT_HEX = "0xde0b6b3a7640000" // 1 token (18 dec)
const DEFAULT_L2_GAS_LIMIT_HEX = bigint_to_hex(1_000_000n)
const PUBDATA_BYTE_LIMIT_HEX = "0x320"
const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000"

const ERA_DEPLOYS = require_deploy_addresses(
  ERA_SEPOLIA_CHAIN_ID,
)
const L1_BRIDGEHUB = ERA_DEPLOYS.l1.bridgehub
const L1_ASSET_ROUTER = ERA_DEPLOYS.l1.assetRouter
const L1_NATIVE_TOKEN_VAULT = ERA_DEPLOYS.l1.nativeTokenVault

function format_uint(hex: string): string {
  try {
    return hex_to_bigint(
      parse(Uint256Schema, hex),
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
        className="send-calls-row-value is-mono bridge-zksync-send-erc20-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {href}
      </a>
    </div>
  )
}

export function BridgeZksyncSendErc20Demo() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [_l1_token, set_l1_token] = useState(ZERO_ADDRESS)
  const [_to, set_to] = useState<string>(
    owner ?? ZERO_ADDRESS,
  )
  const [_amount, set_amount] = useState(DEFAULT_AMOUNT_HEX)
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
    const to_result = safeParse(AddressSchema, _to)
    const amount_result = safeParse(Uint256Schema, _amount)
    if (
      !l1_token_result.success ||
      !to_result.success ||
      !amount_result.success
    ) {
      return null
    }
    const second_bridge_calldata = parse(
      BytesSchema,
      bytes_to_hex(
        encode_sequence(
          [
            address_codec(),
            uint256_codec(),
            address_codec(),
          ],
          [
            l1_token_result.output,
            amount_result.output,
            to_result.output,
          ],
        ),
      ),
    )
    return {
      l1_token: l1_token_result.output,
      to: to_result.output,
      amount_label: format_uint(_amount),
      second_bridge_calldata,
    }
  }, [_l1_token, _to, _amount])

  if (!owner) return <SignInHint />

  async function run() {
    if (!provider) return
    set_error(null)
    set_tx_hash(null)
    set_in_flight(true)
    try {
      const l1_token = parse(AddressSchema, _l1_token)
      const to = parse(AddressSchema, _to)
      const amount = parse(Uint256Schema, _amount)
      const hash = await send_erc20({
        l1_token,
        to,
        amount,
      })(
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
    : "Bridge ERC-20 to Era Sepolia"

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
        label="L1 AssetRouter (secondBridgeAddress)"
        value={L1_ASSET_ROUTER}
        mono
      />
      <Row
        label="L1 NativeTokenVault (approve target)"
        value={L1_NATIVE_TOKEN_VAULT}
        mono
      />
      <Row
        label="Bridge function"
        value="requestL2TransactionTwoBridges(L2TransactionRequestTwoBridgesOuter)"
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
      <div className="bridge-zksync-send-erc20-form">
        <label className="bridge-zksync-send-erc20-label">
          l1_token (Sepolia ERC-20)
          <input
            className="bridge-zksync-send-erc20-input"
            value={_l1_token}
            onChange={(e) =>
              set_l1_token(e.currentTarget.value)
            }
          />
        </label>
        <label className="bridge-zksync-send-erc20-label">
          to (L2 recipient)
          <input
            className="bridge-zksync-send-erc20-input"
            value={_to}
            onChange={(e) => set_to(e.currentTarget.value)}
          />
        </label>
        <label className="bridge-zksync-send-erc20-label">
          amount (hex, token base units)
          <input
            className="bridge-zksync-send-erc20-input"
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
            label="secondBridgeCalldata = abi.encode(l1_token, amount, to)"
            value={preview.second_bridge_calldata}
            mono
          />
        </>
      ) : (
        <div className="bridge-zksync-send-erc20-error">
          One of the inputs above is invalid — fix it to
          preview the asset-router payload.
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
        <div className="bridge-zksync-send-erc20-error">
          {error}
        </div>
      )}
    </div>
  )
}
