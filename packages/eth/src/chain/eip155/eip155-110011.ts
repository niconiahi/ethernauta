/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_110011 = {
  "name": "QuarkChain L2 Testnet",
  "shortName": "qkc-l2-t",
  "chain": "QuarkChain",
  "rpc": [
    "https://testnet-l2-ethapi.quarkchain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "chainId": 110011,
  "networkId": 110011,
  "parent": {
    "type": "L2",
    "chain": "eip155-110000"
  }
} satisfies Chain