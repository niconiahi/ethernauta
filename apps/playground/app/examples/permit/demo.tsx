import { eip155_1 } from "@ethernauta/chain/eip155-1"
import {
  addressSchema,
  bytes32Schema,
  bytesSchema,
} from "@ethernauta/core"
import { eth_signTypedData_v4 } from "@ethernauta/eip/712"
import {
  DOMAIN_SEPARATOR,
  nonces,
} from "@ethernauta/erc/2612"
import { useProviderDetail } from "@ethernauta/react"
import {
  contract,
  create_multicall,
  create_provider,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import {
  deadline_in,
  format_unit,
  parse_unit,
} from "@ethernauta/utils"
import { useState } from "react"
import {
  bigint,
  type InferOutput,
  object,
  parse,
} from "valibot"
import { Button } from "../../components/button"
import { SignInHint } from "../../components/sign-in-hint"
import { use_session } from "../../lib/auth/use-session"
import { PROVIDER_STORE_KEY } from "../../lib/provider-store"

const MAINNET_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_1.chainId,
})

// USDC on mainnet — EIP-2612 permit support since v2.2.
const USDC = parse(
  addressSchema,
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
)

// Demo spender — Uniswap V2 Router. Picked because it's the
// recognisable spender devs reach for first when explaining
// "approve once, swap later" flows.
const SPENDER = parse(
  addressSchema,
  "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
)

const VALUE = parse_unit("100", 6)

const CHAINS = [
  {
    chainId: MAINNET_CHAIN_ID,
    transports: [
      http("https://ethereum-rpc.publicnode.com"),
    ],
  },
]
const multicall = create_multicall(CHAINS)

const signedPermitSchema = object({
  owner: addressSchema,
  spender: addressSchema,
  value: bigint(),
  nonce: bigint(),
  deadline: bigint(),
  domain_separator: bytes32Schema,
  signature: bytesSchema,
})
type SignedPermit = InferOutput<typeof signedPermitSchema>

export function PermitDemo() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider_detail = useProviderDetail({
    key: PROVIDER_STORE_KEY,
  })
  const [signed, set_signed] =
    useState<SignedPermit | null>(null)
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  async function sign_permit() {
    if (!owner) return
    if (!provider_detail) {
      set_error(
        "No connected wallet. Reconnect via the header's Connect wallet button.",
      )
      return
    }
    set_loading(true)
    set_error(null)
    try {
      const provider = create_provider(
        provider_detail.provider,
      )
      const ctx = contract({
        chain_id: MAINNET_CHAIN_ID,
        to: USDC,
      })
      const owner_address = parse(addressSchema, owner)
      const [domain_separator_hex, nonce_hex] =
        await multicall([
          DOMAIN_SEPARATOR()(ctx),
          nonces({ owner: owner_address })(ctx),
        ] as const)
      const nonce = BigInt(nonce_hex)
      const deadline = deadline_in(3600)
      const signature = await eth_signTypedData_v4([
        owner_address,
        {
          domain: {
            name: "USD Coin",
            version: "2",
            chainId: 1n,
            verifyingContract: USDC,
          },
          types: {
            Permit: [
              { name: "owner", type: "address" },
              { name: "spender", type: "address" },
              { name: "value", type: "uint256" },
              { name: "nonce", type: "uint256" },
              { name: "deadline", type: "uint256" },
            ],
          },
          primaryType: "Permit",
          message: {
            owner: owner_address,
            spender: SPENDER,
            value: VALUE,
            nonce,
            deadline,
          },
        },
      ])(provider.signer({ chain_id: MAINNET_CHAIN_ID }))
      set_signed({
        owner: owner_address,
        spender: SPENDER,
        value: VALUE,
        nonce,
        deadline,
        domain_separator: domain_separator_hex,
        signature,
      })
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    } finally {
      set_loading(false)
    }
  }

  return (
    <div style={{ margin: "16px 0 24px" }}>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 24,
          marginBottom: 16,
        }}
      >
        <Row label="Token" value="USDC (mainnet)" />
        <Row label="Spender" value={SPENDER} mono />
        <Row
          label="Value"
          value={`${format_unit(VALUE, 6)} USDC`}
        />
        {owner && <Row label="Owner" value={owner} mono />}
        {signed && (
          <>
            <Row
              label="Nonce"
              value={signed.nonce.toString()}
            />
            <Row
              label="Deadline"
              value={new Date(
                Number(signed.deadline) * 1000,
              ).toLocaleString()}
            />
            <Row
              label="Domain separator"
              value={signed.domain_separator}
              mono
            />
            <Row
              label="Signature"
              value={signed.signature}
              mono
            />
          </>
        )}
      </div>
      {error && (
        <p
          style={{
            color: "var(--danger)",
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          {error}
        </p>
      )}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {!owner && <SignInHint />}
        {owner && (
          <Button onClick={sign_permit} disabled={loading}>
            {loading
              ? "Signing…"
              : signed
                ? "Re-sign permit"
                : "Sign permit"}
          </Button>
        )}
      </div>
      {!owner && (
        <p
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            marginTop: 12,
          }}
        >
          Needs an EIP-6963 wallet — Ethernauta, MetaMask,
          or any compliant wallet — connected via the
          header's Connect wallet button.
        </p>
      )}
    </div>
  )
}

function Row({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        padding: "10px 0",
        borderBottom: "1px solid var(--border)",
        fontSize: 14,
      }}
    >
      <span
        style={{
          color: "var(--text-muted)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: mono ? "monospace" : "inherit",
          color: "var(--text)",
          textAlign: "right",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    </div>
  )
}
