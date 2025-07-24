/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_100008 = {
  "name": "QuarkChain Mainnet Shard 7",
  "shortName": "qkc-s7",
  "chain": "QuarkChain",
  "rpc": [
    "https://mainnet-s7-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39007"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "chainId": 100008,
  "networkId": 100008,
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/7",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-100000"
  }
} satisfies Chain