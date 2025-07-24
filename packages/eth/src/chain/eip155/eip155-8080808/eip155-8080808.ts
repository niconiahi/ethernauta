/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8080808 = {
  "name": "Hokum",
  "shortName": "hokum",
  "chain": "Hokum",
  "icon": "hokum",
  "rpc": [
    "https://mainnet.hokum.gg"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://hokum.gg",
  "chainId": 8080808,
  "networkId": 8080808,
  "explorers": [
    {
      "name": "Hokum Explorer",
      "url": "https://explorer.hokum.gg",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain