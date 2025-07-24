/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_957 = {
  "name": "Lyra Chain",
  "shortName": "lyra",
  "chain": "Lyra",
  "icon": "lyra",
  "rpc": [
    "https://rpc.lyra.finance"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://lyra.finance",
  "chainId": 957,
  "networkId": 957,
  "explorers": [
    {
      "name": "Lyra Explorer",
      "url": "https://explorer.lyra.finance",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain