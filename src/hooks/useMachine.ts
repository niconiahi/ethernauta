import { useEffect, useState } from "preact/hooks"
import { type AnyStateMachine, createActor } from "xstate"

export function useMachine<T extends AnyStateMachine>(
  machine: T,
) {
  const actor = createActor(machine)
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

  return [snapshot, actor.send] as const
}

