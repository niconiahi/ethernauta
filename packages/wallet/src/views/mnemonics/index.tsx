import { useState } from "preact/hooks"
import { minLength, pipe, safeParse, string } from "valibot"
import { Button } from "../../components/button"
import { set_timestamp } from "../../utils/authentication"
import {
  set_vault,
  validate_mnemonic,
} from "../../utils/vault"
import { view } from "../../utils/view"

const PasswordSchema = pipe(string(), minLength(8))
const MnemonicsSchema = pipe(string(), minLength(1))

export function Mnemonics() {
  const [password, set_password] = useState("")
  const [mnemonics, set_mnemonics] = useState("")
  const [error, set_error] = useState("")
  return (
    <main className="flex flex-col gap-2 p-2">
      <input
        placeholder="Mnemonics"
        value={mnemonics}
        className="p-2 border-2 rounded-md cursor-pointer text-base"
        onInput={(event) => {
          const value = event.currentTarget.value
          set_mnemonics(value)
          set_error("")
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        className="p-2 border-2 rounded-md cursor-pointer text-base"
        onInput={(event) => {
          const value = event.currentTarget.value
          set_password(value)
          set_error("")
        }}
      />
      {error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : null}
      <Button
        onClick={async () => {
          const mnemonics_result = safeParse(
            MnemonicsSchema,
            mnemonics,
          )
          if (!mnemonics_result.success) {
            set_error(mnemonics_result.issues[0].message)
            return
          }
          if (!validate_mnemonic(mnemonics_result.output)) {
            set_error(
              "Invalid mnemonic: must be 12, 15, 18, 21, or 24 words",
            )
            return
          }
          const password_result = safeParse(
            PasswordSchema,
            password,
          )
          if (!password_result.success) {
            set_error(password_result.issues[0].message)
            return
          }
          await set_vault(
            mnemonics_result.output,
            password_result.output,
          )
          await set_timestamp()
          view.value = "password"
        }}
      >
        Save wallet
      </Button>
    </main>
  )
}
