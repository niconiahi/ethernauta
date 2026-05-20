import { useState } from "preact/hooks"
import { Button } from "../../components/button"
import {
  get_chain,
  parse_chain_input,
  select_chain,
} from "../../utils/chain"
import { view } from "../../utils/view"

export function SelectChain() {
  const [input, set_input] = useState("")
  const [error, set_error] = useState<string | null>(null)
  function submit(event: Event) {
    event.preventDefault()
    const id = parse_chain_input(input)
    if (id === undefined) {
      set_error(
        "expected decimal (1), hex (0x1), or CAIP-2 (eip155:1)",
      )
      return
    }
    const chain = get_chain(id)
    if (!chain) {
      set_error(
        `chain ${id} is not in the wallet's registry`,
      )
      return
    }
    select_chain(chain)
    view.value = "wallet"
  }
  return (
    <main className="flex flex-col gap-3 p-4 w-80 text-base">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-bold leading-tight">
          Select a chain
        </h1>
        <p className="text-xs text-gray-500">
          Type a chain id — decimal, hex, or CAIP-2.
        </p>
      </header>
      <form
        className="flex flex-col gap-2"
        onSubmit={submit}
      >
        <input
          type="text"
          className="bg-white p-2 border-2 rounded-md text-base font-mono"
          value={input}
          placeholder="e.g. 1, 0xaa36a7, eip155:11155111"
          onInput={(event) => {
            set_input(event.currentTarget.value)
            set_error(null)
          }}
          autoFocus
        />
        {error && (
          <p className="text-xs text-red-700">{error}</p>
        )}
        <Button type="submit">Switch</Button>
        <Button
          variant="secondary"
          onClick={() => {
            view.value = "wallet"
          }}
        >
          Cancel
        </Button>
      </form>
    </main>
  )
}
