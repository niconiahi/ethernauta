/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_91111 = {
  "name": "Henez Chain Mainnet",
  "shortName": "henez",
  "chain": "henez",
  "icon": "henez",
  "rpc": [
    "https://henez.calderachain.xyz/http"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.henez.fi/",
  "chainId": 91111,
  "networkId": 91111,
  "explorers": [
    {
      "name": "Henez Chain Mainnet Caldera Explorer",
      "url": "https://henez.calderaexplorer.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain