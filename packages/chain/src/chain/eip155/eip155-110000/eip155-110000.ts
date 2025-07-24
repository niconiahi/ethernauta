/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_110000 = {
  "name": "QuarkChain Devnet Root",
  "shortName": "qkc-d-r",
  "chain": "QuarkChain",
  "rpc": [
    "http://jrpc.devnet.quarkchain.io:38391"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "QKC",
    "symbol": "QKC",
    "decimals": 18
  },
  "infoURL": "https://www.quarkchain.io",
  "chainId": 110000,
  "networkId": 110000
} satisfies Chain