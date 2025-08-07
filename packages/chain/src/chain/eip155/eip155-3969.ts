/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_3969 = {
  "name": "PayNetwork Mainnet",
  "shortName": "paynetwork",
  "chain": "paynetwork",
  "icon": "paynetwork",
  "rpc": [
    "https://rpc.paynetwork.io",
    "https://paynetwork-main.calderachain.xyz/http"
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
    "name": "PayNetwork",
    "symbol": "Pay",
    "decimals": 18
  },
  "infoURL": "https://paynetwork-main.hub.caldera.xyz",
  "chainId": 3969,
  "networkId": 3969,
  "explorers": [
    {
      "name": "PayNetwork Mainnet Caldera Explorer",
      "url": "https://paynetwork-main.calderaexplorer.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain