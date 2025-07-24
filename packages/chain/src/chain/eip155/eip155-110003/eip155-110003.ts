/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_110003 = {
  "name": "QuarkChain Devnet Shard 2",
  "shortName": "qkc-d-s2",
  "chain": "QuarkChain",
  "rpc": [
    "https://devnet-s2-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39902"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "chainId": 110003,
  "networkId": 110003,
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/2",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-110000"
  }
} satisfies Chain