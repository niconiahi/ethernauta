import { useState } from "preact/hooks"
import type {
  ControllerSend,
  ControllerState,
} from "@machines/controller"
import { set_vault, get_vault } from "@utils/vault"

export function Unlocked({
  state,
  send,
}: {
  state: ControllerState
  send: ControllerSend
}) {
  const [message, setMessage] = useState("")
  const [password, setPassword] = useState("test123")
  const current = state.name
  const handleStore = async () => {
    await set_vault("hello world", password)
  }
  const handleRetrieve = async () => {
    const message = await get_vault(password)
    setMessage(message)
  }
  return (
    <div>
      <span>the current state is {current}</span>
      <div
        style={{
          margin: "20px 0",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <h3>Vault Test</h3>
        <input
          type="password"
          value={password}
          onInput={(e) =>
            setPassword(
              (e.target as HTMLInputElement).value,
            )
          }
          placeholder="Password"
        />
        <br />
        <button type="button" onClick={handleStore}>
          Store "hello world"
        </button>
        <button type="button" onClick={handleRetrieve}>
          Retrieve
        </button>
        {message && <p>{message}</p>}
      </div>

      <button
        type="button"
        onClick={() => {
          send("lock")
        }}
      >
        lock
      </button>
    </div>
  )
}
