import { useState } from "preact/hooks"
import * as v from "valibot"
import { set_vault } from "../../utils/vault"
import { view } from "../../utils/view"
import { set_timestamp } from "../../utils/authentication"

const PasswordSchema = v.pipe(v.string(), v.minLength(8))
const MnemonicsSchema = v.pipe(v.string(), v.minLength(1))

export function Mnemonics() {
  const [password, set_password] = useState("")
  const [mnemonics, set_mnemonics] = useState(
    "smile price bomb movie minimum treat hurdle adult wing come space cross",
  )
  return (
    <main>
      <input
        placeholder="Mnemonics"
        value={mnemonics}
        onInput={(event) => {
          const value = event.currentTarget.value
          set_mnemonics(value)
        }}
      />
      <input
        placeholder="Password"
        value={password}
        onInput={(event) => {
          const value = event.currentTarget.value
          set_password(value)
        }}
      />
      <button
        type="button"
        onClick={async () => {
          const _mnemonics = v.parse(
            MnemonicsSchema,
            mnemonics,
          )
          const _password = v.parse(
            PasswordSchema,
            password,
          )
          set_vault(_mnemonics, _password)
          await set_timestamp()
          view.value = "password"
        }}
      >
        save wallet
      </button>
    </main>
  )
}
