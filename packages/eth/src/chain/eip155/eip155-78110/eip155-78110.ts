/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_78110 = {
  "name": "Firenze test network",
  "shortName": "firenze",
  "chain": "ETH",
  "rpc": [
    "https://ethnode.primusmoney.com/firenze"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Firenze Ether",
    "symbol": "FIN",
    "decimals": 18
  },
  "infoURL": "https://primusmoney.com",
  "chainId": 78110,
  "networkId": 78110,
  "slip44": 1
} satisfies Chain