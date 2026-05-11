import { useState } from "preact/hooks"
import { Button } from "../../components/button"
import { set_timestamp } from "../../utils/authentication"
import { validate_password } from "../../utils/vault"
import { view } from "../../utils/view"
import { set_wallet } from "../../utils/wallet"

export function Password() {
  const [password, set_password] = useState("")
  const [error, set_error] = useState("")
  return (
    <main className="flex flex-col gap-2 p-2">
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
          const valid = await validate_password(password)
          if (!valid) {
            set_error("Invalid password")
            return
          }
          await set_timestamp()
          await set_wallet(password)
          view.value = "wallet"
        }}
      >
        Unlock
      </Button>
    </main>
  )
}
