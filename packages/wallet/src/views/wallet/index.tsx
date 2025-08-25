import { eip155_11155111 } from "@ethernauta/chain"
import {
  type Block,
  eth_blockNumber,
  eth_getBlockByNumber,
  type TransactionInfo,
  TransactionInfoSchema,
} from "@ethernauta/eth"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { invariant } from "@ethernauta/utils"
import { useEffect, useState } from "preact/hooks"
import { array, parse } from "valibot"
import {
  balance,
  fetch_balance,
  wei_to_eth,
} from "../../utils/balance"
import {
  hex_to_number,
  number_to_hex,
} from "../../utils/crypto"
import { wallet } from "../../utils/wallet"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://muddy-radial-borough.ethereum-sepolia.quiknode.pro/e0d1ca422dd966c7b388455f296fb1483f738bef/"
const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: NAMESPACE.ETHEREUM,
  reference: eip155_11155111.chainId,
})
const reader = create_reader([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
  },
])
const BLOCK_AMOUNT = 30
async function get_blocks() {
  const readable = eth_blockNumber()
  const block_number = hex_to_number(
    await readable(reader(SEPOLIA_CHAIN_ID)),
  )
  const blocks: Block[] = []
  for (
    let x = block_number - BLOCK_AMOUNT;
    x <= block_number;
    x++
  ) {
    const readable = eth_getBlockByNumber([
      number_to_hex(x),
      true,
    ])
    const block = await readable(reader(SEPOLIA_CHAIN_ID))
    if (!block) continue
    blocks.push(block)
  }
  return blocks
}

export function Wallet() {
  const [loading, setLoading] = useState<boolean>(false)
  const [transactions, setTransactions] = useState<
    TransactionInfo[]
  >([])
  const address = wallet.value.address as `0x${string}`
  useEffect(() => {
    async function run() {
      const _balance = await fetch_balance(address)
      balance.value = _balance
    }
    run()
  }, [])
  useEffect(() => {
    async function run() {
      setLoading(true)
      const blocks = await get_blocks()
      const transactions = parse(
        array(TransactionInfoSchema),
        blocks
          .flatMap((block) => {
            return block.transactions.map((transaction) => {
              invariant(
                typeof transaction === "object",
                "transaction should be an object",
              )
              return transaction
            })
          })
          .filter((transaction) => {
            return (
              transaction.from === wallet.value.address &&
              hex_to_number(transaction.value) > 0
            )
          }),
      )
      setTransactions(transactions)
      setLoading(false)
    }
    run()
  }, [])
  return (
    <main className="flex flex-col gap-2 p-2">
      <p className="flex gap-1 text-base">
        <span>Address:</span>
        <span className="underline underline-offset-2 decoration-[#FF5005]">
          {truncate(address, 5)}
        </span>
      </p>
      <p className="flex gap-1 text-base">
        <span>Balance:</span>
        <span className="underline underline-offset-2 decoration-[#FF5005]">
          {strip_decimals(wei_to_eth(balance.value), 5)}
        </span>{" "}
        ETH
      </p>
      {loading ? (
        <span>loading past transfers</span>
      ) : (
        <ul>
          {transactions.map((transaction) => {
            return (
              <li key={`transfer_${transaction.value}`}>
                <p>{transaction.from}</p>
                <p>{transaction.to}</p>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}

function truncate(address: string, amount: number) {
  return (
    address.slice(0, amount) +
    "..." +
    address.slice(address.length - amount, address.length)
  )
}

function strip_decimals(address: string, amount: number) {
  const comma = address.indexOf(".")
  return address.slice(0, comma + amount + 1)
}
