import { vault_exists } from "@utils/vault"
import * as v from "valibot"
import {
  createMachine,
  fromPromise,
  type SnapshotFrom,
} from "xstate"

type Event =
  | { type: "unlock"; mnemonics: string; address: string }
  | { type: "lock" }

export const authentication_machine = createMachine({
  types: {} as {
    events: Event
  },
  id: "wallet",
  initial: "checking",
  states: {
    locked: {
      entry: {
        // check the boolean promise here and go to one of the two valid states, as required
        // no initial state really, unless is required
      },
      password: {
        // this will not store the mnemonics in memory, it will create the store and store the data accordingly in indexedDB and transition to unlocked
      },
      mnemonics: {
        // this will not store the mnemonics in memory, it will just store in indexedDB and transition to unlocked
      },
    },
    unlocked: {
      on: {
        lock: "locked",
      },
      // on entry, it should change the view so that <WalletView />. Then, from other places, authentication_machine should be accesible to send "lock" event, to lock everything up
    },
  },
})

export type AuthenticationMachine =
  typeof authentication_machine
export type AuthenticationState =
  SnapshotFrom<AuthenticationMachine>
export type AuthenticationSend = (event: Event) => void
