/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_100003 = {
  "name": "QuarkChain Mainnet Shard 2",
  "shortName": "qkc-s2",
  "chain": "QuarkChain",
  "rpc": [
    "https://mainnet-s2-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39002"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "chainId": 100003,
  "networkId": 100003,
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/2",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-100000"
  }
} satisfies Chain