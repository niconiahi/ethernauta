import { parseArgs } from "node:util"
import { execute } from "./execute"

const args = parseArgs({
  options: {
    help: { type: "boolean", short: "h" },
    version: { type: "boolean", short: "v" },
  },
  allowPositionals: true,
  strict: false,
})

const command = args.positionals[0]

switch (command) {
  case "compile":
    await execute(process.argv.slice(3))
    break
  case "help":
  case undefined:
    console.log(
      `
Usage:

ethernauta compile --abi SOME_ABI.abi.json --out OUT_DIR`.trim(),
    )
    break
  default:
    console.error(`Unknown command: ${command}`)
    process.exit(1)
}
