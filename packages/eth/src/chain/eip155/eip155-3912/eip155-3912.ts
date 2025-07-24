/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3912 = {
  "name": "DRAC Network",
  "shortName": "drac",
  "chain": "DRAC",
  "icon": "drac",
  "rpc": [
    "https://www.dracscan.com/rpc"
  ],
  "faucets": [
    "https://www.dracscan.io/faucet"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "DRAC",
    "symbol": "DRAC",
    "decimals": 18
  },
  "infoURL": "https://drac.io/",
  "chainId": 3912,
  "networkId": 3912,
  "explorers": [
    {
      "name": "DRAC_Network Scan",
      "url": "https://www.dracscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain