/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_250 = {
  "name": "Fantom Opera",
  "shortName": "ftm",
  "chain": "FTM",
  "icon": "fantom",
  "rpc": [
    "https://rpc.ftm.tools",
    "https://fantom.publicnode.com",
    "wss://fantom.publicnode.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Fantom",
    "symbol": "FTM",
    "decimals": 18
  },
  "infoURL": "https://fantom.foundation",
  "chainId": 250,
  "networkId": 250,
  "explorers": [
    {
      "name": "ftmscan",
      "url": "https://ftmscan.com",
      "standard": "EIP3091"
    },
    {
      "name": "dexguru",
      "url": "https://fantom.dex.guru",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain