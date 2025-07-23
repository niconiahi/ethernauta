import { useState } from "preact/hooks"
import type { ViewSend, ViewState } from "@machines/view"

export function Mnemonics({
  state,
  send,
}: {
  state: ViewState
  send: ViewSend
}) {
  const [address, setAddress] = useState("")
  const [mnemonic, setMnemonic] = useState("")
  return (
    <main>
      <span>the current state is {state.value}</span>
      <input
        placeholder="Mnemonic"
        value={mnemonic}
        onInput={(event) => {
          const value = event.currentTarget.value
          setMnemonic(value)
        }}
      />
      <input
        placeholder="Address"
        value={address}
        onInput={(event) => {
          const value = event.currentTarget.value
          setAddress(value)
        }}
      />
      <button
        type="button"
        onClick={() => {
          // Now you get full type safety and autocomplete!
          send({
            type: "unlock",
            mnemonics: mnemonic,
            address,
          })
        }}
      >
        unlock
      </button>
    </main>
  )
}
