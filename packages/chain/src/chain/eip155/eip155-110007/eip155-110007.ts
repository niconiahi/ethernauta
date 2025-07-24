/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_110007 = {
  "name": "QuarkChain Devnet Shard 6",
  "shortName": "qkc-d-s6",
  "chain": "QuarkChain",
  "rpc": [
    "https://devnet-s6-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39906"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "chainId": 110007,
  "networkId": 110007,
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/6",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-110000"
  }
} satisfies Chain