// Pull per-chain L1 deploy data for Arbitrum-family chains:
//   - 3 OffchainLabs-canonical chains: parsed from arbitrum-sdk's
//     networks.ts at a pinned SHA.
//   - 7 curated Orbit chains: read from the on-chain Rollup contract
//     on the parent chain via `cast call`.
//
// Usage:
//   pnpm --filter @ethernauta/arbitrum pull-deploys
//
// Required tools on PATH:
//   - cast (foundry)
//   - curl
//
// Environment overrides (optional — drpc public defaults are used
// otherwise):
//   RPC_URL_EIP155_1
//   RPC_URL_EIP155_11155111
//   RPC_URL_EIP155_42161
//
// Outputs:
//   packages/arbitrum/src/deploys/eip155-<id>.ts   (one per chain)
//   packages/arbitrum/src/deploys/SOURCES.md       (pinned SHA + probe log)

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
  type ArbitrumDeploys,
  ArbitrumDeploysSchema,
} from "../src/core/deploys.ts"
import { ORBIT_CHAINS } from "./orbit-chains.config.ts"

const ARBITRUM_SDK_SHA =
  "92d3960f252ceaf33f8ebb35c402a9b2c4b88a5d"
const NETWORKS_URL = `https://raw.githubusercontent.com/OffchainLabs/arbitrum-sdk/${ARBITRUM_SDK_SHA}/packages/sdk/src/lib/dataEntities/networks.ts`

const DEFAULT_RPC_URLS: Record<number, string> = {
  1: "https://eth.drpc.org",
  11155111: "https://sepolia.drpc.org",
  42161: "https://arb1.arbitrum.io/rpc",
  8453: "https://mainnet.base.org",
}

const CAST_RETRIES = 3
const CAST_RETRY_DELAY_MS = 1000

// challengeManager() exists on BoLD rollups, reverts on classic.
// `cast call` returns non-zero exit on a revert.
const CHALLENGE_MANAGER_SELECTOR =
  "challengeManager()(address)"

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

function curl(url: string): string {
  return execFileSync("curl", ["-fsSL", url], {
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  })
}

function cast_call_once(
  rpc_url: string,
  contract: string,
  signature: string,
): string {
  return execFileSync(
    "cast",
    ["call", contract, signature, "--rpc-url", rpc_url],
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
): string {
  for (
    let attempt = 0;
    attempt < CAST_RETRIES;
    attempt += 1
  ) {
    try {
      return cast_call_once(rpc_url, contract, signature)
    } catch (e) {
      const message =
        e instanceof Error ? e.message : String(e)
      const is_revert = /revert|execution reverted/i.test(
        message,
      )
      const is_last = attempt + 1 === CAST_RETRIES
      // Don't retry on EVM-side reverts (the challengeManager probe
      // intentionally reverts on classic rollups and we want fast
      // failure there). Retry only on RPC transport / HTTP errors.
      if (is_revert || is_last) {
        throw e
      }
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

// --- networks.ts parser ----------------------------------------------------
//
// Scan for `<n>: {` block openers inside the `const networks: { ... }`
// map, bracket-match each block, then field-extract via regex against
// the captured block content. ethBridge references resolve by name
// from top-level `const <name> = { ... }` blocks earlier in the file.

function find_block(
  source: string,
  start_index: number,
): { start: number; end: number } {
  let i = start_index
  for (; i < source.length; i += 1) {
    if (source[i] === "{") {
      const block_start = i
      let depth = 1
      i += 1
      for (; i < source.length; i += 1) {
        const c = source[i]
        if (c === "{") depth += 1
        else if (c === "}") {
          depth -= 1
          if (depth === 0) {
            return { start: block_start, end: i + 1 }
          }
        }
      }
      break
    }
  }
  throw new Error("find_block: unbalanced braces")
}

function block_at_key(
  source: string,
  key: string,
): { start: number; end: number } {
  const pattern = new RegExp(
    `(^|\\n|\\s)${key}\\s*:\\s*\\{`,
    "m",
  )
  const m = pattern.exec(source)
  if (!m) {
    throw new Error(`block_at_key: key '${key}' not found`)
  }
  return find_block(source, m.index + m[0].length - 1)
}

function string_field(block: string, key: string): string {
  const m = new RegExp(`${key}\\s*:\\s*'([^']*)'`).exec(
    block,
  )
  if (!m) {
    throw new Error(`string_field: key '${key}' not found`)
  }
  return m[1]
}

function number_field(block: string, key: string): number {
  const m = new RegExp(`${key}\\s*:\\s*(\\d+)`).exec(block)
  if (!m) {
    throw new Error(`number_field: key '${key}' not found`)
  }
  return Number(m[1])
}

function boolean_field(
  block: string,
  key: string,
): boolean | undefined {
  const m = new RegExp(`${key}\\s*:\\s*(true|false)`).exec(
    block,
  )
  if (!m) return undefined
  return m[1] === "true"
}

function ethbridge_ref(block: string): string | null {
  const m = /ethBridge\s*:\s*([A-Za-z_][A-Za-z0-9_]*)/.exec(
    block,
  )
  return m ? m[1] : null
}

function parse_eth_bridge_block(
  block: string,
): ArbitrumDeploys["ethBridge"] & { inbox?: string } {
  const bridge = string_field(block, "bridge")
  const sequencerInbox = string_field(
    block,
    "sequencerInbox",
  )
  const outbox = string_field(block, "outbox")
  const rollup = string_field(block, "rollup")
  // `inbox` is present in newer networks.ts dumps. Carry it
  // out of the parser so the canonical block can hoist it into
  // the top-level `contracts` field on `ArbitrumDeploys`.
  let inbox: string | undefined
  try {
    inbox = string_field(block, "inbox")
  } catch {
    inbox = undefined
  }
  // classicOutboxes (Arbitrum One only): { '0x...': 0, '0x...': 30 }
  const co_m = /classicOutboxes\s*:\s*\{([^}]*)\}/.exec(
    block,
  )
  if (!co_m) {
    return { bridge, sequencerInbox, outbox, rollup, inbox }
  }
  const entries: Record<string, number> = {}
  const entry_re = /'(0x[0-9a-fA-F]{40})'\s*:\s*(\d+)/g
  let em = entry_re.exec(co_m[1])
  while (em !== null) {
    entries[em[1]] = Number(em[2])
    em = entry_re.exec(co_m[1])
  }
  return {
    bridge,
    sequencerInbox,
    outbox,
    rollup,
    classicOutboxes: entries,
    inbox,
  }
}

function parse_token_bridge_block(block: string): {
  parentGatewayRouter: string
  parentErc20Gateway: string
} | null {
  // networks.ts uses either `parentGatewayRouter` (v4) or the
  // deprecated `l1GatewayRouter` (v3). Try both.
  const router =
    safe_string_field(block, "parentGatewayRouter") ??
    safe_string_field(block, "l1GatewayRouter")
  const erc20 =
    safe_string_field(block, "parentErc20Gateway") ??
    safe_string_field(block, "l1ERC20Gateway")
  if (!router || !erc20) return null
  return {
    parentGatewayRouter: router,
    parentErc20Gateway: erc20,
  }
}

function safe_string_field(
  block: string,
  key: string,
): string | undefined {
  try {
    return string_field(block, key)
  } catch {
    return undefined
  }
}

function parse_canonical(source: string): ReadonlyArray<{
  chainId: number
  deploys: ArbitrumDeploys
}> {
  // `const networks: { [id: string]: ArbitrumNetwork } = { ... }`
  // The type annotation is itself a `{ ... }` block, so we anchor on
  // the `= {` that opens the value side instead of the first `{`
  // after the identifier.
  const decl_re = /const\s+networks\s*:[^=]*=\s*\{/
  const decl_m = decl_re.exec(source)
  if (!decl_m) {
    throw new Error(
      "parse_canonical: const networks not found",
    )
  }
  const networks_block = find_block(
    source,
    decl_m.index + decl_m[0].length - 1,
  )
  const networks_inner = source.slice(
    networks_block.start + 1,
    networks_block.end - 1,
  )
  const chain_ids = [42161, 42170, 421614]
  const out: {
    chainId: number
    deploys: ArbitrumDeploys
  }[] = []
  for (const id of chain_ids) {
    const block = block_at_key(networks_inner, String(id))
    const block_text = networks_inner.slice(
      block.start,
      block.end,
    )
    const name = string_field(block_text, "name")
    const parentChainId = number_field(
      block_text,
      "parentChainId",
    )
    const confirmPeriodBlocks = number_field(
      block_text,
      "confirmPeriodBlocks",
    )
    const isTestnet = boolean_field(block_text, "isTestnet")
    if (isTestnet === undefined) {
      throw new Error(`chain ${id}: missing isTestnet`)
    }
    const isBold = boolean_field(block_text, "isBold")
    const ref = ethbridge_ref(block_text)
    const ethBridge_full = ref
      ? parse_eth_bridge_block(
          read_top_level_const(source, ref),
        )
      : parse_eth_bridge_block(
          block_text.slice(
            block_at_key(block_text, "ethBridge").start,
            block_at_key(block_text, "ethBridge").end,
          ),
        )
    const { inbox: inbox_from_bridge, ...ethBridge } =
      ethBridge_full
    const tb_ref =
      /tokenBridge\s*:\s*([A-Za-z_][A-Za-z0-9_]*)/.exec(
        block_text,
      )
    let token_bridge: {
      parentGatewayRouter: string
      parentErc20Gateway: string
    } | null = null
    if (tb_ref) {
      token_bridge = parse_token_bridge_block(
        read_top_level_const(source, tb_ref[1]),
      )
    } else {
      try {
        const tb_block = block_at_key(
          block_text,
          "tokenBridge",
        )
        token_bridge = parse_token_bridge_block(
          block_text.slice(tb_block.start, tb_block.end),
        )
      } catch {
        token_bridge = null
      }
    }
    const contracts =
      inbox_from_bridge && token_bridge
        ? {
            inbox: inbox_from_bridge,
            l1GatewayRouter:
              token_bridge.parentGatewayRouter,
            l1Erc20Gateway: token_bridge.parentErc20Gateway,
          }
        : undefined
    const deploys = parse(ArbitrumDeploysSchema, {
      name,
      parentChainId,
      ethBridge,
      ...(contracts ? { contracts } : {}),
      confirmPeriodBlocks,
      ...(isBold !== undefined ? { isBold } : {}),
      isTestnet,
    })
    out.push({ chainId: id, deploys })
  }
  return out
}

function read_top_level_const(
  source: string,
  identifier: string,
): string {
  // Allow optional type annotation (`const x: T = { ... }`).
  const top_re = new RegExp(
    `const\\s+${identifier}\\s*(?::[^=]+)?=\\s*\\{`,
    "m",
  )
  const m = top_re.exec(source)
  if (!m) {
    throw new Error(
      `ethBridge ref '${identifier}' not found at top level`,
    )
  }
  const range = find_block(
    source,
    m.index + m[0].length - 1,
  )
  return source.slice(range.start, range.end)
}

// --- orbit reader ---------------------------------------------------------

function read_orbit_chain(
  entry: (typeof ORBIT_CHAINS)[number],
): { chainId: number; deploys: ArbitrumDeploys } {
  const rpc_url = rpc_url_for(entry.parentChainId)
  const bridge = cast_call(
    rpc_url,
    entry.rollup,
    "bridge()(address)",
  )
  const sequencerInbox = cast_call(
    rpc_url,
    entry.rollup,
    "sequencerInbox()(address)",
  )
  const outbox = cast_call(
    rpc_url,
    entry.rollup,
    "outbox()(address)",
  )
  const confirmPeriodBlocksRaw = cast_call(
    rpc_url,
    entry.rollup,
    "confirmPeriodBlocks()(uint64)",
  )
  const confirmPeriodBlocks = Number(
    confirmPeriodBlocksRaw.split(/\s/)[0],
  )
  let isBold: boolean
  try {
    cast_call(
      rpc_url,
      entry.rollup,
      CHALLENGE_MANAGER_SELECTOR,
    )
    isBold = true
  } catch {
    isBold = false
  }
  const deploys = parse(ArbitrumDeploysSchema, {
    name: entry.name,
    parentChainId: entry.parentChainId,
    ethBridge: {
      bridge,
      sequencerInbox,
      outbox,
      rollup: entry.rollup,
    },
    confirmPeriodBlocks,
    isBold,
    isTestnet: false,
  })
  return { chainId: entry.chainId, deploys }
}

// --- emitter --------------------------------------------------------------

function format_eth_bridge(
  eb: ArbitrumDeploys["ethBridge"],
): string {
  const lines = [
    `    bridge: "${eb.bridge}",`,
    `    sequencerInbox: "${eb.sequencerInbox}",`,
    `    outbox: "${eb.outbox}",`,
    `    rollup: "${eb.rollup}",`,
  ]
  if (eb.classicOutboxes) {
    lines.push("    classicOutboxes: {")
    for (const [addr, epoch] of Object.entries(
      eb.classicOutboxes,
    )) {
      lines.push(`      "${addr}": ${epoch},`)
    }
    lines.push("    },")
  }
  return lines.join("\n")
}

function format_deploys_file(
  chainId: number,
  d: ArbitrumDeploys,
): string {
  const ethBridge = format_eth_bridge(d.ethBridge)
  const lines = [
    "// Generated by packages/arbitrum/scripts/pull-deploys.ts.",
    "// Do not edit by hand — re-run the script to bump.",
    "// Source: see packages/arbitrum/src/deploys/SOURCES.md",
    `import { parse } from "valibot"`,
    `import { ArbitrumDeploysSchema } from "../core/deploys"`,
    "",
    `export const eip155_${chainId}_deploys = parse(ArbitrumDeploysSchema, {`,
    `  name: "${d.name}",`,
    `  parentChainId: ${d.parentChainId},`,
    "  ethBridge: {",
    ethBridge,
    "  },",
  ]
  if (d.contracts) {
    lines.push(
      "  contracts: {",
      `    inbox: "${d.contracts.inbox}",`,
      `    l1GatewayRouter: "${d.contracts.l1GatewayRouter}",`,
      `    l1Erc20Gateway: "${d.contracts.l1Erc20Gateway}",`,
      "  },",
    )
  }
  lines.push(
    `  confirmPeriodBlocks: ${d.confirmPeriodBlocks},`,
  )
  if (d.isBold !== undefined) {
    lines.push(`  isBold: ${d.isBold},`)
  }
  lines.push(`  isTestnet: ${d.isTestnet},`)
  lines.push("})", "")
  return lines.join("\n")
}

function emit_sources_md(
  canonical: ReadonlyArray<{
    chainId: number
    deploys: ArbitrumDeploys
  }>,
): string {
  const lines = [
    "# Deploys sources",
    "",
    "Generated by \`packages/arbitrum/scripts/pull-deploys.ts\`. Re-run the script after bumping the pinned SHA below.",
    "",
    "## Canonical chains (OffchainLabs)",
    "",
    "Pulled from \`OffchainLabs/arbitrum-sdk\` \`packages/sdk/src/lib/dataEntities/networks.ts\` at SHA",
    `\`${ARBITRUM_SDK_SHA}\` (2025-02-13 "feat: update arb1 and nova to bold" — re-pinned during slice 5 impl;`,
    "the originally-recorded \`b2310d37…\` returns 404 at GitHub raw).",
    "",
    canonical
      .map(
        (c) =>
          `- ${c.deploys.name} (\`eip155-${c.chainId}\`)`,
      )
      .join("\n"),
    "",
    "## Orbit chains",
    "",
    "Read from L1 via \`cast call\` against the Rollup contract on the parent chain. Rollup addresses sourced from L2BEAT (\`packages/config/src/projects/<slug>/discovered.json\`, entry name \`RollupProxy\`).",
    "",
    ORBIT_CHAINS.map(
      (c) =>
        `- ${c.name} (\`eip155-${c.chainId}\`) — rollup \`${c.rollup}\` on parent eip155:${c.parentChainId} — L2BEAT slug \`${c.l2BeatSlug}\``,
    ).join("\n"),
    "",
    "## isBold probe",
    "",
    `For each Orbit chain, \`isBold\` is inferred by probing \`${CHALLENGE_MANAGER_SELECTOR}\` against the Rollup contract: BoLD rollups respond with an address, classic rollups revert and the script catches the revert (\`isBold: false\`).`,
    "",
    "## RPC defaults",
    "",
    `- \`RPC_URL_EIP155_1\` → \`${DEFAULT_RPC_URLS[1]}\``,
    `- \`RPC_URL_EIP155_11155111\` → \`${DEFAULT_RPC_URLS[11155111]}\``,
    `- \`RPC_URL_EIP155_42161\` → \`${DEFAULT_RPC_URLS[42161]}\``,
    "",
    "Override via environment variable per parent chain.",
    "",
  ]
  return lines.join("\n")
}

// --- main ----------------------------------------------------------------

function main(): void {
  console.log("[pull-deploys] starting")
  mkdirSync(DEPLOYS_DIR, { recursive: true })

  // Guard: every target chain must be in @ethernauta/chain BEFORE
  // any RPC reads (locked-decision #6).
  for (const id of [42161, 42170, 421614]) {
    require_chain_present(id)
  }
  for (const o of ORBIT_CHAINS) {
    require_chain_present(o.chainId)
  }
  console.log("[pull-deploys] chain registry guard ok")

  console.log(
    `[pull-deploys] fetching networks.ts @ ${ARBITRUM_SDK_SHA}`,
  )
  const networks_source = curl(NETWORKS_URL)
  const canonical = parse_canonical(networks_source)
  console.log(
    `[pull-deploys] parsed ${canonical.length} canonical chain(s)`,
  )

  // Write canonical files eagerly so a transient RPC failure on the
  // orbit phase doesn't lose the parser's work.
  for (const { chainId, deploys } of canonical) {
    const file = join(DEPLOYS_DIR, `eip155-${chainId}.ts`)
    writeFileSync(
      file,
      format_deploys_file(chainId, deploys),
      "utf8",
    )
    console.log(`[pull-deploys] wrote ${file}`)
  }

  for (const entry of ORBIT_CHAINS) {
    console.log(
      `[pull-deploys] reading orbit ${entry.name} (${entry.chainId})`,
    )
    const { chainId, deploys } = read_orbit_chain(entry)
    const file = join(DEPLOYS_DIR, `eip155-${chainId}.ts`)
    writeFileSync(
      file,
      format_deploys_file(chainId, deploys),
      "utf8",
    )
    console.log(`[pull-deploys] wrote ${file}`)
  }

  const sources_md = emit_sources_md(canonical)
  writeFileSync(
    join(DEPLOYS_DIR, "SOURCES.md"),
    sources_md,
    "utf8",
  )
  console.log("[pull-deploys] wrote SOURCES.md")

  console.log("[pull-deploys] done")
}

main()
