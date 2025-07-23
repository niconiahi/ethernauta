import { useMachine } from "@hooks/useMachine"
import { Locked } from "@views/locked/index.tsx"
import { Unlocked } from "@views/unlocked/index.tsx"
import { Mnemonics } from "@views/mnemonics/index.tsx"
import { view_machine } from "@machines/view"

export function Controller() {
  const [state, send] = useMachine(view_machine)
  const current = state.value
  switch (current) {
    case "mnemonics": {
      return <Mnemonics state={state} send={send} />
    }
    case "locked": {
      return <Locked snapshot={state} send={send} />
    }
    case "unlocked": {
      return <Unlocked snapshot={state} send={send} />
    }
    default: {
      return <div>Unknown state: {String(current)}</div>
    }
  }
}
