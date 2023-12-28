/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_100002 = {
  "name": "QuarkChain Mainnet Shard 1",
  "shortName": "qkc-s1",
  "chain": "QuarkChain",
  "rpc": [
    "https://mainnet-s1-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39001"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "chainId": 100002,
  "networkId": 100002,
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/1",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-100000"
  }
} satisfies Chain