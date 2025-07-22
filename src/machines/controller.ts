import {
  createMachine,
  state,
  transition,
  type SendFunction,
  type GetMachineTransitions,
  type AllStateKeys,
} from "robot3"

function context() {
  return {
    user: "Andy",
  }
}
export const controller_machine = createMachine(
  {
    locked: state(transition("unlock", "unlocked")),
    unlocked: state(transition("lock", "locked")),
  },
  context,
)
export type ControllerMachine = typeof controller_machine
export type ControllerSend = SendFunction<
  GetMachineTransitions<ControllerMachine>
>
export type ControllerState = ControllerMachine["state"] & {
  context: ControllerMachine["context"]
}
