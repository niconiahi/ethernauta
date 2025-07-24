/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_100001 = {
  "name": "QuarkChain Mainnet Shard 0",
  "shortName": "qkc-s0",
  "chain": "QuarkChain",
  "rpc": [
    "https://mainnet-s0-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39000"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "chainId": 100001,
  "networkId": 100001,
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/0",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-100000"
  }
} satisfies Chain