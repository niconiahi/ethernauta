/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_110008 = {
  "name": "QuarkChain Devnet Shard 7",
  "shortName": "qkc-d-s7",
  "chain": "QuarkChain",
  "rpc": [
    "https://devnet-s7-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39907"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "chainId": 110008,
  "networkId": 110008,
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/7",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-110000"
  }
} satisfies Chain