// Vendor OP Stack predeploy + bridge ABIs from upstream repos at
// pinned SHA/tag. Two source modes are supported, selected per recipe:
//
//   source: "snapshot-json"      — fetch the pre-compiled ABI JSON
//                                   from `ethereum-optimism/optimism`'s
//                                   `packages/contracts-bedrock/snapshots/abi/`
//                                   folder. Used for every contract the OP
//                                   team chose to snapshot.
//   source: "forge-from-github"  — download a repo tarball at a pinned
//                                   ref, extract a source subtree into a
//                                   temp foundry workspace, optionally
//                                   `forge install` OpenZeppelin, and
//                                   `forge inspect <Pascal> abi --json`.
//                                   Used for contracts the OP team did not
//                                   snapshot (WETH9, EAS, …) and for
//                                   non-OP repos.
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

import { execFileSync } from "node:child_process"
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import {
  type Description,
  DescriptionSchema,
} from "@ethernauta/abi"
import {
  array,
  type InferOutput,
  literal,
  number,
  object,
  optional,
  parse,
  string,
  variant,
} from "valibot"

// Pinned upstream version. Update SOURCES.md when this changes.
const OP_CONTRACTS_VERSION = "op-contracts/v6.0.0"
const OP_CONTRACTS_SHA =
  "018f5ae926ec3277746b56a1c4ddb715c568603d"

const SNAPSHOT_ABI_BASE_URL = `https://raw.githubusercontent.com/ethereum-optimism/optimism/${OP_CONTRACTS_SHA}/packages/contracts-bedrock/snapshots/abi`

const DEFAULT_SOLC = "0.8.25"

const AbiSchema = array(DescriptionSchema)

const SnapshotJsonRecipeSchema = object({
  source: literal("snapshot-json"),
  pascal: string(),
  kebab: string(),
  function_allowlist: optional(array(string())),
})
type SnapshotJsonRecipe = InferOutput<
  typeof SnapshotJsonRecipeSchema
>

const ForgeFromGithubRecipeSchema = object({
  source: literal("forge-from-github"),
  pascal: string(),
  kebab: string(),
  repo: string(), // "owner/name"
  ref: string(), // SHA or tag — pinned for reproducibility
  // Subtree of the tarball that becomes foundry's `src/`. Example:
  // "packages/contracts-bedrock/src". The contract being inspected
  // lives somewhere underneath; all intra-repo imports resolve to
  // siblings under this subtree.
  src_subtree: string(),
  solc: optional(string()),
  // OpenZeppelin git ref for `forge install`. Set only when the
  // contract imports `@openzeppelin/contracts/*`. Default skips the
  // install entirely.
  oz_pin: optional(string()),
  function_allowlist: optional(array(string())),
})
type ForgeFromGithubRecipe = InferOutput<
  typeof ForgeFromGithubRecipeSchema
>

const RecipeSchema = variant("source", [
  SnapshotJsonRecipeSchema,
  ForgeFromGithubRecipeSchema,
])
type Recipe = InferOutput<typeof RecipeSchema>

const PREDEPLOY_RECIPES: Recipe[] = [
  parse(RecipeSchema, {
    source: "snapshot-json",
    pascal: "GasPriceOracle",
    kebab: "gas-price-oracle",
  }),
  parse(RecipeSchema, {
    source: "snapshot-json",
    pascal: "L1Block",
    kebab: "l1-block",
  }),
  parse(RecipeSchema, {
    source: "snapshot-json",
    pascal: "L2CrossDomainMessenger",
    kebab: "l2-cross-domain-messenger",
  }),
  parse(RecipeSchema, {
    source: "snapshot-json",
    pascal: "L2StandardBridge",
    kebab: "l2-standard-bridge",
  }),
  parse(RecipeSchema, {
    source: "snapshot-json",
    pascal: "L1FeeVault",
    kebab: "l1-fee-vault",
  }),
  parse(RecipeSchema, {
    source: "snapshot-json",
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
const BRIDGE_RECIPES: Recipe[] = [
  parse(RecipeSchema, {
    source: "snapshot-json",
    pascal: "L1StandardBridge",
    kebab: "l1-standard-bridge",
  }),
  parse(RecipeSchema, {
    source: "snapshot-json",
    pascal: "OptimismPortal2",
    kebab: "optimism-portal",
  }),
  parse(RecipeSchema, {
    source: "snapshot-json",
    pascal: "DisputeGameFactory",
    kebab: "dispute-game-factory",
  }),
  parse(RecipeSchema, {
    source: "snapshot-json",
    pascal: "FaultDisputeGame",
    kebab: "fault-dispute-game",
  }),
  parse(RecipeSchema, {
    source: "snapshot-json",
    pascal: "AnchorStateRegistry",
    kebab: "anchor-state-registry",
  }),
  parse(RecipeSchema, {
    source: "snapshot-json",
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

const VendorResultSchema = object({
  kept: number(),
  dropped: number(),
})
type VendorResult = InferOutput<typeof VendorResultSchema>

const ForgeWorkspaceSchema = object({
  root: string(),
  src_path: string(),
})
type ForgeWorkspace = InferOutput<
  typeof ForgeWorkspaceSchema
>

async function fetch_text(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `failed to fetch ${url}: ${response.status} ${response.statusText}`,
    )
  }
  return await response.text()
}

async function fetch_bytes(url: string): Promise<Buffer> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `failed to fetch ${url}: ${response.status} ${response.statusText}`,
    )
  }
  const ab = await response.arrayBuffer()
  return Buffer.from(ab)
}

async function vendor_snapshot_json(
  recipe: SnapshotJsonRecipe,
  target_root: string,
): Promise<VendorResult> {
  const url = `${SNAPSHOT_ABI_BASE_URL}/${recipe.pascal}.json`
  const raw = JSON.parse(await fetch_text(url))
  const upstream = parse(AbiSchema, raw)
  const allowlist = recipe.function_allowlist
    ? new Set(recipe.function_allowlist)
    : undefined
  const out = allowlist
    ? apply_subset(upstream, allowlist)
    : upstream
  write_abi_json(
    target_root,
    recipe.kebab,
    recipe.pascal,
    out,
  )
  return count(upstream, out)
}

// `forge-from-github` workspaces are reused across recipes that share
// the same (repo, ref) pin. The same OP repo at the same SHA is the
// source for ~12 predeploys in sub-surface 2 — vendoring the tarball
// once and inspecting many contracts inside it is the right shape.
const FORGE_WORKSPACES = new Map<string, ForgeWorkspace>()
const FORGE_WORKSPACE_PATHS: string[] = []

async function ensure_forge_workspace(
  recipe: ForgeFromGithubRecipe,
): Promise<ForgeWorkspace> {
  const key = `${recipe.repo}@${recipe.ref}`
  const cached = FORGE_WORKSPACES.get(key)
  if (cached) return cached
  const work = mkdtempSync(
    join(
      tmpdir(),
      `ethernauta-op-${recipe.repo.replace(/[^a-z0-9]/gi, "-")}-`,
    ),
  )
  FORGE_WORKSPACE_PATHS.push(work)
  const tarball_url = `https://codeload.github.com/${recipe.repo}/tar.gz/${recipe.ref}`
  const tarball = await fetch_bytes(tarball_url)
  const repo_dir = join(work, "repo")
  mkdirSync(repo_dir, { recursive: true })
  execFileSync(
    "tar",
    ["-xzf", "-", "-C", repo_dir, "--strip-components=1"],
    { input: tarball, maxBuffer: 512 * 1024 * 1024 },
  )
  const src_path = join(repo_dir, recipe.src_subtree)
  if (!existsSync(src_path)) {
    throw new Error(
      `subtree ${recipe.src_subtree} missing from ${recipe.repo}@${recipe.ref}`,
    )
  }
  const remappings: string[] = []
  if (recipe.oz_pin) {
    // forge install needs the workspace to look like a git repo when
    // we don't pass --no-git, and we don't want to leave one behind.
    execFileSync(
      "forge",
      [
        "install",
        "--no-commit",
        "--no-git",
        `OpenZeppelin/openzeppelin-contracts@${recipe.oz_pin}`,
      ],
      { cwd: work, stdio: "inherit" },
    )
    remappings.push(
      "@openzeppelin/=lib/openzeppelin-contracts/",
    )
  }
  const src_rel = `repo/${recipe.src_subtree}`
  const solc = recipe.solc ?? DEFAULT_SOLC
  writeFileSync(
    join(work, "foundry.toml"),
    [
      "[profile.default]",
      `src = "${src_rel}"`,
      'out = "out"',
      `solc = "${solc}"`,
      `remappings = [${remappings.map((r) => `"${r}"`).join(", ")}]`,
      "",
    ].join("\n"),
  )
  const workspace = { root: work, src_path }
  FORGE_WORKSPACES.set(key, workspace)
  return workspace
}

async function vendor_forge_from_github(
  recipe: ForgeFromGithubRecipe,
  target_root: string,
): Promise<VendorResult> {
  const workspace = await ensure_forge_workspace(recipe)
  const stdout = execFileSync(
    "forge",
    ["inspect", recipe.pascal, "abi", "--json"],
    { cwd: workspace.root, encoding: "utf8" },
  )
  const upstream = parse(AbiSchema, JSON.parse(stdout))
  const allowlist = recipe.function_allowlist
    ? new Set(recipe.function_allowlist)
    : undefined
  const out = allowlist
    ? apply_subset(upstream, allowlist)
    : upstream
  write_abi_json(
    target_root,
    recipe.kebab,
    recipe.pascal,
    out,
  )
  return count(upstream, out)
}

function write_abi_json(
  target_root: string,
  kebab: string,
  pascal: string,
  abi: Description[],
): void {
  const out_dir = join(target_root, kebab)
  mkdirSync(out_dir, { recursive: true })
  writeFileSync(
    join(out_dir, `${pascal}.abi.json`),
    `${JSON.stringify(abi, null, 2)}\n`,
  )
}

function count(
  upstream: Description[],
  out: Description[],
): VendorResult {
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

async function vendor_one(
  recipe: Recipe,
  target_root: string,
): Promise<VendorResult> {
  if (recipe.source === "snapshot-json") {
    return await vendor_snapshot_json(recipe, target_root)
  }
  return await vendor_forge_from_github(recipe, target_root)
}

function describe_source(recipe: Recipe): string {
  if (recipe.source === "snapshot-json") {
    return `${OP_CONTRACTS_VERSION} (${OP_CONTRACTS_SHA.slice(0, 12)}…)`
  }
  return `${recipe.repo}@${recipe.ref.slice(0, 12)}…`
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
  try {
    console.log("Pulling OP Stack predeploys")
    for (const recipe of PREDEPLOY_RECIPES) {
      const { kept, dropped } = await vendor_one(
        recipe,
        predeploys_root,
      )
      const note =
        dropped > 0 ? ` (dropped ${dropped})` : ""
      console.log(
        `  ${recipe.pascal} [${recipe.source}] ← ${describe_source(recipe)} → predeploys/${recipe.kebab}/${recipe.pascal}.abi.json — ${kept} functions${note}`,
      )
    }
    console.log("Pulling OP Stack bridge ABIs")
    for (const recipe of BRIDGE_RECIPES) {
      const { kept, dropped } = await vendor_one(
        recipe,
        bridge_root,
      )
      const note =
        dropped > 0 ? ` (dropped ${dropped})` : ""
      console.log(
        `  ${recipe.pascal} [${recipe.source}] ← ${describe_source(recipe)} → bridge/${recipe.kebab}/${recipe.pascal}.abi.json — ${kept} functions${note}`,
      )
    }
    console.log(
      "Done. Run `pnpm exec ethernauta abi` to regenerate methods/.",
    )
  } finally {
    for (const path of FORGE_WORKSPACE_PATHS) {
      rmSync(path, { recursive: true, force: true })
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
