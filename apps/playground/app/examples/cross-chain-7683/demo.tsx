import "./demo.css"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Uint256Schema,
} from "@ethernauta/core"
import {
  address_to_bytes32,
  build_gasless_order,
  type GaslessCrossChainOrder,
  hash_gasless_order,
  sign_gasless_order,
} from "@ethernauta/erc/7683"
import { useProvider } from "@ethernauta/react"
import { encode_chain_id } from "@ethernauta/transport"
import { useState } from "react"
import { parse } from "valibot"
import { Button } from "../../components/button"
import { SignInHint } from "../../components/sign-in-hint"
import { use_session } from "../../lib/auth/use-session"
import { PROVIDER_STORE_KEY } from "../../lib/provider-store"

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

const SEPOLIA_REF_HEX = parse(
  Uint256Schema,
  `0x${eip155_11155111.chainId.toString(16)}`,
)

const OP_SEPOLIA_REF_HEX = "0xaa37dc" as const

// Sepolia USDC (Circle's testnet deployment).
const USDC_SEPOLIA = parse(
  AddressSchema,
  "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
)

// OP Sepolia USDC.
const USDC_OP_SEPOLIA = parse(
  AddressSchema,
  "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
)

// Placeholder origin settler — the demo signs the order
// against whichever address the user pastes. Replace with
// the active Across (or other) testnet 7683 settler before
// submitting.
const DEFAULT_SETTLER =
  "0x0000000000000000000000000000000000000000" as const

// Most settlers tag their order-data shape with a bytes32
// magic value so they can multiplex orderData layouts. The
// canonical 7683 ref impl uses keccak("ERC7683") — replace
// with the type your settler expects.
const ORDER_DATA_TYPE = parse(
  Bytes32Schema,
  `0x${"00".repeat(32)}`,
)

function shorten(hex: string, head = 10, tail = 8): string {
  if (hex.length <= head + tail + 1) return hex
  return `${hex.slice(0, head)}…${hex.slice(-tail)}`
}

export function CrossChain7683Demo() {
  const session = use_session()
  const user = session?.address ?? null
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [settler, set_settler] =
    useState<string>(DEFAULT_SETTLER)
  const [order, set_order] =
    useState<GaslessCrossChainOrder | null>(null)
  const [order_id, set_order_id] = useState<string | null>(
    null,
  )
  const [signature, set_signature] = useState<
    string | null
  >(null)
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  async function sign_order() {
    if (!user || !provider) return
    set_loading(true)
    set_error(null)
    set_signature(null)
    try {
      const settler_address = parse(AddressSchema, settler)
      const user_address = parse(AddressSchema, user)
      const built = build_gasless_order({
        originSettler: settler_address,
        user: user_address,
        originChainId: SEPOLIA_REF_HEX,
        orderDataType: ORDER_DATA_TYPE,
        // Demo order data — most settlers expect an
        // abi-encoded struct describing input/output tokens,
        // amounts, recipient, destination chain, etc. We
        // emit a sentinel here so the typed-data signature
        // is real but the on-chain submission won't succeed
        // until orderData matches the settler's schema.
        orderData: parse(
          BytesSchema,
          `0x${USDC_SEPOLIA.slice(2).padStart(64, "0")}${USDC_OP_SEPOLIA.slice(2).padStart(64, "0")}${OP_SEPOLIA_REF_HEX.slice(2).padStart(64, "0")}`.toLowerCase(),
        ),
        window: {
          open_window_s: 60 * 5,
          fill_window_s: 60 * 30,
        },
      })
      const domain = {
        name: "ERC-7683 settler",
        version: "1",
        chainId: eip155_11155111.chainId,
        verifyingContract: settler_address,
      }
      const id = hash_gasless_order({
        order: built,
        domain,
      })
      const sig = await sign_gasless_order({
        order: built,
        domain,
      })(provider.signer({ chain_id: SEPOLIA_CHAIN_ID }))
      set_order(built)
      set_order_id(id)
      set_signature(sig)
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    } finally {
      set_loading(false)
    }
  }

  return (
    <div className="cross-chain-7683-root">
      <div className="cross-chain-7683-rows">
        <Row
          label="Origin"
          value={`${eip155_11155111.name} (USDC)`}
        />
        <Row
          label="Destination"
          value="OP Sepolia (USDC)"
        />
        <Row
          label="Recipient (bytes32)"
          value={
            user
              ? address_to_bytes32(
                  parse(AddressSchema, user),
                )
              : "(connect)"
          }
          mono
        />
        {user && <Row label="User" value={user} mono />}
        {order_id && (
          <Row label="Order id" value={order_id} mono />
        )}
        {signature && (
          <Row
            label="Signature"
            value={shorten(signature, 14, 10)}
            mono
          />
        )}
      </div>
      <label className="cross-chain-7683-field">
        <span className="cross-chain-7683-field-label">
          Origin settler (verifyingContract)
        </span>
        <input
          value={settler}
          onChange={(e) =>
            set_settler(e.currentTarget.value)
          }
          className="cross-chain-7683-field-input"
        />
      </label>
      {error && (
        <p className="cross-chain-7683-error">{error}</p>
      )}
      <div className="cross-chain-7683-button-row">
        {!user && <SignInHint />}
        {user && (
          <Button onClick={sign_order} disabled={loading}>
            {loading
              ? "Signing…"
              : signature
                ? "Re-sign order"
                : "Build & sign gasless order"}
          </Button>
        )}
      </div>
      {order && signature && (
        <details className="cross-chain-7683-details">
          <summary className="cross-chain-7683-summary">
            Submission payload (paste into a relayer)
          </summary>
          <pre className="cross-chain-7683-pre">
            {JSON.stringify({ order, signature }, null, 2)}
          </pre>
        </details>
      )}
      {!user && (
        <p className="cross-chain-7683-hint">
          Needs the Ethernauta extension. The signature is
          real EIP-712 against the settler you paste —
          submission via `openFor()` is up to a relayer.
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
    <div className="cross-chain-7683-row">
      <span className="cross-chain-7683-row-label">
        {label}
      </span>
      <span
        className={
          mono
            ? "cross-chain-7683-row-value is-mono"
            : "cross-chain-7683-row-value"
        }
      >
        {value}
      </span>
    </div>
  )
}
