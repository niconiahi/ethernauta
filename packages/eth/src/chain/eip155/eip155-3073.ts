/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_3073 = {
  "name": "Movement EVM",
  "shortName": "move",
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
  "chainId": 3073,
  "networkId": 3073,
  "explorers": [
    {
      "name": "mevm explorer",
      "url": "https://explorer.movementlabs.xyz",
      "standard": "none"
    }
  ],
  "status": "incubating"
} satisfies Chain