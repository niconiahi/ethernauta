import "./demo.css"
import {
  address,
  bytes,
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import { eip155_1 } from "@ethernauta/chain/eip155-1"
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
  get_user_op_hash,
  sign_user_op,
  type UserOperation,
} from "@ethernauta/eip/4337"
import {
  apply_to_user_op,
  pm_getPaymasterData,
  pm_getPaymasterStubData,
  type PaymasterUserOperation,
} from "@ethernauta/erc/7677"
import type {
  CallFrame,
  TraceResult,
} from "@ethernauta/eth"
import {
  debug_traceTransaction,
  eth_call,
  eth_getBalance,
  eth_getCode,
  eth_getTransactionReceipt,
  eth_sendTransaction,
  TRACER_TYPE,
} from "@ethernauta/eth"
import { get_ens_address } from "@ethernauta/ens"
import { useProvider } from "@ethernauta/react"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { useEffect, useState } from "react"
import { parse } from "valibot"
import { Button } from "../../components/button"
import { SignInHint } from "../../components/sign-in-hint"
import { use_session } from "../../lib/auth/use-session"
import { PROVIDER_STORE_KEY } from "../../lib/provider-store"

const PIMLICO_URL = import.meta.env.VITE_PIMLICO_URL
const DEBUG_SEPOLIA_URL = import.meta.env.VITE_DEBUG_SEPOLIA_URL

const MAINNET_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_1.chainId,
})

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

const SEPOLIA_REF_HEX = parse(
  UintSchema,
  `0x${eip155_11155111.chainId.toString(16)}`,
)

const mainnet_reader = create_reader([
  {
    chainId: MAINNET_CHAIN_ID,
    transports: [
      http("https://eth-mainnet.public.blastapi.io"),
    ],
  },
])

const sepolia_reader = create_reader([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [
      http("https://ethereum-sepolia-rpc.publicnode.com"),
    ],
  },
])

const mainnet_ctx = mainnet_reader({
  chain_id: MAINNET_CHAIN_ID,
})

const sepolia_ctx = sepolia_reader({
  chain_id: SEPOLIA_CHAIN_ID,
})

// Canonical eth-infinitism v0.7 SimpleAccountFactory deployment.
// Same address Pimlico's bundler and the Etherscan write-contract
// flow target on Sepolia.
const FACTORY_ADDRESS = parse(
  AddressSchema,
  "0x9406Cc6185a346906296840746125a0E44976454",
)
const SALT = parse(Uint256Schema, "0x0")
const AMOUNT_WEI = parse(Uint256Schema, "0x1")

const EXECUTE_CODECS = [
  address(),
  uint256(),
  bytes(),
] as const
const GET_ADDRESS_CODECS = [address(), uint256()] as const
const GET_ADDRESS_OUTPUT_CODECS = [address()] as const
const CREATE_ACCOUNT_CODECS = [address(), uint256()] as const

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

function encode_get_address(
  owner: Address,
  salt: Uint256,
): Bytes {
  return parse(
    BytesSchema,
    bytes_to_hex(
      encode_function_call({
        name: "getAddress",
        args: GET_ADDRESS_CODECS,
        values: [owner, salt] as const,
      }),
    ),
  )
}

function encode_create_account(
  owner: Address,
  salt: Uint256,
): Bytes {
  return parse(
    BytesSchema,
    bytes_to_hex(
      encode_function_call({
        name: "createAccount",
        args: CREATE_ACCOUNT_CODECS,
        values: [owner, salt] as const,
      }),
    ),
  )
}

function to_paymaster_user_op(
  op: UserOperation,
): PaymasterUserOperation {
  return {
    sender: op.sender,
    nonce: op.nonce,
    ...(op.factory && op.factoryData
      ? { factory: op.factory, factoryData: op.factoryData }
      : {}),
    callData: op.callData,
    callGasLimit: op.callGasLimit,
    verificationGasLimit: op.verificationGasLimit,
    preVerificationGas: op.preVerificationGas,
    maxFeePerGas: op.maxFeePerGas,
    maxPriorityFeePerGas: op.maxPriorityFeePerGas,
  }
}

function shorten(hex: string, head = 10, tail = 8): string {
  if (hex.length <= head + tail + 1) return hex
  return `${hex.slice(0, head)}…${hex.slice(-tail)}`
}

const ZERO_NONCE = parse(UintSchema, "0x0")
const ZERO_BYTES = parse(BytesSchema, "0x")
const CALL_GAS_LIMIT = parse(UintSchema, "0x186a0")
const VERIFICATION_GAS_LIMIT = parse(UintSchema, "0x186a0")
const PRE_VERIFICATION_GAS = parse(UintSchema, "0xc350")
const MAX_FEE_PER_GAS = parse(UintSchema, "0x6fc23ac00")
const MAX_PRIORITY_FEE_PER_GAS = parse(
  UintSchema,
  "0x77359400",
)
const PLACEHOLDER_SIGNATURE = parse(
  BytesSchema,
  `0x${"00".repeat(65)}`,
)

async function compute_smart_account(
  owner: Address,
): Promise<Address> {
  const data = encode_get_address(owner, SALT)
  const raw = await eth_call({
    transaction: { to: FACTORY_ADDRESS, input: data },
    blockNumberOrTagOrHash: "latest",
  })(sepolia_ctx)
  const [decoded] = decode_function_result(
    GET_ADDRESS_OUTPUT_CODECS,
    raw,
  )
  return parse(AddressSchema, decoded)
}

async function wait_for_receipt(
  tx_hash: string,
): Promise<void> {
  const hash = parse(Hash32Schema, tx_hash)
  while (true) {
    const receipt = await eth_getTransactionReceipt([hash])(
      sepolia_ctx,
    )
    if (receipt !== null) return
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
}

async function wait_for_user_op_tx(
  user_op_hash: string,
  bundler_ctx: ReturnType<typeof sepolia_reader>,
): Promise<string> {
  const hash = parse(Hash32Schema, user_op_hash)
  while (true) {
    const receipt = await eth_getUserOperationReceipt(hash)(
      bundler_ctx,
    )
    if (receipt !== null) return receipt.receipt.transactionHash
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
}

export function SponsoredBasenameTransferDemo() {
  const session = use_session()
  const owner = session?.address ?? null
  const provider = useProvider({ key: PROVIDER_STORE_KEY })

  const [basename, set_basename] = useState(
    "jesse.base.eth",
  )
  const [recipient, set_recipient] =
    useState<Address | null>(null)
  const [smart_account, set_smart_account] =
    useState<Address | null>(null)
  const [smart_account_balance, set_smart_account_balance] =
    useState<string | null>(null)
  const [smart_account_deployed, set_smart_account_deployed] =
    useState<boolean | null>(null)

  const [busy, set_busy] = useState(false)
  const [status, set_status] = useState("")
  const [error, set_error] = useState<string | null>(null)
  const [tx_hash, set_tx_hash] = useState<string | null>(
    null,
  )
  const [trace, set_trace] = useState<TraceResult | null>(
    null,
  )

  useEffect(() => {
    let cancelled = false
    if (owner === null) {
      set_smart_account(null)
      set_smart_account_balance(null)
      set_smart_account_deployed(null)
      return
    }
    void (async () => {
      try {
        const sender = await compute_smart_account(
          parse(AddressSchema, owner),
        )
        if (cancelled) return
        set_smart_account(sender)
        const [code, balance] = await Promise.all([
          eth_getCode([sender, "latest"])(sepolia_ctx),
          eth_getBalance([sender, "latest"])(sepolia_ctx),
        ])
        if (cancelled) return
        set_smart_account_deployed(code !== ZERO_BYTES)
        set_smart_account_balance(balance)
      } catch (e) {
        if (cancelled) return
        set_error(e instanceof Error ? e.message : String(e))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [owner])

  async function send() {
    if (
      owner === null ||
      provider === null ||
      smart_account === null ||
      PIMLICO_URL === undefined
    ) {
      return
    }
    set_busy(true)
    set_error(null)
    set_tx_hash(null)
    set_trace(null)
    try {
      const validated_owner = parse(AddressSchema, owner)

      set_status("Resolving basename…")
      const resolved = await get_ens_address({
        name: basename,
      })(mainnet_ctx)
      if (resolved === null) {
        set_error("No address record found for that basename.")
        return
      }
      const target = parse(AddressSchema, resolved)
      set_recipient(target)

      set_status("Checking smart account…")
      const [code, balance] = await Promise.all([
        eth_getCode([smart_account, "latest"])(sepolia_ctx),
        eth_getBalance([smart_account, "latest"])(
          sepolia_ctx,
        ),
      ])
      const is_deployed = code !== ZERO_BYTES
      const balance_wei = BigInt(balance)
      const needed_wei = BigInt(AMOUNT_WEI)
      set_smart_account_deployed(is_deployed)
      set_smart_account_balance(balance)

      if (balance_wei < needed_wei) {
        set_status(
          "Approve the funding transaction in your wallet…",
        )
        const fund_hash = await eth_sendTransaction([
          {
            to: smart_account,
            value: parse(UintSchema, AMOUNT_WEI),
            input: ZERO_BYTES,
          },
        ])(
          provider.signer({ chain_id: SEPOLIA_CHAIN_ID }),
        )
        set_status("Waiting for funding confirmation…")
        await wait_for_receipt(fund_hash)
        const refreshed = await eth_getBalance([
          smart_account,
          "latest",
        ])(sepolia_ctx)
        set_smart_account_balance(refreshed)
      }

      set_status("Preparing UserOperation…")
      const factory_fields = is_deployed
        ? {}
        : {
            factory: FACTORY_ADDRESS,
            factoryData: encode_create_account(
              validated_owner,
              SALT,
            ),
          }
      const draft: UserOperation = {
        sender: smart_account,
        nonce: ZERO_NONCE,
        ...factory_fields,
        callData: encode_execute(
          target,
          AMOUNT_WEI,
          ZERO_BYTES,
        ),
        callGasLimit: CALL_GAS_LIMIT,
        verificationGasLimit: VERIFICATION_GAS_LIMIT,
        preVerificationGas: PRE_VERIFICATION_GAS,
        maxFeePerGas: MAX_FEE_PER_GAS,
        maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
        signature: PLACEHOLDER_SIGNATURE,
      }
      const paymaster_transport = http(PIMLICO_URL)
      const stub = await pm_getPaymasterStubData({
        userOp: to_paymaster_user_op(draft),
        entryPoint: ENTRY_POINT_V07_ADDRESS,
        chainId: SEPOLIA_REF_HEX,
      })(paymaster_transport)
      const with_stub = apply_to_user_op(draft, stub)

      const bundler_reader = create_reader([
        {
          chainId: SEPOLIA_CHAIN_ID,
          transports: [http(PIMLICO_URL)],
        },
      ])
      const bundler_ctx = bundler_reader({
        chain_id: SEPOLIA_CHAIN_ID,
      })

      const estimate = await eth_estimateUserOperationGas({
        op: with_stub,
        entryPoint: ENTRY_POINT_V07_ADDRESS,
      })(bundler_ctx)
      const with_estimate: UserOperation = {
        ...with_stub,
        callGasLimit: estimate.callGasLimit,
        verificationGasLimit: estimate.verificationGasLimit,
        preVerificationGas: estimate.preVerificationGas,
      }

      const final_data = await pm_getPaymasterData({
        userOp: to_paymaster_user_op(with_estimate),
        entryPoint: ENTRY_POINT_V07_ADDRESS,
        chainId: SEPOLIA_REF_HEX,
      })(paymaster_transport)
      const with_final = apply_to_user_op(
        with_estimate,
        final_data,
      )

      set_status("Sign to authorize the transfer…")
      const signature = await sign_user_op({
        op: with_final,
        owner: validated_owner,
        entryPoint: ENTRY_POINT_V07_ADDRESS,
        chainId: SEPOLIA_REF_HEX,
      })(provider.signer({ chain_id: SEPOLIA_CHAIN_ID }))
      const signed: UserOperation = {
        ...with_final,
        signature,
      }
      const _local_hash = get_user_op_hash({
        op: signed,
        entryPoint: ENTRY_POINT_V07_ADDRESS,
        chainId: SEPOLIA_REF_HEX,
      })

      set_status("Submitting to bundler…")
      const submitted_hash = await eth_sendUserOperation({
        op: signed,
        entryPoint: ENTRY_POINT_V07_ADDRESS,
      })(bundler_ctx)

      set_status("Waiting for inclusion…")
      const included_tx = await wait_for_user_op_tx(
        submitted_hash,
        bundler_ctx,
      )
      set_tx_hash(included_tx)
      set_smart_account_deployed(true)

      if (DEBUG_SEPOLIA_URL !== undefined) {
        set_status("Tracing…")
        const debug_reader = create_reader([
          {
            chainId: SEPOLIA_CHAIN_ID,
            transports: [http(DEBUG_SEPOLIA_URL)],
          },
        ])
        const result = await debug_traceTransaction({
          transactionHash: parse(Hash32Schema, included_tx),
          tracerConfig: { tracer: TRACER_TYPE.CALL },
        })(debug_reader({ chain_id: SEPOLIA_CHAIN_ID }))
        set_trace(result)
      }

      set_status("")
    } catch (e) {
      set_error(e instanceof Error ? e.message : String(e))
      set_status("")
    } finally {
      set_busy(false)
    }
  }

  const disabled =
    busy ||
    owner === null ||
    provider === null ||
    PIMLICO_URL === undefined ||
    basename.length === 0

  return (
    <div className="sbt-root">
      <section className="sbt-section">
        <h4 className="sbt-section-heading">
          <span>Sponsored basename transfer</span>
          <span className="sbt-section-chain">
            mainnet ENS · Sepolia 4337
          </span>
        </h4>
        <p className="sbt-section-lead">
          Resolves a basename through ENSIP-10 + CCIP-Read,
          then transfers {BigInt(AMOUNT_WEI).toString()} wei from your sponsored
          SimpleAccount on Sepolia. Gas is paid by the
          paymaster; you only fund the value being sent.
        </p>

        {PIMLICO_URL === undefined && (
          <p className="sbt-error">
            Set <code>VITE_PIMLICO_URL</code> in{" "}
            <code>apps/playground/.env.local</code> — see{" "}
            <code>.env.example</code>.
          </p>
        )}
        {owner === null && PIMLICO_URL !== undefined && (
          <SignInHint />
        )}

        <Field
          label="Recipient basename"
          value={basename}
          onChange={set_basename}
          disabled={busy}
        />

        {recipient && (
          <Row
            label="Recipient address"
            value={shorten(recipient, 10, 8)}
            mono
          />
        )}
        {smart_account && (
          <Row
            label="Your smart account"
            value={`${shorten(smart_account, 10, 8)}${
              smart_account_balance === null
                ? ""
                : ` · ${BigInt(smart_account_balance)} wei`
            }${
              smart_account_deployed === false
                ? " · not deployed"
                : ""
            }`}
            mono
          />
        )}

        <div className="sbt-actions">
          <Button onClick={send} disabled={disabled}>
            Send {BigInt(AMOUNT_WEI).toString()} wei to recipient
          </Button>
        </div>

        {status && <p className="sbt-status">{status}</p>}
        {error && <p className="sbt-error">{error}</p>}
        {tx_hash && (
          <p className="sbt-success">
            ✓ Sent —{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${tx_hash}`}
              target="_blank"
              rel="noreferrer"
            >
              {shorten(tx_hash, 14, 12)}
            </a>
          </p>
        )}
        {trace && trace.tracer === TRACER_TYPE.CALL && (
          <details className="sbt-details">
            <summary className="sbt-summary">
              Call trace
            </summary>
            <pre className="sbt-trace-tree">
              {render_call_frame(trace.result, 0)}
            </pre>
          </details>
        )}
      </section>
    </div>
  )
}

function render_call_frame(
  frame: CallFrame,
  depth: number,
): string {
  const indent = "  ".repeat(depth)
  const head = `${indent}${frame.type} ${
    frame.to ? shorten(frame.to, 8, 6) : "(create)"
  } gas=${frame.gasUsed}`
  const err = frame.error
    ? `\n${indent}  ↳ error: ${frame.error}`
    : ""
  const revert = frame.revertReason
    ? `\n${indent}  ↳ revert: ${frame.revertReason}`
    : ""
  const children = (frame.calls ?? [])
    .map((c) => render_call_frame(c, depth + 1))
    .join("\n")
  return `${head}${err}${revert}${
    children.length > 0 ? `\n${children}` : ""
  }`
}

function Field({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  disabled?: boolean
}) {
  return (
    <label className="sbt-field">
      <span className="sbt-field-label">{label}</span>
      <input
        value={value}
        disabled={disabled}
        onChange={(e) =>
          onChange(e.currentTarget.value.trim())
        }
        className="sbt-field-input"
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
    <div className="sbt-row">
      <span className="sbt-row-label">{label}</span>
      <span
        className={
          mono ? "sbt-row-value is-mono" : "sbt-row-value"
        }
      >
        {value}
      </span>
    </div>
  )
}
