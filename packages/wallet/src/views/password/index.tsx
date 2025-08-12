import { useState } from "preact/hooks"
import { set_timestamp } from "../../utils/authentication"
import { validate_password } from "../../utils/vault"
import { view } from "../../utils/view"
import { set_wallet } from "../../utils/wallet"

export function Password() {
  const [password, set_password] = useState("")
  return (
    <main className="flex flex-col gap-2 p-2">
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
          const valid = await validate_password(password)
          if (!valid) return
          await set_timestamp()
          await set_wallet(password)
          view.value = "wallet"
        }}
      >
        Unlock
      </button>
    </main>
  )
}
