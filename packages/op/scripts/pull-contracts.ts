// Vendor OP Stack predeploy + bridge ABIs from upstream repos at
// pinned SHA/tag. Two source modes are supported, selected per recipe:
//
//   source: "snapshot-json"      — fetch the pre-compiled ABI JSON
//                                   from `ethereum-optimism/optimism`'s
//                                   `packages/contracts-bedrock/snapshots/abi/`
//                                   folder. Cheap, no foundry needed.
//   source: "forge-from-github"  — download the upstream repo tarball
//                                   at a pinned ref, drop pinned-ref
//                                   lib tarballs alongside under
//                                   `lib/`, write our own foundry.toml,
//                                   and `forge inspect <Pascal> abi
//                                   --json`. Required when the upstream
//                                   isn't snapshotted (EAS), and used
//                                   for the OP-side sweep in
//                                   op_completeness_pass S2 to exercise
//                                   the mode end-to-end.
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

const ForgeLibSchema = object({
  repo: string(), // "owner/name"
  ref: string(), // SHA or tag
  // Folder name under <project>/lib/. Lets two pins of the same
  // upstream repo coexist (e.g. `openzeppelin-contracts` and
  // `openzeppelin-contracts-v5`).
  dest: string(),
})

const ForgeFromGithubRecipeSchema = object({
  source: literal("forge-from-github"),
  pascal: string(),
  kebab: string(),
  repo: string(),
  ref: string(),
  // Subdir of the tarball that becomes the foundry project root.
  // Our foundry.toml is written here; libs land under
  // <project>/lib/. Use "." for the tarball root.
  project_subtree: string(),
  // Foundry's `src` setting, relative to the project root.
  src_dir: string(),
  // Optional solc pin. When omitted, foundry auto-resolves per-file
  // pragma — required for the OP workspace which mixes 0.8.15 and
  // 0.8.25 across the predeploy set.
  solc: optional(string()),
  // Libraries vendored as tarballs into <project>/lib/<dest>/. No
  // `forge install`, no git submodule — just an extract.
  libs: optional(array(ForgeLibSchema)),
  // Foundry remappings, written verbatim into foundry.toml.
  remappings: optional(array(string())),
  // Path-qualified `forge inspect` argument. When omitted, falls
  // back to `pascal` alone; set to disambiguate when multiple
  // contracts share a name.
  contract_ref: optional(string()),
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

// OP submodule pins at OP_CONTRACTS_SHA, harvested from
// https://api.github.com/repos/ethereum-optimism/optimism/contents/packages/contracts-bedrock/lib?ref=<sha>.
// All submodules are vendored — even ones the 10 predeploys in the
// sweep don't import — because foundry compiles every file under
// `src` + `scripts` (test/ is trimmed) and `src/libraries/Predeploys.sol`
// pulls in `scripts/libraries/Config.sol`, which transitively touches
// most of the lib set. Mirror OP's foundry.toml remappings verbatim.
const OP_WORKSPACE = {
  repo: "ethereum-optimism/optimism",
  ref: OP_CONTRACTS_SHA,
  project_subtree: "packages/contracts-bedrock",
  src_dir: "src",
  libs: [
    {
      repo: "OpenZeppelin/openzeppelin-contracts",
      ref: "ecd2ca2cd7cac116f7a37d0e474bbb3d7d5e1c4d",
      dest: "openzeppelin-contracts",
    },
    {
      repo: "OpenZeppelin/openzeppelin-contracts-upgradeable",
      ref: "0a2cb9a445c365870ed7a8ab461b12acf3e27d63",
      dest: "openzeppelin-contracts-upgradeable",
    },
    {
      repo: "OpenZeppelin/openzeppelin-contracts",
      ref: "dbb6104ce834628e473d2173bbc9d47f81a9eec3",
      dest: "openzeppelin-contracts-v5",
    },
    {
      repo: "transmissions11/solmate",
      ref: "8f9b23f8838670afda0fd8983f2c41e8037ae6bc",
      dest: "solmate",
    },
    {
      repo: "ethereum-optimism/lib-keccak",
      ref: "3b1e7bbb4cc23e9228097cfebe42aedaf3b8f2b9",
      dest: "lib-keccak",
    },
    {
      repo: "Vectorized/solady",
      ref: "502cc1ea718e6fa73b380635ee0868b0740595f0",
      dest: "solady",
    },
    {
      repo: "Vectorized/solady",
      ref: "e0ef35adb0ccd1032794731a995cb599bba7b537",
      dest: "solady-v0.0.245",
    },
    {
      repo: "foundry-rs/forge-std",
      ref: "6853b9ec7df5dc0c213b05ae67785ad4f4baa0ea",
      dest: "forge-std",
    },
    {
      repo: "safe-global/safe-contracts",
      ref: "bf943f80fec5ac647159d26161446ac5d716a294",
      dest: "safe-contracts",
    },
    {
      repo: "runtimeverification/kontrol-cheatcodes",
      ref: "2c48ae1ab44228c199dca29414c0b4b18a3434e6",
      dest: "kontrol-cheatcodes",
    },
  ],
  remappings: [
    "@openzeppelin/contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/contracts",
    "@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts",
    "@openzeppelin/contracts-v5/=lib/openzeppelin-contracts-v5/contracts",
    "@rari-capital/solmate/=lib/solmate",
    "@lib-keccak/=lib/lib-keccak/contracts/lib",
    "@solady/=lib/solady/src",
    "@solady-v0.0.245/=lib/solady-v0.0.245/src",
    "forge-std/=lib/forge-std/src",
    "ds-test/=lib/forge-std/lib/ds-test/src",
    "safe-contracts/=lib/safe-contracts/contracts",
    "kontrol-cheatcodes/=lib/kontrol-cheatcodes/src",
    "interfaces/=interfaces",
  ],
}

// EAS v1.4.0 ships its production layout under `contracts/`. The
// foundry.toml in the tarball pins solc 0.8.28 with a single OZ
// remapping; we match the OZ version EAS itself pins
// (`@openzeppelin/contracts@5.2.0`).
const EAS_CONTRACTS_TAG = "v1.4.0"
const EAS_OZ_REF = "v5.2.0"

const EAS_WORKSPACE = {
  repo: "ethereum-attestation-service/eas-contracts",
  ref: EAS_CONTRACTS_TAG,
  project_subtree: ".",
  src_dir: "contracts",
  solc: "0.8.28",
  libs: [
    {
      repo: "OpenZeppelin/openzeppelin-contracts",
      ref: EAS_OZ_REF,
      dest: "openzeppelin-contracts",
    },
  ],
  remappings: [
    "@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/",
  ],
}

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
  // op_completeness_pass S2 — vendored via foundry+tarball to
  // exercise the forge-from-github mode end-to-end. The same ABIs
  // are also available in OP's `snapshots/abi/` at this SHA; we
  // build from source by design to validate the new mode.
  parse(RecipeSchema, {
    source: "forge-from-github",
    ...OP_WORKSPACE,
    pascal: "WETH",
    kebab: "weth",
    contract_ref: "src/L2/WETH.sol:WETH",
  }),
  parse(RecipeSchema, {
    source: "forge-from-github",
    ...OP_WORKSPACE,
    pascal: "OptimismMintableERC20Factory",
    kebab: "optimism-mintable-erc20-factory",
    contract_ref:
      "src/universal/OptimismMintableERC20Factory.sol:OptimismMintableERC20Factory",
  }),
  parse(RecipeSchema, {
    source: "forge-from-github",
    ...OP_WORKSPACE,
    pascal: "L1BlockNumber",
    kebab: "l1-block-number",
    contract_ref:
      "src/legacy/L1BlockNumber.sol:L1BlockNumber",
  }),
  parse(RecipeSchema, {
    source: "forge-from-github",
    ...OP_WORKSPACE,
    pascal: "L2ERC721Bridge",
    kebab: "l2-erc721-bridge",
    contract_ref:
      "src/L2/L2ERC721Bridge.sol:L2ERC721Bridge",
  }),
  parse(RecipeSchema, {
    source: "forge-from-github",
    ...OP_WORKSPACE,
    pascal: "OptimismMintableERC721Factory",
    kebab: "optimism-mintable-erc721-factory",
    contract_ref:
      "src/L2/OptimismMintableERC721Factory.sol:OptimismMintableERC721Factory",
  }),
  parse(RecipeSchema, {
    source: "forge-from-github",
    ...OP_WORKSPACE,
    pascal: "ProxyAdmin",
    kebab: "proxy-admin",
    contract_ref: "src/universal/ProxyAdmin.sol:ProxyAdmin",
  }),
  parse(RecipeSchema, {
    source: "forge-from-github",
    ...OP_WORKSPACE,
    pascal: "BaseFeeVault",
    kebab: "base-fee-vault",
    contract_ref: "src/L2/BaseFeeVault.sol:BaseFeeVault",
  }),
  parse(RecipeSchema, {
    source: "forge-from-github",
    ...OP_WORKSPACE,
    pascal: "GovernanceToken",
    kebab: "governance-token",
    contract_ref:
      "src/governance/GovernanceToken.sol:GovernanceToken",
  }),
  parse(RecipeSchema, {
    source: "forge-from-github",
    ...OP_WORKSPACE,
    pascal: "LegacyMessagePasser",
    kebab: "legacy-message-passer",
    contract_ref:
      "src/legacy/LegacyMessagePasser.sol:LegacyMessagePasser",
  }),
  parse(RecipeSchema, {
    source: "forge-from-github",
    ...OP_WORKSPACE,
    pascal: "DeployerWhitelist",
    kebab: "deployer-whitelist",
    contract_ref:
      "src/legacy/DeployerWhitelist.sol:DeployerWhitelist",
  }),
  parse(RecipeSchema, {
    source: "forge-from-github",
    ...EAS_WORKSPACE,
    pascal: "SchemaRegistry",
    kebab: "schema-registry",
    contract_ref:
      "contracts/SchemaRegistry.sol:SchemaRegistry",
  }),
  parse(RecipeSchema, {
    source: "forge-from-github",
    ...EAS_WORKSPACE,
    pascal: "EAS",
    kebab: "eas",
    contract_ref: "contracts/EAS.sol:EAS",
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
  execFileSync(
    "tar",
    ["-xzf", "-", "-C", work, "--strip-components=1"],
    { input: tarball, maxBuffer: 512 * 1024 * 1024 },
  )
  const project =
    recipe.project_subtree === "."
      ? work
      : join(work, recipe.project_subtree)
  if (!existsSync(project)) {
    throw new Error(
      `project_subtree ${recipe.project_subtree} missing from ${recipe.repo}@${recipe.ref}`,
    )
  }
  // Foundry compiles every Solidity file under `src` + `script` +
  // `test` by default. OP's `src/libraries/Predeploys.sol` imports
  // from `scripts/libraries/Config.sol` so the scripts/ tree is part
  // of the compile graph and can't be trimmed; only `test/` is safe
  // to drop. `forge-artifacts/` and `cache/` won't exist in a fresh
  // tarball.
  const test_path = join(project, "test")
  if (existsSync(test_path)) {
    rmSync(test_path, { recursive: true, force: true })
  }
  const lib_dir = join(project, "lib")
  mkdirSync(lib_dir, { recursive: true })
  for (const lib of recipe.libs ?? []) {
    const lib_path = join(lib_dir, lib.dest)
    // The OP tarball ships empty `lib/<submodule>/` placeholders for
    // every gitlinked submodule. Wipe them before extracting our
    // pinned tarball into the same path.
    if (existsSync(lib_path)) {
      rmSync(lib_path, { recursive: true, force: true })
    }
    mkdirSync(lib_path, { recursive: true })
    const lib_tarball = await fetch_bytes(
      `https://codeload.github.com/${lib.repo}/tar.gz/${lib.ref}`,
    )
    execFileSync(
      "tar",
      ["-xzf", "-", "-C", lib_path, "--strip-components=1"],
      { input: lib_tarball, maxBuffer: 256 * 1024 * 1024 },
    )
  }
  const remappings = recipe.remappings ?? []
  const lines = [
    "[profile.default]",
    `src = "${recipe.src_dir}"`,
    'out = "out"',
  ]
  if (recipe.solc) lines.push(`solc = "${recipe.solc}"`)
  lines.push(
    `remappings = [${remappings.map((r) => `"${r}"`).join(", ")}]`,
    "",
  )
  writeFileSync(
    join(project, "foundry.toml"),
    lines.join("\n"),
  )
  const workspace = {
    root: project,
    src_path: join(project, recipe.src_dir),
  }
  FORGE_WORKSPACES.set(key, workspace)
  return workspace
}

async function vendor_forge_from_github(
  recipe: ForgeFromGithubRecipe,
  target_root: string,
): Promise<VendorResult> {
  const workspace = await ensure_forge_workspace(recipe)
  const arg = recipe.contract_ref ?? recipe.pascal
  const stdout = execFileSync(
    "forge",
    ["inspect", arg, "abi", "--json"],
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
