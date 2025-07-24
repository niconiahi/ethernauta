/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_110005 = {
  "name": "QuarkChain Devnet Shard 4",
  "shortName": "qkc-d-s4",
  "chain": "QuarkChain",
  "rpc": [
    "https://devnet-s4-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39904"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "chainId": 110005,
  "networkId": 110005,
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/4",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-110000"
  }
} satisfies Chain