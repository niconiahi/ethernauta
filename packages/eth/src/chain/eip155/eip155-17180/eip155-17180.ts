/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_17180 = {
  "name": "Palette Chain Testnet",
  "shortName": "PCT",
  "chain": "PLT",
  "icon": "PLT",
  "rpc": [
    "https://palette-opennet.com:22000"
  ],
  "faucets": [],
  "features": [],
  "nativeCurrency": {
    "name": "Palette Token",
    "symbol": "PLT",
    "decimals": 18
  },
  "infoURL": "https://hashpalette.com/",
  "chainId": 17180,
  "networkId": 17180,
  "slip44": 1,
  "explorers": [
    {
      "name": "Palettescan",
      "url": "https://testnet.palettescan.com",
      "standard": "none"
    }
  ]
} satisfies Chain