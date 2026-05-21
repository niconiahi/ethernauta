import {
  address,
  bytes,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import { eip155_11155111 } from "@ethernauta/chain"
import { eth_requestAccounts } from "@ethernauta/eip/1102"
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
import {
  create_reader,
  create_signer,
  create_writer,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { useState } from "react"
import { Button } from "../../components/button"

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

const SEPOLIA_REF_HEX =
  `0x${eip155_11155111.chainId.toString(16)}` as const

const NODE_CHAINS = [
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [
      http("https://ethereum-sepolia-rpc.publicnode.com"),
    ],
  },
]
const signer = create_signer(NODE_CHAINS)

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
  target: `0x${string}`,
  value: bigint,
  data: `0x${string}`,
): `0x${string}` {
  return bytes_to_hex(
    encode_function_call({
      name: "execute",
      args: EXECUTE_CODECS,
      values: [target, value, data] as never,
    }),
  )
}

function shorten(hex: string, head = 12, tail = 10): string {
  if (hex.length <= head + tail + 1) return hex
  return `${hex.slice(0, head)}…${hex.slice(-tail)}`
}

const ZERO_NONCE = "0x0" as const
const ZERO_BYTES = "0x" as const

export function UserOp4337Demo() {
  const [owner, set_owner] = useState<string | null>(null)
  const [sender, set_sender] = useState<string>("")
  const [bundler_url, set_bundler_url] = useState<string>(
    "",
  )
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

  async function connect() {
    set_error(null)
    try {
      const accounts = await eth_requestAccounts()(
        signer({ chain_id: SEPOLIA_CHAIN_ID }),
      )
      if (accounts[0]) set_owner(accounts[0])
    } catch (e) {
      set_error(
        e instanceof Error ? e.message : "Unknown error",
      )
    }
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
    if (!owner || !sender) return
    set_loading(true)
    set_error(null)
    set_op(null)
    set_signed_op(null)
    set_user_op_hash(null)
    try {
      const draft: UserOperation = {
        sender: sender as `0x${string}`,
        nonce: ZERO_NONCE,
        callData: encode_execute(
          target as `0x${string}`,
          0n,
          ZERO_BYTES,
        ),
        callGasLimit: "0x186a0", // 100k
        verificationGasLimit: "0x186a0", // 100k
        preVerificationGas: "0xc350", // 50k
        maxFeePerGas: "0x6fc23ac00", // 30 gwei
        maxPriorityFeePerGas: "0x77359400", // 2 gwei
        signature: `0x${"00".repeat(65)}`,
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
        owner: owner as `0x${string}`,
        entryPoint: ENTRY_POINT_V07_ADDRESS,
        chainId: SEPOLIA_REF_HEX,
      })(signer({ chain_id: SEPOLIA_CHAIN_ID }))
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
        user_op_hash as `0x${string}`,
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
    <div style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 24 }}>
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
          marginBottom: 16,
        }}
      >
        {!owner && (
          <Button onClick={connect}>Connect wallet</Button>
        )}
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
        {user_op_hash && tx_hash === null && bundler_url && (
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
        <details
          style={{
            marginTop: 24,
            padding: 12,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 6,
            fontSize: 13,
          }}
        >
          <summary style={{ cursor: "pointer" }}>
            Signed UserOperation
          </summary>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              fontSize: 12,
              fontFamily: "monospace",
              marginTop: 12,
            }}
          >
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
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        marginBottom: 12,
      }}
    >
      <span style={{ fontSize: 13, color: "#666" }}>
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.currentTarget.value.trim())
        }
        style={{
          fontFamily: "monospace",
          fontSize: 13,
          padding: "8px 10px",
          border: "1px solid #ddd",
          borderRadius: 6,
        }}
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
