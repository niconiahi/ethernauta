/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_110006 = {
  "name": "QuarkChain Devnet Shard 5",
  "shortName": "qkc-d-s5",
  "chain": "QuarkChain",
  "rpc": [
    "https://devnet-s5-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39905"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "chainId": 110006,
  "networkId": 110006,
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/5",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-110000"
  }
} satisfies Chain