/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_8866 = {
  "name": "SuperLumio",
  "shortName": "superlumio",
  "chain": "SuperLumio",
  "icon": "superlumio",
  "rpc": [
    "https://mainnet.lumio.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://lumio.io/",
  "chainId": 8866,
  "networkId": 8866,
  "explorers": [
    {
      "name": "Lumio explorer",
      "url": "https://explorer.lumio.io",
      "standard": "none"
    }
  ]
} satisfies Chain