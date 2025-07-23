import { Password } from "@views/password/index.tsx"
import { Unlocked } from "@views/unlocked/index.tsx"
import { Mnemonics } from "@views/mnemonics/index.tsx"
import { useViewMachine } from "@machines/view"
import { useAuthenticationMachine } from "@machines/authentication"

export function Controller() {
  const view = useViewMachine()
  const authentication = useAuthenticationMachine({
    view: view[2],
  })
  const current = view[0].context.current
  switch (current) {
    case "mnemonics": {
      return <Mnemonics authentication={authentication} />
    }
    case "password": {
      return <Password authentication={authentication} />
    }
    case "wallet": {
      return <Unlocked authentication={authentication} />
    }
    default: {
      return <div>Unknown state: {current}</div>
    }
  }
}
