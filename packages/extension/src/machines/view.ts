import { useMachine } from "../hooks/useMachine"
import { setup, assign } from "xstate"

type ViewType = "mnemonics" | "password" | "wallet"
type Context = {
  current: ViewType
}

type Event = { type: "SET_VIEW"; view: ViewType }

const view_setup = setup({
  types: {} as {
    context: Context
    events: Event
  },
  actions: {
    set_view: assign({
      current: ({ event }) => {
        return event.view
      },
    }),
  },
})

export const view_machine = view_setup.createMachine({
  id: "view",
  context: {
    current: "password",
  },
  on: {
    SET_VIEW: {
      actions: ["set_view"],
    },
  },
})
export type ViewMachine = typeof view_machine

export function useViewMachine() {
  return useMachine(view_machine)
}
export type View = ReturnType<typeof useViewMachine>
