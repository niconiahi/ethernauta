// Vendor OP Stack predeploy + bridge ABIs from
// ethereum-optimism/optimism at a pinned SHA. Run when bumping to a
// newer op-contracts tag.
//
// Usage:  pnpm --filter @ethernauta/op pull-contracts
//
// Outputs:
//   packages/op/src/predeploys/<kebab>/<Pascal>.abi.json
//   packages/op/src/bridge/<kebab>/<Pascal>.abi.json
//
// Bump cadence: refresh on every new op-contracts/vN.0.0 stable release
// (roughly quarterly). RC tags do not qualify. The SHA below is mirrored
// in packages/op/src/predeploys/SOURCES.md and
// packages/op/src/bridge/SOURCES.md — keep them in sync.

import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import {
  type Description,
  DescriptionSchema,
} from "@ethernauta/abi"
import {
  array,
  type InferOutput,
  object,
  optional,
  parse,
  string,
} from "valibot"

// Pinned upstream version. Update SOURCES.md when this changes.
const OP_CONTRACTS_VERSION = "op-contracts/v6.0.0"
const OP_CONTRACTS_SHA =
  "018f5ae926ec3277746b56a1c4ddb715c568603d"

const ABI_BASE_URL = `https://raw.githubusercontent.com/ethereum-optimism/optimism/${OP_CONTRACTS_SHA}/packages/contracts-bedrock/snapshots/abi`

const AbiSchema = array(DescriptionSchema)

const RecipeSchema = object({
  pascal: string(),
  kebab: string(),
  function_allowlist: optional(array(string())),
})
type Recipe = InferOutput<typeof RecipeSchema>

const PREDEPLOY_RECIPES = [
  parse(RecipeSchema, {
    pascal: "GasPriceOracle",
    kebab: "gas-price-oracle",
  }),
  parse(RecipeSchema, {
    pascal: "L1Block",
    kebab: "l1-block",
  }),
  parse(RecipeSchema, {
    pascal: "L2CrossDomainMessenger",
    kebab: "l2-cross-domain-messenger",
  }),
  parse(RecipeSchema, {
    pascal: "L2StandardBridge",
    kebab: "l2-standard-bridge",
  }),
  parse(RecipeSchema, {
    pascal: "L1FeeVault",
    kebab: "l1-fee-vault",
  }),
  parse(RecipeSchema, {
    pascal: "SequencerFeeVault",
    kebab: "sequencer-fee-vault",
  }),
]

// Slice 2 vendors the fault-proofs L1 contract set rather than
// the pre-fault-proofs `OptimismPortal` + `L2OutputOracle` pair.
// OP Sepolia / Mainnet are both on fault proofs (op-contracts v3
// / v6); `L2OutputOracle` is no longer deployed. The proxy at
// the canonical "OptimismPortal" address points at
// `OptimismPortal2`; we vendor the impl ABI and refer to the
// proxy by its canonical name in addresses + docs. See
// `packages/op/src/bridge/SOURCES.md` for the per-file mapping.
const BRIDGE_RECIPES = [
  parse(RecipeSchema, {
    pascal: "L1StandardBridge",
    kebab: "l1-standard-bridge",
  }),
  parse(RecipeSchema, {
    pascal: "OptimismPortal2",
    kebab: "optimism-portal",
  }),
  parse(RecipeSchema, {
    pascal: "DisputeGameFactory",
    kebab: "dispute-game-factory",
  }),
  parse(RecipeSchema, {
    pascal: "FaultDisputeGame",
    kebab: "fault-dispute-game",
  }),
  parse(RecipeSchema, {
    pascal: "AnchorStateRegistry",
    kebab: "anchor-state-registry",
  }),
  parse(RecipeSchema, {
    pascal: "L2ToL1MessagePasser",
    kebab: "l2-to-l1-message-passer",
  }),
]

function apply_subset(
  entries: Description[],
  allowlist: ReadonlySet<string>,
) {
  return entries.filter((entry) => {
    if (entry.type !== "function") return true
    return allowlist.has(entry.name)
  })
}

async function fetch_abi(pascal: string) {
  const url = `${ABI_BASE_URL}/${pascal}.json`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `failed to fetch ${url}: ${response.status} ${response.statusText}`,
    )
  }
  const raw = await response.json()
  return parse(AbiSchema, raw)
}

async function vendor_one(
  recipe: Recipe,
  target_root: string,
) {
  const upstream = await fetch_abi(recipe.pascal)
  const allowlist = recipe.function_allowlist
    ? new Set(recipe.function_allowlist)
    : undefined
  const out = allowlist
    ? apply_subset(upstream, allowlist)
    : upstream
  const out_dir = join(target_root, recipe.kebab)
  mkdirSync(out_dir, { recursive: true })
  const out_path = join(
    out_dir,
    `${recipe.pascal}.abi.json`,
  )
  writeFileSync(
    out_path,
    `${JSON.stringify(out, null, 2)}\n`,
  )
  const upstream_functions = upstream.filter(
    (e) => e.type === "function",
  ).length
  const kept_functions = out.filter(
    (e) => e.type === "function",
  ).length
  return {
    kept: kept_functions,
    dropped: upstream_functions - kept_functions,
  }
}

async function main() {
  const here = dirname(fileURLToPath(import.meta.url))
  const predeploys_root = resolve(
    here,
    "..",
    "src",
    "predeploys",
  )
  const bridge_root = resolve(here, "..", "src", "bridge")
  console.log(
    `Pulling OP Stack predeploys from ${OP_CONTRACTS_VERSION} (${OP_CONTRACTS_SHA.slice(0, 12)}…)`,
  )
  for (const recipe of PREDEPLOY_RECIPES) {
    const { kept, dropped } = await vendor_one(
      recipe,
      predeploys_root,
    )
    const note = dropped > 0 ? ` (dropped ${dropped})` : ""
    console.log(
      `  ${recipe.pascal} → predeploys/${recipe.kebab}/${recipe.pascal}.abi.json — ${kept} functions${note}`,
    )
  }
  console.log(
    `Pulling OP Stack bridge ABIs from ${OP_CONTRACTS_VERSION} (${OP_CONTRACTS_SHA.slice(0, 12)}…)`,
  )
  for (const recipe of BRIDGE_RECIPES) {
    const { kept, dropped } = await vendor_one(
      recipe,
      bridge_root,
    )
    const note = dropped > 0 ? ` (dropped ${dropped})` : ""
    console.log(
      `  ${recipe.pascal} → bridge/${recipe.kebab}/${recipe.pascal}.abi.json — ${kept} functions${note}`,
    )
  }
  console.log(
    "Done. Run `pnpm exec ethernauta abi` to regenerate methods/.",
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
