/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5234 = {
  "name": "Humanode Mainnet",
  "shortName": "hmnd",
  "chain": "HMND",
  "icon": "humanode",
  "rpc": [
    "https://explorer-rpc-http.mainnet.stages.humanode.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "eHMND",
    "symbol": "eHMND",
    "decimals": 18
  },
  "infoURL": "https://humanode.io",
  "chainId": 5234,
  "networkId": 5234,
  "explorers": [
    {
      "name": "Subscan",
      "url": "https://humanode.subscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain