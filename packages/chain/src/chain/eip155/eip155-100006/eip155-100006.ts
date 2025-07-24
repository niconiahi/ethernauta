/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_100006 = {
  "name": "QuarkChain Mainnet Shard 5",
  "shortName": "qkc-s5",
  "chain": "QuarkChain",
  "rpc": [
    "https://mainnet-s5-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39005"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "chainId": 100006,
  "networkId": 100006,
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/5",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-100000"
  }
} satisfies Chain