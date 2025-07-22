import type {
  ControllerSend,
  ControllerState,
} from "@machines/controller"

export function Locked({
  state,
  send,
}: {
  state: ControllerState
  send: ControllerSend
}) {
  const current = state.name
  return (
    <div>
      <span>the current state is {current}</span>
      <button
        type="button"
        onClick={() => {
          send("unlock")
        }}
      >
        unlock
      </button>
    </div>
  )
}
