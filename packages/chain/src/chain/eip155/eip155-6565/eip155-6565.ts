/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_6565 = {
  "name": "Fox Testnet Network",
  "shortName": "fox",
  "chain": "FOX",
  "icon": "fox",
  "rpc": [
    "https://rpc-testnet-v1.foxchain.app/",
    "https://rpc2-testnet-v1.foxchain.app/",
    "https://rpc3-testnet-v1.foxchain.app"
  ],
  "faucets": [
    "https://faucet.foxchain.app"
  ],
  "nativeCurrency": {
    "name": "FOX Native Token",
    "symbol": "tFOX",
    "decimals": 18
  },
  "infoURL": "https://foxchain.app",
  "chainId": 6565,
  "networkId": 6565,
  "slip44": 1,
  "explorers": [
    {
      "name": "FOX Testnet Explorer",
      "url": "https://testnet.foxscan.app",
      "standard": "none"
    }
  ]
} satisfies Chain