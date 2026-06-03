// Vendor zkSync bridge ABIs from matter-labs/era-contracts GitHub
// release tarballs at a pinned tag. Each release publishes
// pre-compiled foundry artifacts as `<workspace>.tar.gz` assets;
// the tarball contains
// `./<workspace>/out/<Contract>.sol/<Contract>.json` hardhat-shape
// artifacts whose `abi` field matches Ethernauta's
// `DescriptionSchema` directly. Same streaming-tar-extraction
// shape as Arbitrum 3a's `vendor_npm_artifact`, repointed from
// the npm registry to GitHub releases.
//
// Usage:  pnpm --filter @ethernauta/zksync pull-contracts
//
// Outputs:
//   packages/zksync/src/bridge/<kebab>/<Pascal>.abi.json
//
// After running, regenerate method bindings:
//   pnpm regen
//
// Bump cadence: refresh on every new non-`zkos-*` matter-labs
// release that ships a Bridgehub / L1Nullifier surface change.
// `zkos-*` tags are a separate experimental track; this pin
// tracks the production Era stream.

import { execFileSync } from "node:child_process"
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { DescriptionSchema } from "@ethernauta/abi"
import {
  array,
  type InferOutput,
  object,
  optional,
  parse,
  string,
} from "valibot"

const ZKSYNC_ERA_CONTRACTS_TAG = "v0.29.2"

// Hardhat artifact slice extracted from each tarball entry.
// The `abi` field is the only piece we keep; everything else
// (bytecode, deployedBytecode, methodIdentifiers, linkReferences,
// …) is foundry build metadata not consumed by Ethernauta.
const HardhatArtifactSchema = object({
  abi: array(DescriptionSchema),
})

const RecipeSchema = object({
  pascal: string(),
  kebab: string(),
  workspace: string(),
  // Per-workspace artifact root. `l1-contracts` ships foundry's
  // `out/` directory; `system-contracts` ships zksolc's
  // `zkout/` directory because L2 system contracts target zkEVM
  // bytecode. The ABI shape is compile-target-independent in
  // both cases. Defaults to `"out"` to keep the L1 recipes
  // unchanged.
  subdir: optional(string()),
})
type Recipe = InferOutput<typeof RecipeSchema>

// Slice 4a vendors the three L1-side bridge contracts from
// the `l1-contracts` workspace tarball. Slice 4c adds two L2
// recipes for the withdraw side: `L2BaseToken` (ETH burn on
// L2) from the `system-contracts` tarball under `zkout/`, and
// `L2AssetRouter` (ERC-20 burn on L2) from the same
// `l1-contracts` tarball under the L2 path.
const RECIPES: Recipe[] = [
  parse(RecipeSchema, {
    pascal: "Bridgehub",
    kebab: "bridgehub",
    workspace: "l1-contracts",
  }),
  parse(RecipeSchema, {
    pascal: "L1Nullifier",
    kebab: "l1-nullifier",
    workspace: "l1-contracts",
  }),
  parse(RecipeSchema, {
    pascal: "L1AssetRouter",
    kebab: "l1-asset-router",
    workspace: "l1-contracts",
  }),
  parse(RecipeSchema, {
    pascal: "L2BaseToken",
    kebab: "l2-base-token",
    workspace: "system-contracts",
    subdir: "zkout",
  }),
  parse(RecipeSchema, {
    pascal: "L2AssetRouter",
    kebab: "l2-asset-router",
    workspace: "l1-contracts",
  }),
]

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

// Cache tarballs in /tmp keyed by (workspace, tag). Each
// workspace tarball is several MB and is consumed by multiple
// recipes; redownloading per recipe would waste bandwidth.
async function get_tarball(
  workspace: string,
): Promise<Buffer> {
  const cache_path = join(
    tmpdir(),
    `ethernauta-zksync-${workspace}-${ZKSYNC_ERA_CONTRACTS_TAG}.tgz`,
  )
  if (existsSync(cache_path)) {
    return readFileSync(cache_path)
  }
  const url = `https://github.com/matter-labs/era-contracts/releases/download/${ZKSYNC_ERA_CONTRACTS_TAG}/${workspace}.tar.gz`
  const bytes = await fetch_bytes(url)
  writeFileSync(cache_path, bytes)
  return bytes
}

// Extract a single file from a gzipped tar. matter-labs release
// tarballs use `./<workspace>/out/<Pascal>.sol/<Pascal>.json` as
// the per-artifact path; the leading `./` is what the tarball
// emits, mirrored in the tar entry argument so `tar` matches.
function extract_artifact(
  tarball: Buffer,
  workspace: string,
  pascal: string,
  subdir: string,
): string {
  const entry = `./${workspace}/${subdir}/${pascal}.sol/${pascal}.json`
  const stdout = execFileSync(
    "tar",
    ["-xzO", "-f", "-", entry],
    {
      input: tarball,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    },
  )
  return stdout
}

async function vendor_github_artifact(
  recipe: Recipe,
  target_root: string,
): Promise<{ kept: number }> {
  const tarball = await get_tarball(recipe.workspace)
  const raw = extract_artifact(
    tarball,
    recipe.workspace,
    recipe.pascal,
    recipe.subdir ?? "out",
  )
  const artifact = parse(
    HardhatArtifactSchema,
    JSON.parse(raw),
  )
  const out_dir = join(target_root, recipe.kebab)
  mkdirSync(out_dir, { recursive: true })
  const out_path = join(
    out_dir,
    `${recipe.pascal}.abi.json`,
  )
  writeFileSync(
    out_path,
    `${JSON.stringify(artifact.abi, null, 2)}\n`,
  )
  const fn_count = artifact.abi.filter(
    (e) => e.type === "function",
  ).length
  return { kept: fn_count }
}

async function main(): Promise<void> {
  const here = dirname(fileURLToPath(import.meta.url))
  const package_root = resolve(here, "..")
  const bridge_root = resolve(package_root, "src", "bridge")
  mkdirSync(bridge_root, { recursive: true })

  console.log(
    `Pulling zkSync bridge ABIs from matter-labs/era-contracts ${ZKSYNC_ERA_CONTRACTS_TAG}`,
  )
  for (const recipe of RECIPES) {
    const { kept } = await vendor_github_artifact(
      recipe,
      bridge_root,
    )
    console.log(
      `  ${recipe.pascal} → bridge/${recipe.kebab}/${recipe.pascal}.abi.json — ${kept} functions`,
    )
  }

  console.log("")
  console.log("Done. Next steps:")
  console.log("  1. pnpm regen")
  console.log(
    "  2. pnpm --filter @ethernauta/zksync lint:fix",
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
