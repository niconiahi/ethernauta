declare module "preact-robot" {
  import type {
    GetMachineTransitions,
    Machine,
    SendFunction,
    Service,
  } from "robot3"
  export function useMachine<M extends Machine>(
    machine: M,
    initialContext?: M["context"],
  ): [
    M["state"] & { context: M["context"] },
    SendFunction<GetMachineTransitions<M>>,
    Service<typeof machine>,
  ]
}

