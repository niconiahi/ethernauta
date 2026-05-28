import "./demo.css"
import {
  address,
  bytes,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import {
  type Address,
  AddressSchema,
  type Bytes,
  BytesSchema,
  Hash32Schema,
  type Uint256,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import {
  ENTRY_POINT_V07_ADDRESS,
  eth_estimateUserOperationGas,
  eth_getUserOperationReceipt,
  eth_sendUserOperation,
  eth_supportedEntryPoints,
  get_user_op_hash,
  sign_user_op,
  type UserOperation,
} from "@ethernauta/eip/4337"
import { useProvider } from "@ethernauta/react"
import {
  create_reader,
  create_writer,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
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

const SEPOLIA_REF_HEX = parse(
  UintSchema,
  `0x${eip155_11155111.chainId.toString(16)}`,
)

// SimpleAccount.execute(target, value, data) — standard
// ERC-4337 reference account entry point. Other smart-account
// implementations expose their own dispatch — swap encode_*
// to match.
const EXECUTE_CODECS = [
  address(),
  uint256(),
  bytes(),
] as const

function encode_execute(
  target: Address,
  value: Uint256,
  data: Bytes,
): Bytes {
  return parse(
    BytesSchema,
    bytes_to_hex(
      encode_function_call({
        name: "execute",
        args: EXECUTE_CODECS,
        values: [target, value, data] as const,
      }),
    ),
  )
}

function shorten(
  hex: string,
  head = 12,
  tail = 10,
): string {
  if (hex.length <= head + tail + 1) return hex
  return `${hex.slice(0, head)}…${hex.slice(-tail)}`
}

const ZERO_NONCE = parse(UintSchema, "0x0")
const ZERO_VALUE = parse(Uint256Schema, "0x0")
const ZERO_BYTES = parse(BytesSchema, "0x")
const CALL_GAS_LIMIT = parse(UintSchema, "0x186a0") // 100k
const VERIFICATION_GAS_LIMIT = parse(UintSchema, "0x186a0") // 100k
const PRE_VERIFICATION_GAS = parse(UintSchema, "0xc350") // 50k
const MAX_FEE_PER_GAS = parse(UintSchema, "0x6fc23ac00") // 30 gwei
const MAX_PRIORITY_FEE_PER_GAS = parse(
  UintSchema,
  "0x77359400",
) // 2 gwei
const PLACEHOLDER_SIGNATURE = parse(
  BytesSchema,
  `0x${"00".repeat(65)}`,
)

export function UserOp4337Demo() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider = useProvider({ key: PROVIDER_STORE_KEY })
  const [sender, set_sender] = useState<string>("")
  const [bundler_url, set_bundler_url] =
    useState<string>("")
  const [target, set_target] = useState<string>(
    "0x1111111111111111111111111111111111111111",
  )
  const [supported, set_supported] = useState<
    string[] | null
  >(null)
  const [op, set_op] = useState<UserOperation | null>(null)
  const [user_op_hash, set_user_op_hash] = useState<
    string | null
  >(null)
  const [signed_op, set_signed_op] =
    useState<UserOperation | null>(null)
  const [tx_hash, set_tx_hash] = useState<string | null>(
    null,
  )
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  function bundler_chains() {
    return [
      {
        chainId: SEPOLIA_CHAIN_ID,
        transports: [http(bundler_url)],
      },
    ]
  }

  async function check_bundler() {
    set_error(null)
    set_supported(null)
    try {
      const reader = create_reader(bundler_chains())
      const eps = await eth_supportedEntryPoints()(
        reader({ chain_id: SEPOLIA_CHAIN_ID }),
      )
      set_supported(eps)
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    }
  }

  async function build_and_sign() {
    if (!owner || !sender || !provider) return
    set_loading(true)
    set_error(null)
    set_op(null)
    set_signed_op(null)
    set_user_op_hash(null)
    try {
      const draft: UserOperation = {
        sender: parse(AddressSchema, sender),
        nonce: ZERO_NONCE,
        callData: encode_execute(
          parse(AddressSchema, target),
          ZERO_VALUE,
          ZERO_BYTES,
        ),
        callGasLimit: CALL_GAS_LIMIT,
        verificationGasLimit: VERIFICATION_GAS_LIMIT,
        preVerificationGas: PRE_VERIFICATION_GAS,
        maxFeePerGas: MAX_FEE_PER_GAS,
        maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
        signature: PLACEHOLDER_SIGNATURE,
      }
      const hash = get_user_op_hash({
        op: draft,
        entryPoint: ENTRY_POINT_V07_ADDRESS,
        chainId: SEPOLIA_REF_HEX,
      })
      set_op(draft)
      set_user_op_hash(hash)
      const signature = await sign_user_op({
        op: draft,
        owner: parse(AddressSchema, owner),
        entryPoint: ENTRY_POINT_V07_ADDRESS,
        chainId: SEPOLIA_REF_HEX,
      })(provider.signer({ chain_id: SEPOLIA_CHAIN_ID }))
      set_signed_op({ ...draft, signature })
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    } finally {
      set_loading(false)
    }
  }

  async function estimate() {
    if (!signed_op) return
    set_loading(true)
    set_error(null)
    try {
      const reader = create_reader(bundler_chains())
      const estimate_result =
        await eth_estimateUserOperationGas({
          op: signed_op,
          entryPoint: ENTRY_POINT_V07_ADDRESS,
        })(reader({ chain_id: SEPOLIA_CHAIN_ID }))
      const updated: UserOperation = {
        ...signed_op,
        callGasLimit: estimate_result.callGasLimit,
        verificationGasLimit:
          estimate_result.verificationGasLimit,
        preVerificationGas:
          estimate_result.preVerificationGas,
      }
      set_signed_op(updated)
      set_op(updated)
      // re-derive hash + re-sign with the new gas fields
      const hash = get_user_op_hash({
        op: updated,
        entryPoint: ENTRY_POINT_V07_ADDRESS,
        chainId: SEPOLIA_REF_HEX,
      })
      set_user_op_hash(hash)
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    } finally {
      set_loading(false)
    }
  }

  async function send() {
    if (!signed_op) return
    set_loading(true)
    set_error(null)
    set_tx_hash(null)
    try {
      const writer = create_writer(bundler_chains())
      const hash = await eth_sendUserOperation({
        op: signed_op,
        entryPoint: ENTRY_POINT_V07_ADDRESS,
      })(writer({ chain_id: SEPOLIA_CHAIN_ID }))
      set_tx_hash(hash)
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    } finally {
      set_loading(false)
    }
  }

  async function poll_receipt() {
    if (!user_op_hash) return
    set_loading(true)
    set_error(null)
    try {
      const reader = create_reader(bundler_chains())
      const receipt = await eth_getUserOperationReceipt(
        parse(Hash32Schema, user_op_hash),
      )(reader({ chain_id: SEPOLIA_CHAIN_ID }))
      if (receipt === null) {
        set_error("Receipt not yet available.")
      } else {
        set_tx_hash(receipt.receipt.transactionHash)
      }
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    } finally {
      set_loading(false)
    }
  }

  return (
    <div className="user-op-4337-root">
      <div className="user-op-4337-rows">
        <Row
          label="Network"
          value={`${eip155_11155111.name} (chain ${eip155_11155111.chainId})`}
        />
        <Row
          label="EntryPoint"
          value={ENTRY_POINT_V07_ADDRESS}
          mono
        />
        {owner && (
          <Row label="Owner (EOA)" value={owner} mono />
        )}
        {supported && (
          <Row
            label="Bundler supports"
            value={shorten(supported.join(", "))}
            mono
          />
        )}
        {user_op_hash && (
          <Row
            label="UserOp hash"
            value={user_op_hash}
            mono
          />
        )}
        {tx_hash && (
          <Row label="Tx hash" value={tx_hash} mono />
        )}
      </div>
      <Field
        label="Bundler URL (Sepolia)"
        value={bundler_url}
        onChange={set_bundler_url}
        placeholder="https://api.pimlico.io/v2/sepolia/rpc?apikey=…"
      />
      <Field
        label="Smart account (sender)"
        value={sender}
        onChange={set_sender}
        placeholder="0x… counterfactual or deployed SimpleAccount"
      />
      <Field
        label="Target address"
        value={target}
        onChange={set_target}
      />
      {error && (
        <p className="user-op-4337-error">{error}</p>
      )}
      <div className="user-op-4337-actions">
        {!owner && <SignInHint />}
        {bundler_url && (
          <Button
            variant="secondary"
            onClick={check_bundler}
            disabled={loading}
          >
            Check bundler
          </Button>
        )}
        {owner && sender && (
          <Button
            onClick={build_and_sign}
            disabled={loading}
          >
            {loading
              ? "Working…"
              : signed_op
                ? "Re-sign"
                : "Build + sign"}
          </Button>
        )}
        {signed_op && bundler_url && (
          <>
            <Button
              variant="secondary"
              onClick={estimate}
              disabled={loading}
            >
              Estimate gas
            </Button>
            <Button onClick={send} disabled={loading}>
              Submit to bundler
            </Button>
          </>
        )}
        {user_op_hash &&
          tx_hash === null &&
          bundler_url && (
            <Button
              variant="secondary"
              onClick={poll_receipt}
              disabled={loading}
            >
              Poll receipt
            </Button>
          )}
      </div>
      {op && signed_op && (
        <details className="user-op-4337-details">
          <summary className="user-op-4337-summary">
            Signed UserOperation
          </summary>
          <pre className="user-op-4337-pre">
            {JSON.stringify(signed_op, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  placeholder?: string
}) {
  return (
    <label className="user-op-4337-field">
      <span className="user-op-4337-field-label">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.currentTarget.value.trim())
        }
        className="user-op-4337-field-input"
      />
    </label>
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
    <div className="user-op-4337-row">
      <span className="user-op-4337-row-label">
        {label}
      </span>
      <span
        className={
          mono
            ? "user-op-4337-row-value is-mono"
            : "user-op-4337-row-value"
        }
      >
        {value}
      </span>
    </div>
  )
}
