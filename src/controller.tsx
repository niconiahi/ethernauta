import { useMachine } from "preact-robot"
import { Locked } from "@views/locked/index.tsx"
import { Unlocked } from "@views/unlocked/index.tsx"
import { controller_machine } from "@machines/controller"

export function Controller() {
  const [state, send] = useMachine(controller_machine)
  const current = state.name
  switch (current) {
    case "locked": {
      return <Locked state={state} send={send} />
    }
    case "unlocked": {
      return <Unlocked state={state} send={send} />
    }
    default: {
      return <Locked state={state} send={send} />
    }
  }
}
