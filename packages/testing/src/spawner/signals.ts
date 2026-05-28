import type { SpawnHandle } from "./spawn-anvil"

// Process-level signal cleanup. Multiple anvil handles can
// register; the process listeners are attached exactly once and
// each handle's kill is invoked once when a SIGINT / SIGTERM /
// `exit` arrives. The cleanup map is a module-level singleton
// because process-level listeners are themselves a singleton
// resource.

const cleanups = new Map<number, SpawnHandle>()
let nextId = 1
let registered = false

function dispatch(signal: NodeJS.Signals | "exit"): void {
  const handles = Array.from(cleanups.values())
  cleanups.clear()
  for (const handle of handles) {
    if (signal === "exit") {
      handle.kill("SIGTERM")
    } else {
      handle.kill(signal)
    }
  }
}

function ensure_registered(): void {
  if (registered) return
  registered = true
  process.on("SIGINT", () => dispatch("SIGINT"))
  process.on("SIGTERM", () => dispatch("SIGTERM"))
  process.on("exit", () => dispatch("exit"))
}

export function register_cleanup(
  handle: SpawnHandle,
): () => void {
  ensure_registered()
  const id = nextId
  nextId += 1
  cleanups.set(id, handle)
  return () => {
    cleanups.delete(id)
  }
}
