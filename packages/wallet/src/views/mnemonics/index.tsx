import { useState } from "preact/hooks"
import { minLength, parse, pipe, string } from "valibot"
import { set_timestamp } from "../../utils/authentication"
import { set_vault } from "../../utils/vault"
import { view } from "../../utils/view"

const PasswordSchema = pipe(string(), minLength(8))
const MnemonicsSchema = pipe(string(), minLength(1))

export function Mnemonics() {
  const [password, set_password] = useState("")
  const [mnemonics, set_mnemonics] = useState(
    "smile price bomb movie minimum treat hurdle adult wing come space cross",
  )
  return (
    <main className="flex flex-col gap-2 p-2">
      <input
        placeholder="Mnemonics"
        value={mnemonics}
        className="p-2 border-2 rounded-md cursor-pointer text-base"
        onInput={(event) => {
          const value = event.currentTarget.value
          set_mnemonics(value)
        }}
      />
      <input
        placeholder="Password"
        value={password}
        className="p-2 border-2 rounded-md cursor-pointer text-base"
        onInput={(event) => {
          const value = event.currentTarget.value
          set_password(value)
        }}
      />
      <button
        type="button"
        className="bg-[#FF5005] border-2 rounded-md p-2 cursor-pointer text-base"
        onClick={async () => {
          const _mnemonics = parse(
            MnemonicsSchema,
            mnemonics,
          )
          const _password = parse(PasswordSchema, password)
          set_vault(_mnemonics, _password)
          await set_timestamp()
          view.value = "password"
        }}
      >
        Save wallet
      </button>
    </main>
  )
}
