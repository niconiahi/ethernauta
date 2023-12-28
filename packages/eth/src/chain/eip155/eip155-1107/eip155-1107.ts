/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1107 = {
  "name": "BLXq Testnet",
  "shortName": "tblxq",
  "chain": "BLXQ",
  "icon": "blxq",
  "rpc": [
    "https://testnetq1.blx.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BLXQ",
    "symbol": "BLXQ",
    "decimals": 18
  },
  "infoURL": "https://blx.org",
  "chainId": 1107,
  "networkId": 1107,
  "slip44": 1,
  "explorers": [
    {
      "name": "BLXq Explorer",
      "url": "https://explorer.blx.org",
      "standard": "none"
    }
  ]
} satisfies Chain