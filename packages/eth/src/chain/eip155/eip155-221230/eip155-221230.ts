/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_221230 = {
  "name": "Reapchain Mainnet",
  "shortName": "reap",
  "chain": "REAP",
  "icon": "reapchain",
  "rpc": [
    "https://eth.reapchain.org"
  ],
  "faucets": [],
  "features": [],
  "nativeCurrency": {
    "name": "Reap",
    "symbol": "REAP",
    "decimals": 18
  },
  "infoURL": "https://reapchain.com",
  "chainId": 221230,
  "networkId": 221230,
  "explorers": [
    {
      "name": "Reapchain Dashboard",
      "url": "https://dashboard.reapchain.org",
      "standard": "none"
    }
  ]
} satisfies Chain