import "./demo.css"
import {
  address,
  array,
  bytes,
  encode_function_call,
  tuple,
  uint256,
} from "@ethernauta/abi"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import {
  type Address,
  AddressSchema,
  type Bytes,
  BytesSchema,
  type Uint256,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import { wallet_sendSetCodeTransaction } from "@ethernauta/eip/7702"
import { useProvider } from "@ethernauta/react"
import { encode_chain_id } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
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

// EIP-7702 expects the on-chain address as a uint256 hex of
// the chain reference. Sepolia = 11155111 = 0xaa36a7.
const SEPOLIA_CHAIN_REF_HEX = parse(
  UintSchema,
  `0x${eip155_11155111.chainId.toString(16)}`,
)

// packages/eip/src/7702/BatchExecutor.sol deployed to Sepolia.
// Source + forge tests are colocated next to the EIP-7702 binding;
// re-deploy via `forge create` if you want your own copy.
const BATCH_EXECUTOR = parse(
  AddressSchema,
  "0x5AAC53e7b782CCD32A083F938AEbA843731323Ee",
)

// Two harmless target calls: send 0 wei with no calldata to
// two distinct burn-friendly addresses. The point is to
// prove the batch executes atomically — not to move value.
const TARGETS = [
  parse(
    AddressSchema,
    "0x1111111111111111111111111111111111111111",
  ),
  parse(
    AddressSchema,
    "0x2222222222222222222222222222222222222222",
  ),
]

const ZERO_VALUE = parse(Uint256Schema, "0x0")
const ZERO_DATA = parse(BytesSchema, "0x")

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
    BytesSchema,
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
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [tx_hash, set_tx_hash] = useState<string | null>(
    null,
  )
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  async function run_batch() {
    if (!owner || !provider) return
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
        to: parse(AddressSchema, owner),
        data: calldata,
        delegations: [
          {
            chainId: SEPOLIA_CHAIN_REF_HEX,
            address: BATCH_EXECUTOR,
          },
        ],
      })(provider.signer({ chain_id: SEPOLIA_CHAIN_ID }))
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
    <div className="delegate-7702-root">
      <div className="delegate-7702-rows">
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
        <p className="delegate-7702-error">{error}</p>
      )}
      <div className="delegate-7702-actions">
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
            className="delegate-7702-explorer-link"
          >
            View on Sepolia Etherscan ↗
          </a>
        )}
      </div>
      {!owner && (
        <p className="delegate-7702-hint">
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
    <div className="delegate-7702-row">
      <span className="delegate-7702-row-label">
        {label}
      </span>
      <span
        className={
          mono
            ? "delegate-7702-row-value is-mono"
            : "delegate-7702-row-value"
        }
      >
        {value}
      </span>
    </div>
  )
}
