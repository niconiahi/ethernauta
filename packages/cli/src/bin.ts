#!/usr/bin/env node
import { execute_abi, execute_registry } from "./execute"

const HELP = `
Usage:

  ethernauta abi                                       (walker mode)
  ethernauta abi      --in <abi-or-artifact.json> --out <dir>
  ethernauta registry --in <abi-root-dir>         --out <out-file>

Subcommands:

  abi       Regenerate contract method TypeScript files.
            With no flags: walks packages/**/*.abi.json and
            packages/**/*.abi from the workspace root and writes
            methods/ next to each ABI source. One ABI per folder.
            With --in/--out: single-file mode (external consumers).

  registry  Walk a directory for *.abi.json files and emit a
            single REGISTRY mapping 4-byte selectors to method
            metadata (signature, name, types, param names).

Prerequisites:

  forge     Required when any .abi (Solidity) sources are walked;
            the walker invokes \`forge inspect <path>:<Contract> abi\`
            to extract the ABI inline. Install via foundryup:
              curl -L https://foundry.paradigm.xyz | bash && foundryup
`.trim()

const [, , subcommand, ...rest] = process.argv

switch (subcommand) {
  case "abi":
    execute_abi(rest)
    break
  case "registry":
    execute_registry(rest)
    break
  case "help":
  case "--help":
  case "-h":
  case undefined:
    console.log(HELP)
    break
  default:
    console.error(`unknown subcommand: ${subcommand}\n`)
    console.error(HELP)
    process.exit(1)
}
