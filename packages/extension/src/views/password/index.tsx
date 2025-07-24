import type { Authentication } from "../../machines/authentication"
import { useState } from "preact/hooks"

export function Password({
  authentication,
}: {
  authentication: Authentication
}) {
  const [password, setPassword] = useState("")
  return (
    <div>
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
            type: "UNLOCK_WALLET",
            password,
          })
        }}
      >
        unlock
      </button>
    </div>
  )
}
