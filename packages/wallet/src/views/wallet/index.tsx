import { useEffect } from "preact/hooks"
import { format_unit } from "@ethernauta/utils"
import { balance, fetch_balance } from "../../utils/balance"
import {
  get_chain_id,
  selected_chain,
} from "../../utils/chain"
import { view } from "../../utils/view"
import { active_account } from "../../utils/wallet"

export function Wallet() {
  const address = active_account.value
    .address as `0x${string}`
  useEffect(() => {
    async function run() {
      const _balance = await fetch_balance(address)
      balance.value = _balance
    }
    run()
  }, [selected_chain.value])
  return (
    <main className="flex flex-col gap-2 p-2">
      <button
        type="button"
        onClick={() => {
          view.value = "select-chain"
        }}
        className="self-start bg-white p-2 border-2 rounded-md cursor-pointer text-base"
      >
        {get_chain_id(selected_chain.value)} —{" "}
        {selected_chain.value.name}
      </button>
      <p className="flex gap-1 text-base">
        <span>Address:</span>
        <span className="underline underline-offset-2 decoration-[#FF5005]">
          {address}
        </span>
      </p>
      <p className="flex gap-1 text-base">
        <span>Balance:</span>
        <span className="underline underline-offset-2 decoration-[#FF5005]">
          {strip_decimals(format_unit(balance.value), 5)}
        </span>{" "}
        ETH
      </p>
    </main>
  )
}

function strip_decimals(address: string, amount: number) {
  const comma = address.indexOf(".")
  return address.slice(0, comma + amount + 1)
}
