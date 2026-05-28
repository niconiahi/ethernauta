import { spawn } from "node:child_process"

import type { InferOutput } from "valibot"
import { literal, object, string, variant } from "valibot"

// Tagged result for whether the `anvil` binary is on `$PATH`.
// `status: "found"` carries the resolved path so callers can log
// it and skip a second lookup. `status: "missing"` is the
// signal to surface the install instructions and exit.

export const FoundryDetectionSchema = variant("status", [
  object({
    status: literal("found"),
    path: string(),
  }),
  object({
    status: literal("missing"),
  }),
])
export type FoundryDetection = InferOutput<
  typeof FoundryDetectionSchema
>

export const FOUNDRY_INSTALL_HINT =
  "[ethernauta] anvil not found on $PATH.\n" +
  "Foundry is required for @ethernauta/testing.\n" +
  "Install with:\n" +
  "  curl -L https://foundry.paradigm.xyz | bash && foundryup"

export function detect_foundry(): Promise<FoundryDetection> {
  return new Promise((resolve) => {
    const child = spawn(
      process.platform === "win32" ? "where" : "which",
      ["anvil"],
      { stdio: ["ignore", "pipe", "ignore"] },
    )
    let stdout = ""
    child.stdout?.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8")
    })
    child.on("error", () => {
      resolve({ status: "missing" })
    })
    child.on("close", (code) => {
      if (code !== 0) {
        resolve({ status: "missing" })
        return
      }
      const first = stdout.split(/\r?\n/)[0]?.trim() ?? ""
      if (first.length === 0) {
        resolve({ status: "missing" })
        return
      }
      resolve({ status: "found", path: first })
    })
  })
}
