/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_30730 = {
  "name": "Movement EVM Legacy",
  "shortName": "moveleg",
  "chain": "MOVE",
  "icon": "move",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Move",
    "symbol": "MOVE",
    "decimals": 18
  },
  "infoURL": "https://movementlabs.xyz",
  "chainId": 30730,
  "networkId": 30730,
  "explorers": [
    {
      "name": "mevm explorer",
      "url": "https://explorer.movementlabs.xyz",
      "standard": "none"
    }
  ],
  "status": "incubating"
} satisfies Chain