/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_110002 = {
  "name": "QuarkChain Devnet Shard 1",
  "shortName": "qkc-d-s1",
  "chain": "QuarkChain",
  "rpc": [
    "https://devnet-s1-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39901"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "chainId": 110002,
  "networkId": 110002,
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/1",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-110000"
  }
} satisfies Chain