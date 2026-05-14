import { useEffect } from "preact/hooks"
import {
  balance,
  fetch_balance,
  wei_to_eth,
} from "../../utils/balance"
import {
  CHAINS,
  get_chain_id,
  selected_chain,
} from "../../utils/chain"
import { wallet } from "../../utils/wallet"

export function Wallet() {
  const address = wallet.value.address as `0x${string}`
  useEffect(() => {
    async function run() {
      const _balance = await fetch_balance(address)
      balance.value = _balance
    }
    run()
  }, [selected_chain.value])
  return (
    <main className="flex flex-col gap-2 p-2">
      <select
        className="self-start bg-white p-2 border-2 rounded-md cursor-pointer text-base"
        value={selected_chain.value.id}
        onChange={(event) => {
          const id = Number(event.currentTarget.value)
          const chain = CHAINS.find((c) => c.id === id)
          if (chain) selected_chain.value = chain
        }}
      >
        {CHAINS.map((chain) => (
          <option key={chain.id} value={chain.id}>
            {get_chain_id(chain)} — {chain.name}
          </option>
        ))}
      </select>
      <p className="flex gap-1 text-base">
        <span>Address:</span>
        <span className="underline underline-offset-2 decoration-[#FF5005]">
          {address}
        </span>
      </p>
      <p className="flex gap-1 text-base">
        <span>Balance:</span>
        <span className="underline underline-offset-2 decoration-[#FF5005]">
          {strip_decimals(wei_to_eth(balance.value), 5)}
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
