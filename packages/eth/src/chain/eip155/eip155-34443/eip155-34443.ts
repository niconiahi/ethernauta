/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_34443 = {
  "name": "Mode",
  "shortName": "mode",
  "chain": "ETH",
  "icon": "mode",
  "rpc": [
    "https://mainnet.mode.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://docs.mode.network/",
  "chainId": 34443,
  "networkId": 34443,
  "explorers": [
    {
      "name": "modescout",
      "url": "https://explorer.mode.network",
      "standard": "none"
    }
  ]
} satisfies Chain