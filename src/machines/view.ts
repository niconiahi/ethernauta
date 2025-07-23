import { vault_exists } from "@utils/vault"
import * as v from "valibot"
import {
  createMachine,
  fromPromise,
  type SnapshotFrom,
} from "xstate"

type Context = {
  user: string
  mnemonic: string | null
  address: string | null
  error: string | null
}

type Event =
  | { type: "unlock"; mnemonics: string; address: string }
  | { type: "lock" }

export const view_machine = createMachine({
  types: {} as {
    context: Context
    events: Event
  },
  id: "wallet",
  initial: "checking",
  context: {
    user: "Andy",
    mnemonic: null,
    address: null,
    error: null,
  },
  states: {
    checking: {
      invoke: {
        src: fromPromise(() => vault_exists()),
        onDone: [
          {
            target: "locked",
            guard: ({ event }) => event.output === true,
          },
          {
            target: "mnemonics",
            guard: ({ event }) => event.output === false,
          },
        ],
        onError: {
          target: "mnemonics",
        },
      },
    },
    mnemonics: {
      on: {
        unlock: {
          target: "unlocked",
          guard: ({ event }) => {
            const { success: mnemonics_success } =
              v.safeParse(
                v.pipe(v.string(), v.minLength(1)),
                event.mnemonics,
              )
            const { success: address_success } =
              v.safeParse(
                v.pipe(v.string(), v.length(42)),
                event.address,
              )
            return mnemonics_success && address_success
          },
          actions: ({ context, event }) => {
            context.mnemonic = event.mnemonics
            context.address = event.address
          },
        },
      },
    },
    locked: {
      on: {
        unlock: "unlocked",
      },
    },
    unlocked: {
      on: {
        lock: "locked",
      },
    },
  },
})

export type ViewMachine = typeof view_machine
export type ViewState = SnapshotFrom<ViewMachine>
export type ViewSend = (event: Event) => void
