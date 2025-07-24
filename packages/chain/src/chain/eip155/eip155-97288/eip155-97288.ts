/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_97288 = {
  "name": "Boba BNB Mainnet Old",
  "shortName": "BobaBnbOld",
  "chain": "Boba BNB Mainnet",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "chainId": 97288,
  "networkId": 97288,
  "explorers": [
    {
      "name": "Boba BNB block explorer",
      "url": "https://blockexplorer.bnb.boba.network",
      "standard": "none"
    }
  ],
  "status": "deprecated"
} satisfies Chain