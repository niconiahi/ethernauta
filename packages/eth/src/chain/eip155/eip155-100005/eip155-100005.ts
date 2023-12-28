/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_100005 = {
  "name": "QuarkChain Mainnet Shard 4",
  "shortName": "qkc-s4",
  "chain": "QuarkChain",
  "rpc": [
    "https://mainnet-s4-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39004"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "chainId": 100005,
  "networkId": 100005,
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/4",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-100000"
  }
} satisfies Chain