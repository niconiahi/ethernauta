// Every parameterized Ethernauta method accepts two equivalent
// forms. Pick one style per codebase and stick to it.

import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import {
  eth_getBalance,
  eth_getTransactionCount,
} from "@ethernauta/eth"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

const reader = create_reader([
  {
    chainId: CHAIN_ID,
    transports: [
      http("https://ethereum-sepolia-rpc.publicnode.com"),
    ],
  },
])

const address =
  "0x636c0fcd6da2207abfa80427b556695a4ad0af94" as const

// Positional — matches the JSON-RPC spec ordering.
const balance_a = await eth_getBalance([address, "latest"])(
  reader({ chain_id: CHAIN_ID }),
)

// Named — more readable for complex calls.
const balance_b = await eth_getBalance({
  address,
  block: "latest",
})(reader({ chain_id: CHAIN_ID }))

// Single-arg methods accept either a 1-tuple or an object.
const nonce_a = await eth_getTransactionCount([
  address,
  "latest",
])(reader({ chain_id: CHAIN_ID }))

const nonce_b = await eth_getTransactionCount({
  address,
  block: "latest",
})(reader({ chain_id: CHAIN_ID }))

console.log({ balance_a, balance_b, nonce_a, nonce_b })
