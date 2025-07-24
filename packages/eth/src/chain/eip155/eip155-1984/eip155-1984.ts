/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1984 = {
  "name": "Eurus Testnet",
  "shortName": "euntest",
  "chain": "EUN",
  "icon": "eurus",
  "rpc": [
    "https://testnet.eurus.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Eurus",
    "symbol": "EUN",
    "decimals": 18
  },
  "infoURL": "https://eurus.network",
  "chainId": 1984,
  "networkId": 1984,
  "slip44": 1,
  "explorers": [
    {
      "name": "testnetexplorer",
      "url": "https://testnetexplorer.eurus.network",
      "standard": "none"
    }
  ]
} satisfies Chain