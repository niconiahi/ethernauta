/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1718 = {
  "name": "Palette Chain Mainnet",
  "shortName": "PCM",
  "chain": "PLT",
  "icon": "PLT",
  "rpc": [
    "https://palette-rpc.com:22000"
  ],
  "faucets": [],
  "features": [],
  "nativeCurrency": {
    "name": "Palette Token",
    "symbol": "PLT",
    "decimals": 18
  },
  "infoURL": "https://hashpalette.com/",
  "chainId": 1718,
  "networkId": 1718,
  "explorers": [
    {
      "name": "Palettescan",
      "url": "https://palettescan.com",
      "standard": "none"
    }
  ]
} satisfies Chain