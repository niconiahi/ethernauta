#!/usr/bin/env node
// One-shot script: stamp description / keywords / homepage / bugs / license
// onto every published @ethernauta/* package.json. Skips wallet (private)
// and the two apps. Idempotent — re-running overwrites with the latest copy
// of the per-package metadata table below.

import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const here = dirname(fileURLToPath(import.meta.url))
const repo_root = resolve(here, "..")

const HOMEPAGE = "https://ethernauta-docs.pages.dev/"
const BUGS = { url: "https://github.com/niconiahi/ethernauta/issues" }
const LICENSE = "MIT"

const META = {
  abi: {
    description:
      "ABI encode/decode codecs for Ethernauta — function signatures, event topics, parameter encoding/decoding.",
    keywords: ["ethereum", "abi", "encode", "decode", "evm", "valibot"],
  },
  arbitrum: {
    description:
      "Arbitrum support for Ethernauta — bridge verbs, 16 precompiles, arb_* RPC, orbit chains, timeboost.",
    keywords: [
      "ethereum",
      "arbitrum",
      "rollup",
      "l2",
      "bridge",
      "precompiles",
      "orbit",
    ],
  },
  chain: {
    description:
      "500+ EIP-155 chain definitions for Ethernauta, indexed by chain_id.",
    keywords: ["ethereum", "chain", "eip-155", "evm", "mainnet", "testnet"],
  },
  cli: {
    description:
      "Code generator for Ethernauta — emits ABI method bindings from contract ABIs.",
    keywords: ["ethereum", "codegen", "abi", "cli", "tooling"],
  },
  core: {
    description:
      "Primitive Valibot schemas for Ethernauta — addresses, bytes, hashes, uints, hex.",
    keywords: ["ethereum", "valibot", "schema", "primitives", "address", "hash"],
  },
  crypto: {
    description:
      "Cross-spec signature + SIWE verification + HD key derivation for Ethernauta.",
    keywords: ["ethereum", "crypto", "siwe", "hd-wallet", "bip39", "signature"],
  },
  eip: {
    description:
      "EIP standards (191, 712, 1102, 1193, 1271, 2255, 3085, 4361, 5792, 6963, 7702, …) as importable subpaths for Ethernauta.",
    keywords: [
      "ethereum",
      "eip",
      "eip-1193",
      "eip-712",
      "eip-6963",
      "eip-7702",
      "wallet",
    ],
  },
  ens: {
    description:
      "ENS primitives for Ethernauta — ENSIP normalize + resolver helpers.",
    keywords: ["ethereum", "ens", "ensip", "namehash", "resolver"],
  },
  erc: {
    description:
      "ERC method bindings (20, 721, 1155, 4626, 5267, …) as importable subpaths for Ethernauta.",
    keywords: [
      "ethereum",
      "erc",
      "erc-20",
      "erc-721",
      "erc-1155",
      "erc-4626",
      "token",
    ],
  },
  eth: {
    description:
      "eth_* JSON-RPC methods + EIP-1559 fee math + gas-limit buffering for Ethernauta.",
    keywords: ["ethereum", "json-rpc", "eth", "eip-1559", "gas", "fees"],
  },
  op: {
    description:
      "OP-Stack support for Ethernauta — bridge verbs, 18 predeploys, per-chain L1 deploys, op-node RPC, fee estimation.",
    keywords: [
      "ethereum",
      "optimism",
      "op-stack",
      "rollup",
      "l2",
      "bridge",
      "superchain",
    ],
  },
  react: {
    description:
      "React hooks for Ethernauta — useProvider, useProviderDetail (EIP-6963 discovery).",
    keywords: ["ethereum", "react", "hooks", "eip-6963", "wallet"],
  },
  testing: {
    description:
      "Vitest plugin + anvil spawner for Ethernauta-based dapp tests.",
    keywords: ["ethereum", "testing", "vitest", "anvil", "foundry"],
  },
  transaction: {
    description:
      "Transaction lifecycle tracker for Ethernauta — pending → mined / reverted via receipt polling.",
    keywords: ["ethereum", "transaction", "tracker", "lifecycle", "receipt"],
  },
  transport: {
    description:
      "Resolver shapes (Readable / Writable / Signable / Callable / Bridgeable) + HTTP transport + EIP-1193 provider adapter for Ethernauta.",
    keywords: [
      "ethereum",
      "transport",
      "json-rpc",
      "eip-1193",
      "resolver",
      "http",
    ],
  },
  utils: {
    description:
      "Pure dependency-free helpers for Ethernauta — hex, bytes, BigInt, type guards.",
    keywords: ["ethereum", "utils", "hex", "bytes", "bigint"],
  },
  zksync: {
    description:
      "zkSync Era support for Ethernauta — bridge verbs, system contracts, zks_* RPC, 0x71 (EIP-712) tx encoder + signer.",
    keywords: [
      "ethereum",
      "zksync",
      "zksync-era",
      "rollup",
      "l2",
      "bridge",
      "eip-712",
    ],
  },
}

// Standard npm key ordering. Any keys not in this list are appended after.
const KEY_ORDER = [
  "$schema",
  "name",
  "version",
  "description",
  "keywords",
  "homepage",
  "bugs",
  "license",
  "author",
  "type",
  "publishConfig",
  "repository",
  "sideEffects",
  "main",
  "module",
  "types",
  "bin",
  "exports",
  "files",
  "scripts",
  "peerDependencies",
  "dependencies",
  "devDependencies",
]

function reorder(pkg) {
  const out = {}
  for (const key of KEY_ORDER) {
    if (key in pkg) out[key] = pkg[key]
  }
  for (const key of Object.keys(pkg)) {
    if (!(key in out)) out[key] = pkg[key]
  }
  return out
}

for (const [folder, meta] of Object.entries(META)) {
  const path = resolve(repo_root, "packages", folder, "package.json")
  const pkg = JSON.parse(readFileSync(path, "utf8"))
  pkg.description = meta.description
  pkg.keywords = meta.keywords
  pkg.homepage = HOMEPAGE
  pkg.bugs = BUGS
  pkg.license = LICENSE
  const reordered = reorder(pkg)
  writeFileSync(path, `${JSON.stringify(reordered, null, 2)}\n`)
  console.log(`✓ packages/${folder}/package.json`)
}
