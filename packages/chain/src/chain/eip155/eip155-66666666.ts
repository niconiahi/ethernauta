/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_66666666 = {
  "name": "Winr Protocol Testnet",
  "shortName": "winrtestnet",
  "chain": "WINR",
  "icon": "winr",
  "rpc": [
    "https://rpc-devnet.winr.games"
  ],
  "faucets": [],
  "features": [],
  "nativeCurrency": {
    "name": "Winr",
    "symbol": "WINR",
    "decimals": 18
  },
  "infoURL": "https://winr.games",
  "chainId": 66666666,
  "networkId": 66666666,
  "explorers": [
    {
      "name": "Winr Protocol Testnet Explorer",
      "url": "https://explorer-winrprotocoltestnet-wmwv59m23g.t.conduit.xyz",
      "standard": "none"
    }
  ]
} satisfies Chain