/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_10395 = {
  "name": "Worldland Testnet",
  "shortName": "TWLC",
  "chain": "Worldland",
  "icon": "worldland",
  "rpc": [
    "https://gwangju.worldland.foundation"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Worldland",
    "symbol": "WL",
    "decimals": 18
  },
  "infoURL": "https://worldland.foundation",
  "chainId": 10395,
  "networkId": 10395,
  "slip44": 1,
  "explorers": [
    {
      "name": "Worldland Explorer",
      "url": "https://testscan.worldland.foundation",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain