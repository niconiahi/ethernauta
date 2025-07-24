/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_110004 = {
  "name": "QuarkChain Devnet Shard 3",
  "shortName": "qkc-d-s3",
  "chain": "QuarkChain",
  "rpc": [
    "https://devnet-s3-ethapi.quarkchain.io",
    "http://eth-jrpc.devnet.quarkchain.io:39903"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "chainId": 110004,
  "networkId": 110004,
  "explorers": [
    {
      "name": "quarkchain-devnet",
      "url": "https://devnet.quarkchain.io/3",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-110000"
  }
} satisfies Chain