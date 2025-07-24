import {
  setup,
  fromPromise,
  type ActorRefFrom,
} from "xstate"
import { and } from "xstate/guards"
import * as v from "valibot"
import {
  set_vault,
  validate_password,
  vault_exists,
} from "../utils/vault"
import type { ViewMachine } from "./view"
import { useMachine } from "../hooks/useMachine"
import invariant from "../utils/tiny-invariant"

type Event =
  | {
      type: "SAVE_MNEMONICS"
      password: string
      mnemonics: string
    }
  | { type: "UNLOCK_WALLET"; password: string }
  | { type: "LOCK" }

const PasswordSchema = v.pipe(v.string(), v.minLength(8))
const MnemonicsSchema = v.pipe(v.string(), v.minLength(1))

const authentication_setup = setup({
  types: {} as {
    events: Event
    input: { view: ActorRefFrom<ViewMachine> }
    context: {
      view: ActorRefFrom<ViewMachine>
    }
  },
  actors: {
    vault_validator: fromPromise(async () => {
      return {
        exists: await vault_exists(),
      }
    }),
    password_validator: fromPromise(
      async ({
        input,
      }: {
        input: {
          password: string
        }
      }) => {
        const valid = await validate_password(
          input.password,
        )
        return { valid }
      },
    ),
  },
  guards: {
    is_valid_password: ({ event }) => {
      if (
        event.type === "UNLOCK_WALLET" ||
        event.type === "SAVE_MNEMONICS"
      ) {
        const validPassword = v.safeParse(
          PasswordSchema,
          event.password,
        ).success
        return validPassword
      }
      return false
    },
    are_valid_mnemonics: ({ event }) => {
      if (event.type === "SAVE_MNEMONICS") {
        const mnemonics = v.safeParse(
          MnemonicsSchema,
          event.mnemonics,
        ).success
        return mnemonics
      }
      return false
    },
  },
  actions: {
    go_to_mnemonics: ({ context }) => {
      context.view.send({
        type: "SET_VIEW",
        view: "mnemonics",
      })
    },
    go_to_wallet: ({ context }) => {
      context.view.send({
        type: "SET_VIEW",
        view: "wallet",
      })
    },
    go_to_password: ({ context }) => {
      context.view.send({
        type: "SET_VIEW",
        view: "password",
      })
    },
    save_mnemonics: ({ event }) => {
      if (event.type === "SAVE_MNEMONICS") {
        set_vault(event.mnemonics, event.password)
      }
    },
  },
})

export const authentication_machine =
  authentication_setup.createMachine({
    id: "authentication",
    initial: "locked",
    context: ({ input }) => {
      return {
        view: input.view,
      }
    },
    states: {
      locked: {
        initial: "validating",
        states: {
          validating: {
            invoke: {
              src: "vault_validator",
              onDone: [
                {
                  guard: ({ event }) => {
                    return event.output.exists
                  },
                  target: "password",
                },
                {
                  target: "mnemonics",
                },
              ],
            },
          },
          mnemonics: {
            entry: ["go_to_mnemonics"],
            on: {
              SAVE_MNEMONICS: {
                guard: and([
                  "is_valid_password",
                  "are_valid_mnemonics",
                ]),
                actions: ["save_mnemonics"],
                target: "password",
              },
            },
          },
          password: {
            entry: ["go_to_password"],
            initial: "idle",
            states: {
              idle: {
                on: {
                  UNLOCK_WALLET: {
                    guard: "is_valid_password",
                    target: "validating",
                  },
                },
              },
              validating: {
                invoke: {
                  src: "password_validator",
                  input: ({ event }) => {
                    invariant(
                      event.type === "UNLOCK_WALLET",
                      "expected UNLOCK_WALLET event",
                    )
                    return { password: event.password }
                  },
                  onDone: [
                    {
                      guard: ({ event }) => {
                        return event.output.valid
                      },
                      target: "#authentication.unlocked",
                    },
                    {
                      target: "idle",
                    },
                  ],
                  onError: {
                    target:
                      "#authentication.locked.password",
                  },
                },
              },
            },
          },
        },
      },
      unlocked: {
        entry: ["go_to_wallet"],
        on: {
          LOCK: {
            target: "locked",
          },
        },
      },
    },
  })
export type AuthenticationMachine =
  typeof authentication_machine

export function useAuthenticationMachine({
  view,
}: {
  view: ActorRefFrom<ViewMachine>
}) {
  return useMachine(authentication_machine, {
    input: {
      view: view,
    },
  })
}
export type Authentication = ReturnType<
  typeof useAuthenticationMachine
>
