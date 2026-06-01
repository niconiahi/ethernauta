// Discover L1 deployment addresses for the zkSync-family chains
// we ship in @ethernauta/zksync. The Bridgehub per-network anchor
// is hardcoded below; every other address is read on-chain via
// `cast call`. Mirrors the orbit-discovery path in
// packages/arbitrum/scripts/pull-deploys.ts and the file-shape of
// packages/op/scripts/pull-superchain-registry.ts.
//
// Usage:
//   pnpm --filter @ethernauta/zksync pull-deploys
//
// Required tools on PATH:
//   - cast (foundry)
//
// Environment overrides (optional — drpc public defaults are used
// otherwise):
//   RPC_URL_EIP155_1
//   RPC_URL_EIP155_11155111
//
// Outputs:
//   packages/zksync/src/deploys/eip155-<id>.ts   (one per L2 chain)
//   packages/zksync/src/deploys/SOURCES.md       (bridgehub pins +
//                                                 discovery probe log)

import { execFileSync } from "node:child_process"
import {
  existsSync,
  mkdirSync,
  writeFileSync,
} from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { parse } from "valibot"
import {
  type ZksyncDeploys,
  ZksyncDeploysSchema,
} from "../src/core/deploys.ts"

type BridgehubAnchor = Readonly<{
  chainId: number
  parentChainId: number
  name: string
  bridgehub: string
  isTestnet: boolean
}>

const BRIDGEHUB_ANCHORS: ReadonlyArray<BridgehubAnchor> = [
  {
    chainId: 324,
    parentChainId: 1,
    name: "zkSync Era",
    bridgehub: "0x303a465B659cBB0ab36eE643eA362c509EEb5213",
    isTestnet: false,
  },
  {
    chainId: 300,
    parentChainId: 11155111,
    name: "zkSync Era Sepolia",
    bridgehub: "0x35A54c8C757806eB6820629bc82d90E056394C92",
    isTestnet: true,
  },
]

const DEFAULT_RPC_URLS: Record<number, string> = {
  1: "https://eth.drpc.org",
  11155111: "https://sepolia.drpc.org",
}

const CAST_RETRIES = 3
const CAST_RETRY_DELAY_MS = 1000

const HERE = dirname(fileURLToPath(import.meta.url))
const PACKAGE_ROOT = resolve(HERE, "..")
const DEPLOYS_DIR = join(PACKAGE_ROOT, "src", "deploys")
const CHAIN_PACKAGE_ROOT = resolve(
  PACKAGE_ROOT,
  "..",
  "chain",
  "src",
  "chain",
  "eip155",
)

function cast_call_once(
  rpc_url: string,
  contract: string,
  signature: string,
  ...args: string[]
): string {
  return execFileSync(
    "cast",
    [
      "call",
      contract,
      signature,
      ...args,
      "--rpc-url",
      rpc_url,
    ],
    { encoding: "utf8" },
  ).trim()
}

function sleep_sync(ms: number): void {
  execFileSync("sleep", [String(ms / 1000)])
}

function cast_call(
  rpc_url: string,
  contract: string,
  signature: string,
  ...args: string[]
): string {
  for (
    let attempt = 0;
    attempt < CAST_RETRIES;
    attempt += 1
  ) {
    try {
      return cast_call_once(
        rpc_url,
        contract,
        signature,
        ...args,
      )
    } catch (e) {
      const message =
        e instanceof Error ? e.message : String(e)
      const is_revert = /revert|execution reverted/i.test(
        message,
      )
      const is_last = attempt + 1 === CAST_RETRIES
      if (is_revert || is_last) throw e
      sleep_sync(CAST_RETRY_DELAY_MS * (attempt + 1))
    }
  }
  throw new Error(
    "cast_call: retry loop exited without throwing",
  )
}

function rpc_url_for(parent_chain_id: number): string {
  const env_key = `RPC_URL_EIP155_${parent_chain_id}`
  const override = process.env[env_key]
  if (override !== undefined && override !== "") {
    return override
  }
  const fallback = DEFAULT_RPC_URLS[parent_chain_id]
  if (!fallback) {
    throw new Error(
      `no default RPC URL for parent chain ${parent_chain_id}; set ${env_key}`,
    )
  }
  return fallback
}

function require_chain_present(chain_id: number): void {
  const file = join(
    CHAIN_PACKAGE_ROOT,
    `eip155-${chain_id}.ts`,
  )
  if (!existsSync(file)) {
    throw new Error(
      `Add eip155-${chain_id} to @ethernauta/chain before pulling its deploys. (expected ${file})`,
    )
  }
}

function read_anchor(anchor: BridgehubAnchor): {
  chainId: number
  deploys: ZksyncDeploys
} {
  const rpc_url = rpc_url_for(anchor.parentChainId)
  const chain_id_arg = String(anchor.chainId)
  const diamondProxy = cast_call(
    rpc_url,
    anchor.bridgehub,
    "getZKChain(uint256)(address)",
    chain_id_arg,
  )
  const assetRouter = cast_call(
    rpc_url,
    anchor.bridgehub,
    "assetRouter()(address)",
  )
  const messageRoot = cast_call(
    rpc_url,
    anchor.bridgehub,
    "messageRoot()(address)",
  )
  const chainTypeManager = cast_call(
    rpc_url,
    anchor.bridgehub,
    "chainTypeManager(uint256)(address)",
    chain_id_arg,
  )
  const baseToken = cast_call(
    rpc_url,
    anchor.bridgehub,
    "baseToken(uint256)(address)",
    chain_id_arg,
  )
  const ctmDeployer = cast_call(
    rpc_url,
    anchor.bridgehub,
    "l1CtmDeployer()(address)",
  )
  // The asset router holds three further singletons that consumers
  // need (nullifier, native-token vault, L1 WETH). They live there
  // rather than on the Bridgehub because the bridging surface
  // landed in a later upgrade than the Bridgehub itself.
  const l1Nullifier = cast_call(
    rpc_url,
    assetRouter,
    "L1_NULLIFIER()(address)",
  )
  const nativeTokenVault = cast_call(
    rpc_url,
    assetRouter,
    "nativeTokenVault()(address)",
  )
  const wethToken = cast_call(
    rpc_url,
    assetRouter,
    "L1_WETH_TOKEN()(address)",
  )
  const deploys = parse(ZksyncDeploysSchema, {
    name: anchor.name,
    parentChainId: anchor.parentChainId,
    l1: {
      bridgehub: anchor.bridgehub,
      assetRouter,
      nativeTokenVault,
      l1Nullifier,
      messageRoot,
      ctmDeployer,
      wethToken,
      diamondProxy,
      chainTypeManager,
      baseToken,
    },
    isTestnet: anchor.isTestnet,
  })
  return { chainId: anchor.chainId, deploys }
}

function format_deploys_file(
  anchor: BridgehubAnchor,
  d: ZksyncDeploys,
): string {
  const lines = [
    "// Generated by packages/zksync/scripts/pull-deploys.ts.",
    "// Do not edit by hand — re-run the script to bump.",
    "// Discovered via cast call against the L1 Bridgehub anchor",
    `// ${anchor.bridgehub} on eip155:${anchor.parentChainId}.`,
    `import { parse } from "valibot"`,
    `import { ZksyncDeploysSchema } from "../core/deploys"`,
    "",
    `export const eip155_${anchor.chainId}_deploys = parse(ZksyncDeploysSchema, {`,
    `  name: "${d.name}",`,
    `  parentChainId: ${d.parentChainId},`,
    "  l1: {",
    `    bridgehub: "${d.l1.bridgehub}",`,
    `    assetRouter: "${d.l1.assetRouter}",`,
    `    nativeTokenVault: "${d.l1.nativeTokenVault}",`,
    `    l1Nullifier: "${d.l1.l1Nullifier}",`,
    `    messageRoot: "${d.l1.messageRoot}",`,
    `    ctmDeployer: "${d.l1.ctmDeployer}",`,
    `    wethToken: "${d.l1.wethToken}",`,
    `    diamondProxy: "${d.l1.diamondProxy}",`,
    `    chainTypeManager: "${d.l1.chainTypeManager}",`,
    `    baseToken: "${d.l1.baseToken}",`,
    "  },",
    `  isTestnet: ${d.isTestnet},`,
    "})",
    "",
  ]
  return lines.join("\n")
}

function emit_sources_md(): string {
  const lines = [
    "# zkSync L1 deploy sources",
    "",
    "Generated by `packages/zksync/scripts/pull-deploys.ts`. Re-run the script to bump.",
    "",
    "## Discovery model",
    "",
    "Unlike OP's `superchain-registry` or Arbitrum's `arbitrum-sdk` networks file, zkSync does not publish a curated per-chain address registry. The on-chain `Bridgehub` contract is the only stable anchor: given its address on the parent chain, every other L1 address falls out of `cast call`s.",
    "",
    "For each L2 chain we ship, this script hardcodes the per-network `Bridgehub` (same address across every hyperchain on a given parent) and reads:",
    "",
    "- `getZKChain(chainId)` → diamond proxy (per-chain L1 hub)",
    "- `assetRouter()` → L1 asset router (per-network)",
    "- `messageRoot()` → L1 message root (per-network)",
    "- `chainTypeManager(chainId)` → CTM (per-chain, protocol-version-scoped)",
    "- `baseToken(chainId)` → gas token (`0x…01` means ETH)",
    "- `l1CtmDeployer()` → CTM deployer (per-network)",
    "",
    "Then on the asset router:",
    "",
    "- `L1_NULLIFIER()` → withdrawal nullifier (per-network)",
    "- `nativeTokenVault()` → native-token vault (per-network)",
    "- `L1_WETH_TOKEN()` → canonical L1 WETH address",
    "",
    "## Bridgehub anchors",
    "",
    BRIDGEHUB_ANCHORS.map(
      (a) =>
        `- ${a.name} (\`eip155-${a.chainId}\`) — bridgehub \`${a.bridgehub}\` on parent \`eip155:${a.parentChainId}\``,
    ).join("\n"),
    "",
    "## RPC defaults",
    "",
    `- \`RPC_URL_EIP155_1\` → \`${DEFAULT_RPC_URLS[1]}\``,
    `- \`RPC_URL_EIP155_11155111\` → \`${DEFAULT_RPC_URLS[11155111]}\``,
    "",
    "Override via environment variable per parent chain.",
    "",
    "## Bump cadence",
    "",
    "- Re-run when zkSync ships a new protocol-version upgrade that swaps the per-chain `ChainTypeManager` (the most frequently rotated field).",
    "- Re-run when a new hyperchain we want to ship lands; first add it to `BRIDGEHUB_ANCHORS` in the script.",
    "",
    "## How to bump",
    "",
    "1. Verify the Bridgehub anchor addresses are still current (matter-labs publishes any rotation as part of an upgrade announcement).",
    "2. Run `pnpm --filter @ethernauta/zksync pull-deploys`.",
    "3. Run the verification chain (`pnpm --filter @ethernauta/zksync typecheck build test:unit lint` + `pnpm lint:ratchet`).",
    "",
  ]
  return lines.join("\n")
}

function main(): void {
  console.log("[pull-deploys] starting")
  mkdirSync(DEPLOYS_DIR, { recursive: true })

  for (const a of BRIDGEHUB_ANCHORS) {
    require_chain_present(a.chainId)
  }
  console.log("[pull-deploys] chain registry guard ok")

  for (const anchor of BRIDGEHUB_ANCHORS) {
    console.log(
      `[pull-deploys] reading ${anchor.name} via bridgehub ${anchor.bridgehub}`,
    )
    const { chainId, deploys } = read_anchor(anchor)
    const file = join(DEPLOYS_DIR, `eip155-${chainId}.ts`)
    writeFileSync(
      file,
      format_deploys_file(anchor, deploys),
    )
    console.log(`[pull-deploys] wrote ${file}`)
  }

  const sources_path = join(DEPLOYS_DIR, "SOURCES.md")
  writeFileSync(sources_path, emit_sources_md())
  console.log(`[pull-deploys] wrote ${sources_path}`)

  console.log("[pull-deploys] formatting generated files")
  execFileSync("pnpm", [
    "exec",
    "biome",
    "format",
    "--write",
    DEPLOYS_DIR,
  ])
  console.log("[pull-deploys] done")
}

main()
