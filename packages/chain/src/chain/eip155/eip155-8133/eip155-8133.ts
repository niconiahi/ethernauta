/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8133 = {
  "name": "Qitmeer Network Privnet",
  "shortName": "meerpriv",
  "chain": "MEER",
  "icon": "meer",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Qitmeer Privnet",
    "symbol": "MEER-P",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "chainId": 8133,
  "networkId": 8133,
  "status": "incubating"
} satisfies Chain