import type { ViewMachine } from "@machines/view"
import type { SnapshotFrom, ActorRefFrom } from "xstate"

type Props = {
  snapshot: SnapshotFrom<ViewMachine>
  send: ActorRefFrom<ViewMachine>["send"]
}

export function Locked({ snapshot, send }: Props) {
  const current = snapshot.value
  return (
    <div>
      <span>the current state is {current}</span>
      <button
        type="button"
        onClick={() => {
          send({
            type: "unlock",
            mnemonics: "",
            address: "",
          })
        }}
      >
        unlock
      </button>
    </div>
  )
}
