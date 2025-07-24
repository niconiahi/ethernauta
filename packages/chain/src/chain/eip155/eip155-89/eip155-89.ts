/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_89 = {
  "name": "TomoChain Testnet",
  "shortName": "tomot",
  "chain": "TOMO",
  "rpc": [
    "https://rpc.testnet.tomochain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TomoChain",
    "symbol": "TOMO",
    "decimals": 18
  },
  "infoURL": "https://tomochain.com",
  "chainId": 89,
  "networkId": 89,
  "slip44": 1
} satisfies Chain