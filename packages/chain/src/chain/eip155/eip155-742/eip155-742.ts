/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_742 = {
  "name": "Script Testnet",
  "shortName": "SPAY",
  "chain": "SPAY",
  "rpc": [
    "https://testeth-rpc-api.script.tv/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Script",
    "symbol": "SPAY",
    "decimals": 18
  },
  "infoURL": "https://token.script.tv",
  "chainId": 742,
  "networkId": 742,
  "slip44": 1,
  "explorers": [
    {
      "name": "Script Explorer",
      "url": "https://explorer.script.tv",
      "standard": "none"
    }
  ]
} satisfies Chain