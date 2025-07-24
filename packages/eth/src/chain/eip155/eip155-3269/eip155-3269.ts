/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3269 = {
  "name": "Dubxcoin network",
  "shortName": "dubx",
  "chain": "DUBX",
  "rpc": [
    "https://rpcmain.arabianchain.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dubxcoin mainnet",
    "symbol": "DUBX",
    "decimals": 18
  },
  "infoURL": "https://arabianchain.org",
  "chainId": 3269,
  "networkId": 3269
} satisfies Chain