import { Button } from "../../components/button"
import type {
  AddChainApprovedResponse,
  TransactionRejectedResponse,
} from "../../utils/event"
import { add_chain_request } from "../../utils/transaction"

export function AddChain() {
  const req = add_chain_request.value
  if (!req) {
    return (
      <main className="p-4 w-80 text-sm text-gray-500">
        No add-chain request pending.
      </main>
    )
  }
  const { chain } = req
  return (
    <main className="flex flex-col gap-3 p-4 w-80 text-base">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-bold leading-tight">
          Add a new chain?
        </h1>
        <p className="text-xs text-gray-500">
          EIP-3085 — a site is asking your wallet to know
          this chain.
        </p>
      </header>
      <section className="rounded-md border-2 border-[#FF5005] bg-[color-mix(in_srgb,#FF5005_8%,#faf5f0)] p-3 flex flex-col gap-2 text-sm">
        <Row label="Name" value={chain.chainName} />
        <Row label="Chain ID" value={chain.chainId} />
        <Row
          label="Native"
          value={`${chain.nativeCurrency.name} (${chain.nativeCurrency.symbol})`}
        />
        <Row
          label="RPC"
          value={chain.rpcUrls[0] ?? "(none)"}
        />
        {chain.blockExplorerUrls?.[0] && (
          <Row
            label="Explorer"
            value={chain.blockExplorerUrls[0]}
          />
        )}
      </section>
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => {
            const response: AddChainApprovedResponse = {
              id: req.id,
              type: "ETHERNAUTA_RESPONSE_ADD_CHAIN_APPROVED",
            }
            chrome.runtime.sendMessage(response)
            window.close()
          }}
        >
          Approve
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

function Row({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span className="font-mono break-all">{value}</span>
    </div>
  )
}
