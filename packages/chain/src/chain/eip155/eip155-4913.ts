/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_4913 = {
  "name": "OEV Network",
  "shortName": "oev-network",
  "chain": "oev-network",
  "icon": "oev-network",
  "rpc": [
    "https://oev.rpc.api3.org",
    "https://oev-network.calderachain.xyz/http"
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
  "infoURL": "https://api3.org/oev/",
  "chainId": 4913,
  "networkId": 4913,
  "explorers": [
    {
      "name": "OEV Network Explorer",
      "url": "https://oev.explorer.api3.org",
      "standard": "EIP3091"
    },
    {
      "name": "OEV Network Caldera Explorer",
      "url": "https://oev-network.calderaexplorer.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain