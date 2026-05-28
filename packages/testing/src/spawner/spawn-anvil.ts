import type { ChildProcess } from "node:child_process"
import { spawn } from "node:child_process"

import type { InferOutput } from "valibot"
import {
  array,
  bigint,
  number,
  object,
  optional,
  parse,
  string,
} from "valibot"

import { ForkConfigSchema } from "../test/config"

// Spawn config — every option that gets translated into an anvil
// CLI flag. Reuses the public `ForkConfigSchema` from
// `src/test/config.ts` so URL validation is enforced at the
// spawner boundary too, not only on the public `test()` path.

export const SpawnConfigSchema = object({
  port: number(),
  chainId: optional(number()),
  accounts: optional(number()),
  mnemonic: optional(string()),
  blockTime: optional(number()),
  baseFee: optional(bigint()),
  hardfork: optional(string()),
  fork: optional(ForkConfigSchema),
  extraArgs: optional(array(string())),
})
export type SpawnConfig = InferOutput<typeof SpawnConfigSchema>

// `SpawnHandle` is a control surface, not a value-bearing
// boundary — it carries a `ChildProcess` from node's standard
// library that has no JSON shape and a closure-backed `stderr()`
// accumulator. Per `skills/conventions/SKILL.md`'s exemption for
// generic transport shapes, this is a hand-rolled type.
// allow-violation: R1-capability-shape
export type SpawnHandle = {
  port: number
  child: ChildProcess
  stderr: () => string
  kill: (_signal?: NodeJS.Signals) => void
}

export function build_anvil_args(
  config: SpawnConfig,
): string[] {
  const args: string[] = ["--port", String(config.port)]
  if (config.chainId !== undefined) {
    args.push("--chain-id", String(config.chainId))
  }
  if (config.accounts !== undefined) {
    args.push("--accounts", String(config.accounts))
  }
  if (config.mnemonic !== undefined) {
    args.push("--mnemonic", config.mnemonic)
  }
  if (config.blockTime !== undefined) {
    args.push("--block-time", String(config.blockTime))
  }
  if (config.baseFee !== undefined) {
    args.push("--base-fee", config.baseFee.toString())
  }
  if (config.hardfork !== undefined) {
    args.push("--hardfork", config.hardfork)
  }
  if (config.fork !== undefined) {
    args.push("--fork-url", config.fork.url)
    if (config.fork.blockNumber !== undefined) {
      args.push(
        "--fork-block-number",
        config.fork.blockNumber.toString(),
      )
    }
  }
  if (config.extraArgs !== undefined) {
    args.push(...config.extraArgs)
  }
  return args
}

export function spawn_anvil(
  _config: SpawnConfig,
): SpawnHandle {
  const config = parse(SpawnConfigSchema, _config)
  const args = build_anvil_args(config)
  const child = spawn("anvil", args, {
    stdio: ["ignore", "ignore", "pipe"],
  })
  let stderrBuffer = ""
  child.stderr?.on("data", (chunk: Buffer) => {
    stderrBuffer += chunk.toString("utf8")
  })
  let killed = false
  function kill(signal: NodeJS.Signals = "SIGTERM"): void {
    if (killed) return
    killed = true
    try {
      child.kill(signal)
    } catch {
      // ignore — the process may have already exited
    }
  }
  return {
    port: config.port,
    child,
    stderr: () => stderrBuffer,
    kill,
  }
}
