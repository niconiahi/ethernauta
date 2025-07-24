/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_100007 = {
  "name": "QuarkChain Mainnet Shard 6",
  "shortName": "qkc-s6",
  "chain": "QuarkChain",
  "rpc": [
    "https://mainnet-s6-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39006"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "chainId": 100007,
  "networkId": 100007,
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/6",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-100000"
  }
} satisfies Chain