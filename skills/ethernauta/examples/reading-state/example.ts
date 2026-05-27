// Reading raw chain state via Readable methods.

import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import {
  eth_blockNumber,
  eth_getBalance,
  eth_getTransactionCount,
} from "@ethernauta/eth"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

const reader = create_reader([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [
      http("https://ethereum-sepolia-rpc.publicnode.com"),
    ],
  },
])

const address =
  "0x636c0fcd6da2207abfa80427b556695a4ad0af94" as const

// Two-step: method(args) returns Readable, then apply the resolver.
const balance = await eth_getBalance([address, "latest"])(
  reader({ chain_id: SEPOLIA_CHAIN_ID }),
)

const nonce = await eth_getTransactionCount([
  address,
  "latest",
])(reader({ chain_id: SEPOLIA_CHAIN_ID }))

const block = await eth_blockNumber()(
  reader({ chain_id: SEPOLIA_CHAIN_ID }),
)

console.log({ balance, nonce, block })
