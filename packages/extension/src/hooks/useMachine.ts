import { useEffect, useState, useMemo } from "preact/hooks"
import {
  type ActorOptions,
  type AnyStateMachine,
  createActor,
} from "xstate"

export function useMachine<T extends AnyStateMachine>(
  machine: T,
  options?: ActorOptions<T>,
) {
  const actor = useMemo(
    () => createActor(machine, options),
    [machine],
  )
  const [snapshot, setSnapshot] = useState(() =>
    actor.getSnapshot(),
  )
  useEffect(() => {
    const subscription = actor.subscribe(setSnapshot)
    actor.start()
    return () => {
      subscription.unsubscribe()
      actor.stop()
    }
  }, [actor])

  return [snapshot, actor.send, actor] as const
}
