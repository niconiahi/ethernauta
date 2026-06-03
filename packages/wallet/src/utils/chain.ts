import { ChainSchema as RegistryChainSchema } from "@ethernauta/chain"
import { eip155_1 } from "@ethernauta/chain/eip155-1"
import {
  create_reader,
  create_writer,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { signal } from "@preact/signals"
import {
  array,
  type InferOutput,
  number,
  object,
  optional,
  parse,
  record,
  safeParse,
  string,
} from "valibot"
import {
  CHAIN_LOADERS,
  type ChainModule,
} from "./chain-loaders"
import { make_notification } from "./event"

// Wallet-side Chain shape — the *materialized* form persisted
// in chrome.storage and read sync by views. Distinct from the
// registry's full Chain (in `@ethernauta/chain`) which carries
// faucets, explorers, slip44, etc. that the wallet doesn't need
// in hot paths.
export const ChainSchema = object({
  id: number(),
  name: string(),
  rpc_url: string(),
})
export type Chain = InferOutput<typeof ChainSchema>

function to_local_chain(
  registry: InferOutput<typeof RegistryChainSchema>,
): Chain | undefined {
  const rpc_url = registry.rpc[0]
  if (!rpc_url) return undefined
  return {
    id: registry.chainId,
    name: registry.name,
    rpc_url,
  }
}

const MAINNET = to_local_chain(eip155_1) ?? {
  id: 1,
  name: "Ethereum Mainnet",
  rpc_url: "https://ethereum-rpc.publicnode.com",
}

export const selected_chain = signal<Chain>(MAINNET)
export const past_chains = signal<Chain[]>([])

const STORAGE_KEY_SELECTED = "selected_chain"
const STORAGE_KEY_PAST = "past_chains"

const StorageShapeSchema = object({
  [STORAGE_KEY_SELECTED]: optional(ChainSchema),
  [STORAGE_KEY_PAST]: optional(array(ChainSchema)),
})

export async function restore_chain(): Promise<void> {
  const raw = await chrome.storage.local.get([
    STORAGE_KEY_SELECTED,
    STORAGE_KEY_PAST,
  ])
  const result = safeParse(StorageShapeSchema, raw)
  if (!result.success) return
  const stored_selected =
    result.output[STORAGE_KEY_SELECTED]
  const stored_past = result.output[STORAGE_KEY_PAST]
  if (stored_selected)
    selected_chain.value = stored_selected
  if (stored_past) past_chains.value = stored_past
}

async function persist_chain(): Promise<void> {
  await chrome.storage.local.set({
    [STORAGE_KEY_SELECTED]: selected_chain.value,
    [STORAGE_KEY_PAST]: past_chains.value,
  })
}

const NAMESPACE = "eip155"

export function get_chain_id(chain: Chain) {
  return encode_chain_id({
    namespace: NAMESPACE,
    reference: chain.id,
  })
}

export function get_reader(chain: Chain) {
  const chain_id = get_chain_id(chain)
  return {
    chain_id,
    reader: create_reader([
      {
        chainId: chain_id,
        transports: [http(chain.rpc_url)],
      },
    ]),
  }
}

export function get_writer(chain: Chain) {
  const chain_id = get_chain_id(chain)
  return {
    chain_id,
    writer: create_writer([
      {
        chainId: chain_id,
        transports: [http(chain.rpc_url)],
      },
    ]),
  }
}

export function to_provider_chain_id(
  chain: Chain,
): `0x${string}` {
  return `0x${chain.id.toString(16)}`
}

// `chain-loaders.ts` ships an `import.meta.glob` over the
// chain registry — Vite/Rollup code-splits each chain into
// its own chunk in production, so the wallet's initial
// bundle stays small and we only pay the per-chain cost on
// first lookup. Bare-specifier `import(\`@scope/pkg/sub-${id}\`)`
// would semantically be cleaner but doesn't code-split in
// production builds because subpath exports can't be
// statically enumerated by the bundler.
//
// In dev (`vite build --watch --mode development`), the
// extension's `vite.extension.config.ts` adds a manualChunks
// rule that groups every chain module into a single
// `chains` chunk — so the dev build emits 1 chain chunk
// instead of ~2,600 per-chain chunks. Trade-off: all chains
// load together (~268 KB), acceptable for the dev iteration
// loop. Production keeps per-chain splitting.
async function load_chain_module(
  chain_id: number,
): Promise<ChainModule | undefined> {
  const loader =
    CHAIN_LOADERS[
      `../../../chain/src/chain/eip155/eip155-${chain_id}.ts`
    ]
  if (!loader) return undefined
  try {
    return await loader()
  } catch {
    return undefined
  }
}

// Dynamic lookup against `@ethernauta/chain`'s 2,600+ chain
// registry. Returns undefined when the id has no registry
// entry or the chain has no usable RPC — that's the "no
// preview, no existence" signal for the chain picker UX.
export async function find_chain(
  chain_id: number,
): Promise<Chain | undefined> {
  const raw_module = await load_chain_module(chain_id)
  if (!raw_module) return undefined
  try {
    const ModuleSchema = record(
      string(),
      RegistryChainSchema,
    )
    const parsed_module = parse(ModuleSchema, raw_module)
    const registry = parsed_module[`eip155_${chain_id}`]
    if (!registry) return undefined
    return to_local_chain(registry)
  } catch {
    return undefined
  }
}

// Activate a chain — updates the popup's selected_chain
// signal, pushes onto the recents list (move-to-front,
// dedupe), persists both to chrome.storage, and fires a
// notification the page-context provider listens for so it
// can call provider.emit("chainChanged") for every connected
// dapp.
export async function select_chain(
  chain: Chain,
): Promise<void> {
  selected_chain.value = chain
  const others = past_chains.value.filter(
    (entry) => entry.id !== chain.id,
  )
  past_chains.value = [chain, ...others]
  await persist_chain()
  // EIP-1193 chainChanged event ridden on a JSON-RPC
  // notification — same method name end-to-end (popup →
  // background → content script → page-context → dapp).
  chrome.runtime.sendMessage(
    make_notification("chainChanged", [
      to_provider_chain_id(chain),
    ]),
  )
}

// Parse user input into a numeric chain id. Accepts:
//   - decimal:  "1"
//   - hex:      "0x1"
//   - CAIP-2:   "eip155:1"
// Returns undefined when the input doesn't match any of
// those shapes.
export function parse_chain_input(
  input: string,
): number | undefined {
  const trimmed = input.trim()
  if (trimmed === "") return undefined
  const caip = /^eip155:(\d+)$/.exec(trimmed)
  if (caip) return Number(caip[1])
  if (/^0x[0-9a-fA-F]+$/.test(trimmed))
    return Number.parseInt(trimmed.slice(2), 16)
  if (/^\d+$/.test(trimmed)) return Number(trimmed)
  return undefined
}
