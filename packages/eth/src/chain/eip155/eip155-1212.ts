/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1212 = {
  "name": "ADF Chain Testnet",
  "shortName": "tADF",
  "chain": "ADF Chain Testnet",
  "icon": "addfilltest",
  "rpc": [
    "https://testnet.adftechnology.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ADDFILL Testnet",
    "symbol": "tADF",
    "decimals": 18
  },
  "infoURL": "https://www.adfstarworld.com/",
  "chainId": 1212,
  "networkId": 1212,
  "explorers": [
    {
      "name": "ADF Testnet explorer",
      "url": "https://testnet-explorer.adftechnology.com",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain