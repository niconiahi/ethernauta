import {
  address,
  array,
  bytes,
  encode_function_call,
  tuple,
  uint256,
} from "@ethernauta/abi"
import { eip155_11155111 } from "@ethernauta/chain"
import {
  type Address,
  addressSchema,
  type Bytes,
  bytesSchema,
  type Uint256,
  uint256Schema,
  uintSchema,
} from "@ethernauta/core"
import { wallet_sendSetCodeTransaction } from "@ethernauta/eip/7702"
import {
  create_signer,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { useState } from "react"
import { parse } from "valibot"
import { Button } from "../../components/button"
import { SignInHint } from "../../components/sign-in-hint"
import { use_session } from "../../lib/auth/use-session"

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

// EIP-7702 expects the on-chain address as a uint256 hex of
// the chain reference. Sepolia = 11155111 = 0xaa36a7.
const SEPOLIA_CHAIN_REF_HEX = parse(
  uintSchema,
  `0x${eip155_11155111.chainId.toString(16)}`,
)

// contracts/src/BatchExecutor.sol deployed to Sepolia.
// Source + forge tests are in the `contracts/` package;
// re-deploy via `forge create` if you want your own copy.
const BATCH_EXECUTOR = parse(
  addressSchema,
  "0x5AAC53e7b782CCD32A083F938AEbA843731323Ee",
)

// Two harmless target calls: send 0 wei with no calldata to
// two distinct burn-friendly addresses. The point is to
// prove the batch executes atomically — not to move value.
const TARGETS = [
  parse(
    addressSchema,
    "0x1111111111111111111111111111111111111111",
  ),
  parse(
    addressSchema,
    "0x2222222222222222222222222222222222222222",
  ),
]

const ZERO_VALUE = parse(uint256Schema, "0x0")
const ZERO_DATA = parse(bytesSchema, "0x")

const CHAINS = [
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [
      http("https://ethereum-sepolia-rpc.publicnode.com"),
    ],
  },
]
const signer = create_signer(CHAINS)

const call_tuple = tuple({
  to: address(),
  value: uint256(),
  data: bytes(),
})
const execute_args = [array(call_tuple)] as const

function encode_execute(
  calls: Array<{
    to: Address
    value: Uint256
    data: Bytes
  }>,
): Bytes {
  return parse(
    bytesSchema,
    bytes_to_hex(
      encode_function_call({
        name: "execute",
        args: execute_args,
        values: [calls],
      }),
    ),
  )
}

export function Delegate7702Demo() {
  const session = use_session()
  const owner = session?.address ?? null
  const [tx_hash, set_tx_hash] = useState<string | null>(
    null,
  )
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  async function run_batch() {
    if (!owner) return
    set_loading(true)
    set_error(null)
    try {
      const calls = TARGETS.map((to) => ({
        to,
        value: ZERO_VALUE,
        data: ZERO_DATA,
      }))
      const calldata = encode_execute(calls)
      const hash = await wallet_sendSetCodeTransaction({
        to: parse(addressSchema, owner),
        data: calldata,
        delegations: [
          {
            chainId: SEPOLIA_CHAIN_REF_HEX,
            address: BATCH_EXECUTOR,
          },
        ],
      })(signer({ chain_id: SEPOLIA_CHAIN_ID }))
      set_tx_hash(hash)
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    } finally {
      set_loading(false)
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Row
          label="Network"
          value={`${eip155_11155111.name} (chain ${eip155_11155111.chainId})`}
        />
        <Row
          label="Delegation target"
          value={BATCH_EXECUTOR}
          mono
        />
        <Row label="Batch size" value="2 calls" />
        {owner && (
          <Row label="Account" value={owner} mono />
        )}
        {tx_hash && (
          <Row label="Tx hash" value={tx_hash} mono />
        )}
      </div>
      {error && (
        <p
          style={{
            color: "#e53e3e",
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
          <Button onClick={run_batch} disabled={loading}>
            {loading
              ? "Signing & broadcasting…"
              : tx_hash
                ? "Run another batch"
                : "Delegate & batch-execute"}
          </Button>
        )}
        {tx_hash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${tx_hash}`}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 14,
              color: "#FF5005",
              alignSelf: "center",
            }}
          >
            View on Sepolia Etherscan ↗
          </a>
        )}
      </div>
      {!owner && (
        <p
          style={{
            fontSize: 13,
            color: "#999",
            marginTop: 12,
          }}
        >
          Needs the Ethernauta extension installed and
          Sepolia ETH in the connected account.
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
        borderBottom: "1px solid #f0f0f0",
        fontSize: 14,
      }}
    >
      <span style={{ color: "#666", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: mono ? "monospace" : "inherit",
          color: "#1a1a1a",
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
