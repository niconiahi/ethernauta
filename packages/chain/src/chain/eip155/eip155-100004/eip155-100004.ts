/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_100004 = {
  "name": "QuarkChain Mainnet Shard 3",
  "shortName": "qkc-s3",
  "chain": "QuarkChain",
  "rpc": [
    "https://mainnet-s3-ethapi.quarkchain.io",
    "http://eth-jrpc.mainnet.quarkchain.io:39003"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "chainId": 100004,
  "networkId": 100004,
  "explorers": [
    {
      "name": "quarkchain-mainnet",
      "url": "https://mainnet.quarkchain.io/3",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-100000"
  }
} satisfies Chain