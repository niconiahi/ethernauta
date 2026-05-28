import {
  AddressSchema,
  ByteSchema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import {
  sign_authorization,
  sign_set_code_transaction,
} from "@ethernauta/eip/7702"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"
import { Button } from "../../components/button"
import {
  get_reader,
  get_writer,
  selected_chain,
} from "../../utils/chain"
import {
  big_to_hex,
  get_private_key,
} from "../../utils/crypto"
import type {
  SignTransactionResponse,
  TransactionRejectedResponse,
} from "../../utils/event"
import { get_nonce } from "../../utils/sign-transaction"
import { set_code_request } from "../../utils/transaction"
import { active_account } from "../../utils/wallet"

// Conservative testnet defaults — unused gas is refunded
// under EIP-1559. Wire eth_estimateGas + the fee-market RPCs
// once they're plumbed through the wallet.
const MAX_PRIORITY_FEE_PER_GAS = 2_000_000_000n
const MAX_FEE_PER_GAS = 30_000_000_000n
const GAS_LIMIT = 1_000_000n
const ZERO_UINT = parse(UintSchema, "0x0")

export function AuthorizeDelegation() {
  const req = set_code_request.value
  if (!req) {
    return (
      <main className="p-4 w-80 text-sm text-[var(--text-muted)]">
        No delegation request pending.
      </main>
    )
  }
  const params = req.parameters
  return (
    <main className="flex flex-col gap-3 p-4 w-80 text-base">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-bold leading-tight">
          Delegate your account
        </h1>
        <p className="text-xs text-[var(--text-muted)]">
          EIP-7702 — set EOA code to a contract for this tx.
        </p>
      </header>
      <section className="rounded-md border-2 border-[var(--text)] bg-[var(--surface-strong)] p-3 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
          Delegating to
        </p>
        {params.delegations.map((delegation) => (
          <p
            key={delegation.address}
            className="font-mono text-xs break-all"
          >
            {delegation.address}
            <span className="text-[var(--text-muted)]">
              {" "}
              (chain {delegation.chainId})
            </span>
          </p>
        ))}
      </section>
      <section className="rounded-md border-2 border-[var(--text)] bg-[var(--surface-strong)] p-3 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
          Calling
        </p>
        <p className="font-mono text-xs break-all">
          {params.to}
        </p>
        {params.value && params.value !== ZERO_UINT && (
          <p className="font-mono text-xs">
            value: {params.value}
          </p>
        )}
        {params.data && params.data !== "0x" && (
          <details className="text-[10px] opacity-70">
            <summary className="cursor-pointer">
              calldata
            </summary>
            <div className="font-mono break-all pt-1">
              {params.data}
            </div>
          </details>
        )}
      </section>
      <div className="flex flex-col gap-2">
        <Button
          onClick={async () => {
            const private_key = get_private_key(
              active_account.value.key,
            )
            const { chain_id, reader } = get_reader(
              selected_chain.value,
            )
            const { writer } = get_writer(
              selected_chain.value,
            )
            const nonce = await get_nonce(
              parse(
                AddressSchema,
                active_account.value.address,
              ),
              reader,
              chain_id,
            )
            // Self-sponsored 7702: each auth's nonce is the
            // outer tx nonce + 1 + i (auth signatures are
            // checked against the EOA's *post-increment*
            // nonce per the spec).
            const authorization_list =
              params.delegations.map((delegation, i) =>
                sign_authorization(
                  {
                    chainId: delegation.chainId,
                    address: delegation.address,
                    nonce: parse(
                      UintSchema,
                      big_to_hex(nonce + BigInt(i + 1)),
                    ),
                  },
                  private_key,
                ),
              )
            const raw = sign_set_code_transaction(
              {
                type: parse(ByteSchema, "0x4"),
                chainId: parse(
                  UintSchema,
                  big_to_hex(
                    BigInt(selected_chain.value.id),
                  ),
                ),
                nonce: parse(UintSchema, big_to_hex(nonce)),
                maxPriorityFeePerGas: parse(
                  UintSchema,
                  big_to_hex(MAX_PRIORITY_FEE_PER_GAS),
                ),
                maxFeePerGas: parse(
                  UintSchema,
                  big_to_hex(MAX_FEE_PER_GAS),
                ),
                gas: parse(
                  UintSchema,
                  big_to_hex(GAS_LIMIT),
                ),
                to: params.to,
                value: parse(
                  UintSchema,
                  params.value ?? "0x0",
                ),
                input: parse(
                  BytesSchema,
                  params.data ?? "0x",
                ),
                accessList: [],
                authorizationList: authorization_list,
              },
              private_key,
            )
            const transaction_hash =
              await eth_sendRawTransaction([
                parse(BytesSchema, bytes_to_hex(raw)),
              ])(writer({ chain_id }))
            const response: SignTransactionResponse = {
              id: req.id,
              type: "ETHERNAUTA_RESPONSE_SIGNED_TRANSACTION",
              signed_transaction: transaction_hash,
            }
            chrome.runtime.sendMessage(response)
            window.close()
          }}
        >
          Approve & broadcast
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const response: TransactionRejectedResponse = {
              id: req.id,
              type: "ETHERNAUTA_RESPONSE_TRANSACTION_REJECTED",
            }
            chrome.runtime.sendMessage(response)
            window.close()
          }}
        >
          Reject
        </Button>
      </div>
    </main>
  )
}
