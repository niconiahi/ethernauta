// Vendor Arbitrum precompile interface .sol files from
// OffchainLabs/nitro-precompile-interfaces (a submodule of
// nitro-contracts) and OffchainLabs/nitro-contracts at a pinned
// SHA / tag, then compile each to canonical ABI JSON via foundry.
//
// Usage:  pnpm --filter @ethernauta/arbitrum pull-contracts
//
// Outputs:
//   packages/arbitrum/src/precompiles/<kebab>/<Pascal>.abi.json
//   packages/arbitrum/src/precompiles/<kebab>/address.ts
//   packages/arbitrum/src/precompiles/<kebab>/index.ts
//   packages/arbitrum/src/precompiles/index.ts
//   packages/arbitrum/src/precompiles/SOURCES.md
//
// After running, regenerate method bindings:
//   pnpm --filter @ethernauta/cli build
//   pnpm exec ethernauta abi
//
// Bump cadence: refresh on every new nitro-contracts vN.0.0 stable tag
// (~quarterly). Never track `develop`. The SHA + tag below are mirrored
// in packages/arbitrum/src/precompiles/SOURCES.md — keep them in sync.

import { execFileSync } from "node:child_process"
import {
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
  object,
  parse,
  string,
} from "valibot"

// Pinned upstream version. Update SOURCES.md when this changes.
const NITRO_CONTRACTS_TAG = "v3.2.0"
const NITRO_PRECOMPILE_INTERFACES_SHA =
  "f49a4889b486fd804a7901203f5f663cfd1581c8"

const PRECOMPILE_BASE_URL = `https://raw.githubusercontent.com/OffchainLabs/nitro-precompile-interfaces/${NITRO_PRECOMPILE_INTERFACES_SHA}`
const NITRO_CONTRACTS_BASE_URL = `https://raw.githubusercontent.com/OffchainLabs/nitro-contracts/${NITRO_CONTRACTS_TAG}`

const RecipeSchema = object({
  pascal: string(),
  kebab: string(),
  address: string(),
  url: string(),
})
type Recipe = InferOutput<typeof RecipeSchema>

// 16 precompiles + NodeInterface. ArbosActs is vendored as a .sol for
// documentation purposes only — its dispatcher requires
// `msg.sender == ArbosAddress`, so any dapp call reverts. We emit
// ABI JSON for it too (so the codegen walker still produces methods/
// — the bindings will all revert at runtime, which is the honest
// answer). The plan's D2-3 says skip bindings; we mirror that by
// using a separate skip-list below.
const RECIPES: Recipe[] = [
  parse(RecipeSchema, {
    pascal: "ArbSys",
    kebab: "arb-sys",
    address: "0x0000000000000000000000000000000000000064",
    url: `${PRECOMPILE_BASE_URL}/ArbSys.sol`,
  }),
  parse(RecipeSchema, {
    pascal: "ArbInfo",
    kebab: "arb-info",
    address: "0x0000000000000000000000000000000000000065",
    url: `${PRECOMPILE_BASE_URL}/ArbInfo.sol`,
  }),
  parse(RecipeSchema, {
    pascal: "ArbAddressTable",
    kebab: "arb-address-table",
    address: "0x0000000000000000000000000000000000000066",
    url: `${PRECOMPILE_BASE_URL}/ArbAddressTable.sol`,
  }),
  parse(RecipeSchema, {
    pascal: "ArbBLS",
    kebab: "arb-bls",
    address: "0x0000000000000000000000000000000000000067",
    url: `${PRECOMPILE_BASE_URL}/ArbBLS.sol`,
  }),
  parse(RecipeSchema, {
    pascal: "ArbFunctionTable",
    kebab: "arb-function-table",
    address: "0x0000000000000000000000000000000000000068",
    url: `${PRECOMPILE_BASE_URL}/ArbFunctionTable.sol`,
  }),
  parse(RecipeSchema, {
    pascal: "ArbOwnerPublic",
    kebab: "arb-owner-public",
    address: "0x000000000000000000000000000000000000006B",
    url: `${PRECOMPILE_BASE_URL}/ArbOwnerPublic.sol`,
  }),
  parse(RecipeSchema, {
    pascal: "ArbGasInfo",
    kebab: "arb-gas-info",
    address: "0x000000000000000000000000000000000000006C",
    url: `${PRECOMPILE_BASE_URL}/ArbGasInfo.sol`,
  }),
  parse(RecipeSchema, {
    pascal: "ArbRetryableTx",
    kebab: "arb-retryable-tx",
    address: "0x000000000000000000000000000000000000006E",
    url: `${PRECOMPILE_BASE_URL}/ArbRetryableTx.sol`,
  }),
  parse(RecipeSchema, {
    pascal: "ArbStatistics",
    kebab: "arb-statistics",
    address: "0x000000000000000000000000000000000000006F",
    url: `${PRECOMPILE_BASE_URL}/ArbStatistics.sol`,
  }),
  parse(RecipeSchema, {
    pascal: "ArbOwner",
    kebab: "arb-owner",
    address: "0x0000000000000000000000000000000000000070",
    url: `${PRECOMPILE_BASE_URL}/ArbOwner.sol`,
  }),
  parse(RecipeSchema, {
    pascal: "ArbWasm",
    kebab: "arb-wasm",
    address: "0x0000000000000000000000000000000000000071",
    url: `${PRECOMPILE_BASE_URL}/ArbWasm.sol`,
  }),
  parse(RecipeSchema, {
    pascal: "ArbWasmCache",
    kebab: "arb-wasm-cache",
    address: "0x0000000000000000000000000000000000000072",
    url: `${PRECOMPILE_BASE_URL}/ArbWasmCache.sol`,
  }),
  parse(RecipeSchema, {
    pascal: "ArbNativeTokenManager",
    kebab: "arb-native-token-manager",
    address: "0x0000000000000000000000000000000000000073",
    url: `${PRECOMPILE_BASE_URL}/ArbNativeTokenManager.sol`,
  }),
  parse(RecipeSchema, {
    pascal: "ArbAggregator",
    kebab: "arb-aggregator",
    address: "0x0000000000000000000000000000000000000079",
    url: `${PRECOMPILE_BASE_URL}/ArbAggregator.sol`,
  }),
  parse(RecipeSchema, {
    pascal: "ArbDebug",
    kebab: "arb-debug",
    address: "0x00000000000000000000000000000000000000FF",
    url: `${PRECOMPILE_BASE_URL}/ArbDebug.sol`,
  }),
  parse(RecipeSchema, {
    pascal: "NodeInterface",
    kebab: "node-interface",
    address: "0x00000000000000000000000000000000000000C8",
    url: `${NITRO_CONTRACTS_BASE_URL}/src/node-interface/NodeInterface.sol`,
  }),
]

// ArbosActs is vendored as .sol only — never bound. The dispatcher in
// nitro's ArbOS layer requires `msg.sender == ArbosAddress`, so any
// dapp call reverts unconditionally. See D2-3 in the plan.
const ARBOS_ACTS_URL = `${PRECOMPILE_BASE_URL}/ArbosActs.sol`

const AbiSchema = array(DescriptionSchema)

async function fetch_text(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `failed to fetch ${url}: ${response.status} ${response.statusText}`,
    )
  }
  return await response.text()
}

function write_foundry_toml(root: string): void {
  // Minimal foundry config: tell forge where the sources live and pin
  // solc to 0.8.24 (the version nitro-contracts itself uses at v3.2.0).
  const toml = [
    "[profile.default]",
    'src = "src"',
    'out = "out"',
    'solc = "0.8.24"',
    "",
  ].join("\n")
  writeFileSync(join(root, "foundry.toml"), toml)
}

function inspect_abi(
  root: string,
  pascal: string,
): Description[] {
  // `forge inspect` defaults to a human-readable table; --json emits
  // the canonical foundry ABI array. Run inside the project root so
  // forge picks up our pinned foundry.toml.
  const stdout = execFileSync(
    "forge",
    ["inspect", pascal, "abi", "--json"],
    { cwd: root, encoding: "utf8" },
  )
  return parse(AbiSchema, JSON.parse(stdout))
}

function emit_address_file(
  out_dir: string,
  recipe: Recipe,
): void {
  const content = [
    "// https://docs.arbitrum.io/build-decentralized-apps/precompiles/reference",
    "",
    'import { type Address, AddressSchema } from "@ethernauta/core"',
    'import { parse } from "valibot"',
    "",
    `export const ${recipe.kebab.toUpperCase().replace(/-/g, "_")}_ADDRESS: Address = parse(`,
    "  AddressSchema,",
    `  "${recipe.address}",`,
    ")",
    "",
  ].join("\n")
  writeFileSync(join(out_dir, "address.ts"), content)
}

function emit_folder_index(out_dir: string): void {
  // Each precompile folder re-exports its address + the autogenerated
  // methods/. Method names collide across precompiles (every contract
  // ships a `version()`), so callers consume via subpath:
  //   import { ARB_SYS_ADDRESS } from "@ethernauta/arbitrum/precompiles/arb-sys"
  const content = [
    'export * from "./address"',
    'export * from "./methods"',
    "",
  ].join("\n")
  writeFileSync(join(out_dir, "index.ts"), content)
}

function emit_root_index(
  precompiles_root: string,
  recipes: Recipe[],
): void {
  // Address-only barrel at the root. Method bindings are subpath-only
  // because `version()` etc. collide across precompiles — mirrors the
  // pattern in packages/op/src/predeploys/index.ts.
  const lines = [
    "// Address constants only. Method bindings live behind subpath imports:",
    '//   import { arbBlockNumber } from "@ethernauta/arbitrum/precompiles/arb-sys"',
    "// Method names like `version` are duplicated across precompiles,",
    "// so the per-folder subpath is the only conflict-free way to bring",
    "// them in.",
    ...recipes.map(
      (r) => `export * from "./${r.kebab}/address"`,
    ),
    "",
  ]
  writeFileSync(
    join(precompiles_root, "index.ts"),
    lines.join("\n"),
  )
}

function emit_sources_md(
  precompiles_root: string,
  recipes: Recipe[],
): void {
  const lines = [
    "# Arbitrum precompile + virtual-contract sources",
    "",
    "Interface `.sol` files in this directory are vendored from",
    "OffchainLabs upstream at pinned SHA / tag and compiled to",
    "canonical ABI JSON via `forge inspect`. Do not edit the",
    "`*.abi.json` files by hand — re-run the vendoring script to bump.",
    "",
    "## Pinned upstream",
    "",
    "| Source | Pin |",
    "|---|---|",
    `| [\`OffchainLabs/nitro-precompile-interfaces\`](https://github.com/OffchainLabs/nitro-precompile-interfaces) | SHA \`${NITRO_PRECOMPILE_INTERFACES_SHA}\` (matches \`nitro-contracts ${NITRO_CONTRACTS_TAG}\`) |`,
    `| [\`OffchainLabs/nitro-contracts\`](https://github.com/OffchainLabs/nitro-contracts) | Tag \`${NITRO_CONTRACTS_TAG}\` |`,
    "",
    "Solc version: `0.8.24` (matches `nitro-contracts`'s own",
    "`foundry.toml` at this tag).",
    "",
    "The pin lives at the top of",
    "[`packages/arbitrum/scripts/pull-contracts.ts`](../../scripts/pull-contracts.ts).",
    "Keep this file in lockstep with the constants there.",
    "",
    "## Per-folder mapping",
    "",
    "| Folder | Upstream `.sol` | Precompile address |",
    "|---|---|---|",
    ...recipes.map(
      (r) =>
        `| \`${r.kebab}/${r.pascal}.abi.json\` | \`${r.url.replace(/^https:\/\/raw\.githubusercontent\.com\/[^/]+\/[^/]+\/[^/]+\//, "")}\` | \`${r.address}\` |`,
    ),
    "| \`arbos-acts/ArbosActs.sol\` | \`ArbosActs.sol\` | n/a — system-internal; uncallable by dapps |",
    "",
    "## Skipped bindings",
    "",
    "- **`ArbosActs`** — vendored as `.sol` for documentation only.",
    "  The dispatcher requires `msg.sender == ArbosAddress`, so any",
    "  dapp call reverts unconditionally regardless of permission.",
    "  See D2-3 in `tmp/plans/03_arbitrum_package/README.md`.",
    "- **`ArbosTest`** — out of scope; devnet test contract not enumerated",
    "  in the slice 4 plan.",
    "",
  ]
  writeFileSync(
    join(precompiles_root, "SOURCES.md"),
    lines.join("\n"),
  )
}

async function main() {
  const here = dirname(fileURLToPath(import.meta.url))
  const package_root = resolve(here, "..")
  const precompiles_root = resolve(
    package_root,
    "src",
    "precompiles",
  )

  console.log(
    "Pulling Arbitrum precompiles + NodeInterface from",
  )
  console.log(
    `  nitro-precompile-interfaces @ ${NITRO_PRECOMPILE_INTERFACES_SHA.slice(0, 12)}…`,
  )
  console.log(`  nitro-contracts @ ${NITRO_CONTRACTS_TAG}`)

  // Set up a temp foundry workspace. `forge inspect` needs a project
  // context (foundry.toml + src/) to resolve solc and contract paths.
  const work = mkdtempSync(
    join(tmpdir(), "ethernauta-arbitrum-"),
  )
  const work_src = join(work, "src")
  mkdirSync(work_src, { recursive: true })
  write_foundry_toml(work)
  try {
    // Vendor every .sol into the foundry workspace so forge can
    // resolve cross-file references (none exist today, but cheap).
    for (const recipe of RECIPES) {
      const source = await fetch_text(recipe.url)
      writeFileSync(
        join(work_src, `${recipe.pascal}.sol`),
        source,
      )
    }
    // ArbosActs: vendor source to a stable folder + record but don't
    // include in the bind loop.
    const arbos_acts_source =
      await fetch_text(ARBOS_ACTS_URL)
    const arbos_acts_dir = join(
      precompiles_root,
      "arbos-acts",
    )
    mkdirSync(arbos_acts_dir, { recursive: true })
    writeFileSync(
      join(arbos_acts_dir, "ArbosActs.sol"),
      arbos_acts_source,
    )
    writeFileSync(
      join(arbos_acts_dir, "README.md"),
      [
        "# ArbosActs (vendored source — no bindings)",
        "",
        "The dispatcher requires `msg.sender == ArbosAddress` —",
        "any dapp call reverts. Source is vendored for documentation",
        "and easy future autogen; no method bindings are emitted.",
        "",
        "See D2-3 in `tmp/plans/03_arbitrum_package/README.md`.",
        "",
      ].join("\n"),
    )

    // Compile + emit per-precompile artifacts.
    for (const recipe of RECIPES) {
      const abi = inspect_abi(work, recipe.pascal)
      const out_dir = join(precompiles_root, recipe.kebab)
      mkdirSync(out_dir, { recursive: true })
      // Write the .sol next to the ABI JSON so SOURCES.md can point
      // at it for reviewers, mirroring the inline tree from slice 1.
      const sol_source = await fetch_text(recipe.url)
      writeFileSync(
        join(out_dir, `${recipe.pascal}.sol`),
        sol_source,
      )
      writeFileSync(
        join(out_dir, `${recipe.pascal}.abi.json`),
        `${JSON.stringify(abi, null, 2)}\n`,
      )
      emit_address_file(out_dir, recipe)
      emit_folder_index(out_dir)
      const fn_count = abi.filter(
        (e) => e.type === "function",
      ).length
      console.log(
        `  ${recipe.pascal} → ${recipe.kebab}/${recipe.pascal}.abi.json — ${fn_count} functions`,
      )
    }

    emit_root_index(precompiles_root, RECIPES)
    emit_sources_md(precompiles_root, RECIPES)

    console.log("")
    console.log("Done. Next steps:")
    console.log("  1. pnpm --filter @ethernauta/cli build")
    console.log("  2. pnpm exec ethernauta abi")
    console.log(
      "  3. pnpm --filter @ethernauta/arbitrum lint:fix",
    )
  } finally {
    rmSync(work, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
