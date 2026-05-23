// https://eips.ethereum.org/EIPS/eip-5792
//
// Background-side helpers: compose ERC-5792 capability and
// status responses from the chrome.storage.session batch
// registry. Live in src/utils so the manifest entry can
// import them via vite-tsconfig-paths.

import {
  CALLS_STATUS,
  type CallsReceipt,
  type CallsStatus,
  type CallsStatusCode,
  type Capabilities,
} from "@ethernauta/eip/5792"
import { eth_getTransactionReceipt } from "@ethernauta/eth"
import {
  type BatchRecord,
  get_batch,
} from "./calls-registry"
import { CHAINS, get_chain, get_reader } from "./chain"

const CALLS_STATUS_VERSION = "2.0.0"

function to_chain_ref(chain_id_hex: `0x${string}`): number {
  return Number.parseInt(chain_id_hex.slice(2), 16)
}

export function compose_capabilities(): Capabilities {
  const capabilities: Capabilities = {}
  for (const chain of CHAINS) {
    const key =
      `0x${chain.id.toString(16)}` as `0x${string}`
    capabilities[key] = {
      atomic: { status: "unsupported" },
    }
  }
  return capabilities
}

export async function compose_calls_status(
  id: string,
): Promise<CallsStatus> {
  const batch = await get_batch(id)
  if (!batch) {
    throw new Error(`unknown batch id: ${id}`)
  }
  const chain = get_chain(to_chain_ref(batch.chainId))
  if (!chain) {
    throw new Error(
      `unknown chain for batch: ${batch.chainId}`,
    )
  }
  const { chain_id, reader } = get_reader(chain)
  const receipts = await Promise.all(
    batch.transaction_hashes.map(
      async (transaction_hash) => {
        const receipt = await eth_getTransactionReceipt([
          transaction_hash,
        ])(reader({ chain_id }))
        return { transaction_hash, receipt }
      },
    ),
  )
  return finalize_status(batch, receipts)
}

export function finalize_status(
  batch: BatchRecord,
  receipts: Array<{
    transaction_hash: `0x${string}`
    receipt: Awaited<
      ReturnType<
        ReturnType<typeof eth_getTransactionReceipt>
      >
    >
  }>,
): CallsStatus {
  const found = receipts.filter((r) => r.receipt !== null)
  const all_mined = found.length === receipts.length
  const status_code = compute_status_code(receipts)
  const composed_receipts: CallsReceipt[] = found
    .map((r) => to_calls_receipt(r.receipt))
    .filter((r): r is CallsReceipt => r !== null)
  return {
    version: CALLS_STATUS_VERSION,
    id: batch.id,
    chainId: batch.chainId,
    status: status_code,
    atomic: batch.atomic,
    receipts: all_mined ? composed_receipts : undefined,
  }
}

function compute_status_code(
  receipts: Array<{
    receipt: Awaited<
      ReturnType<
        ReturnType<typeof eth_getTransactionReceipt>
      >
    >
  }>,
): CallsStatusCode {
  let mined = 0
  let succeeded = 0
  let reverted = 0
  for (const { receipt } of receipts) {
    if (receipt === null) continue
    mined += 1
    if (receipt.status === "0x1") succeeded += 1
    else reverted += 1
  }
  if (mined < receipts.length) return CALLS_STATUS.PENDING
  if (reverted === 0) return CALLS_STATUS.CONFIRMED
  if (succeeded === 0) return CALLS_STATUS.REVERTED
  return CALLS_STATUS.PARTIALLY_REVERTED
}

function to_calls_receipt(
  receipt: Awaited<
    ReturnType<ReturnType<typeof eth_getTransactionReceipt>>
  >,
): CallsReceipt | null {
  if (receipt === null) return null
  return {
    logs: receipt.logs.map((log) => ({
      address: log.address,
      topics: log.topics,
      data: log.data,
    })),
    status: (receipt.status ?? "0x0") as `0x${string}`,
    blockHash: receipt.blockHash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed,
    transactionHash: receipt.transactionHash,
  }
}
