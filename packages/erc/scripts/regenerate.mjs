// Regenerate ERC interface methods from OpenZeppelin ABI JSONs.
//
// Run: node packages/erc/scripts/regenerate.mjs
//
// The ABI JSONs in packages/erc/src/<n>/IERC*.abi.json are extracted from
// foundry artifacts compiled against vendored OpenZeppelin sources in
// _animatronik/contracts/lib/openzeppelin-contracts/ (canonical, trustful).
//
// Source contracts (master branch of OpenZeppelin/openzeppelin-contracts):
// - IERC165.sol            contracts/utils/introspection/IERC165.sol
// - IERC20.sol             contracts/token/ERC20/IERC20.sol
// - IERC20Metadata.sol     contracts/token/ERC20/extensions/IERC20Metadata.sol
// - IERC721.sol            contracts/token/ERC721/IERC721.sol
// - IERC721Metadata.sol    contracts/token/ERC721/extensions/IERC721Metadata.sol
// - IERC721Enumerable.sol  contracts/token/ERC721/extensions/IERC721Enumerable.sol
//
// Foundry-compiled artifacts include the full inherited interface (e.g.
// IERC721Metadata.abi.json contains every IERC721 method PLUS metadata methods),
// so this script dedupes by function signature when merging multiple ABIs.

import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { generate } from "../../abi/src/generator/generator.ts"

const __dirname = dirname(fileURLToPath(import.meta.url))
const repo_root = resolve(__dirname, "../../..")

const targets = [
  {
    name: "ERC-165",
    abis: ["packages/erc/src/165/IERC165.abi.json"],
    out: "packages/erc/src/165",
  },
  {
    name: "ERC-20 (+ metadata)",
    abis: [
      "packages/erc/src/20/IERC20.abi.json",
      "packages/erc/src/20/IERC20Metadata.abi.json",
    ],
    out: "packages/erc/src/20",
  },
  {
    name: "ERC-721 (+ metadata, + enumerable)",
    abis: [
      "packages/erc/src/721/IERC721.abi.json",
      "packages/erc/src/721/IERC721Metadata.abi.json",
      "packages/erc/src/721/IERC721Enumerable.abi.json",
    ],
    out: "packages/erc/src/721",
  },
]

function signature_key(fn) {
  const param_types = fn.inputs.map((i) => i.type).join(",")
  return `${fn.name}(${param_types})`
}

function snake_or_kebab(name) {
  if (name.includes("_")) return name
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
}

for (const target of targets) {
  const seen = new Set()
  const functions = []
  for (const abi_path of target.abis) {
    const abi = JSON.parse(
      readFileSync(join(repo_root, abi_path), "utf8"),
    )
    for (const description of abi) {
      if (description.type !== "function") continue
      const key = signature_key(description)
      if (seen.has(key)) continue
      seen.add(key)
      functions.push(description)
    }
  }
  generate(functions, join(repo_root, target.out))
  writeFileSync(
    join(repo_root, target.out, "methods", "index.ts"),
    `${functions
      .map(
        (f) =>
          `export * from "./${snake_or_kebab(f.name)}"`,
      )
      .join("\n")}\n`,
  )
  console.log(
    `${target.name}: regenerated ${functions.length} methods`,
  )
}
