/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_5051 = {
  "name": "Nollie Skatechain Testnet",
  "shortName": "nollie-testnet",
  "chain": "Skatechain",
  "icon": "nollie",
  "rpc": [
    "https://nollie-rpc.skatechain.org/"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 5051,
  "networkId": 5051,
  "explorers": [
    {
      "name": "Nollie Skate Chain Testnet Explorer",
      "url": "https://nolliescan.skatechain.org",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain