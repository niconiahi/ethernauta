/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_110001 = {
  "name": "QuarkChain Devnet Shard 0",
  "shortName": "qkc-d-s0",
  "chain": "QuarkChain",
  "rpc": [
    "https://devnet-s0-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39900"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "chainId": 110001,
  "networkId": 110001,
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/0",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-110000"
  }
} satisfies Chain