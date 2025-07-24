import { useState } from "preact/hooks"
import type { Authentication } from "../../machines/authentication"

export function Mnemonics({
  authentication,
}: {
  authentication: Authentication
}) {
  const [password, setPassword] = useState("")
  const [mnemonics, setMnemonics] = useState(
    "smile price bomb movie minimum treat hurdle adult wing come space cross",
  )
  return (
    <main>
      <input
        placeholder="Mnemonics"
        value={mnemonics}
        onInput={(event) => {
          const value = event.currentTarget.value
          setMnemonics(value)
        }}
      />
      <input
        placeholder="Password"
        value={password}
        onInput={(event) => {
          const value = event.currentTarget.value
          setPassword(value)
        }}
      />
      <button
        type="button"
        onClick={() => {
          authentication[1]({
            type: "SAVE_MNEMONICS",
            password: password,
            mnemonics: mnemonics,
          })
        }}
      >
        save wallet
      </button>
    </main>
  )
}
