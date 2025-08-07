/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_7775 = {
  "name": "GDCC TESTNET",
  "shortName": "GDCC",
  "chain": "GDCC",
  "icon": "gdcc",
  "rpc": [
    "https://testnet-rpc1.gdccscan.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GDCC",
    "symbol": "GDCC",
    "decimals": 18
  },
  "infoURL": "https://gdcchain.com",
  "chainId": 7775,
  "networkId": 7775,
  "explorers": [
    {
      "name": "GDCC",
      "url": "https://testnet.gdccscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain