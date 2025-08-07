/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_30731 = {
  "name": "Movement EVM Devnet",
  "shortName": "movedev",
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
  "chainId": 30731,
  "networkId": 30731,
  "explorers": [
    {
      "name": "mevm explorer",
      "url": "https://explorer.movementlabs.xyz",
      "standard": "none"
    }
  ],
  "status": "incubating"
} satisfies Chain