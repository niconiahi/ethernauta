/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_221231 = {
  "name": "Reapchain Testnet",
  "shortName": "reap-testnet",
  "chain": "REAP",
  "icon": "reapchain",
  "rpc": [
    "https://test-eth.reapchain.org"
  ],
  "faucets": [
    "http://faucet.reapchain.com"
  ],
  "features": [],
  "nativeCurrency": {
    "name": "test-Reap",
    "symbol": "tREAP",
    "decimals": 18
  },
  "infoURL": "https://reapchain.com",
  "chainId": 221231,
  "networkId": 221231,
  "slip44": 1,
  "explorers": [
    {
      "name": "Reapchain Testnet Dashboard",
      "url": "https://test-dashboard.reapchain.org",
      "standard": "none"
    }
  ]
} satisfies Chain