/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_63157 = {
  "name": "Geist Mainnet",
  "shortName": "geist",
  "chain": "Geist",
  "icon": "geist",
  "rpc": [
    "https://geist-mainnet.g.alchemy.com/public"
  ],
  "faucets": [],
  "features": [],
  "nativeCurrency": {
    "name": "Aavegotchi GHST Token",
    "symbol": "GHST",
    "decimals": 18
  },
  "infoURL": "https://playongeist.com",
  "chainId": 63157,
  "networkId": 63157,
  "explorers": [
    {
      "name": "Geist Explorer",
      "url": "https://geist-mainnet.explorer.alchemy.com",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain