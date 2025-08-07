/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_62298 = {
  "name": "Citrea Devnet",
  "shortName": "citrea-devnet",
  "chain": "Citrea",
  "icon": "citrea",
  "rpc": [
    "https://rpc.devnet.citrea.xyz"
  ],
  "faucets": [
    "https://citrea.xyz/bridge"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Citrea BTC",
    "symbol": "cBTC",
    "decimals": 18
  },
  "infoURL": "https://citrea.xyz",
  "chainId": 62298,
  "networkId": 62298,
  "explorers": [
    {
      "name": "Citrea Devnet Explorer",
      "url": "https://explorer.devnet.citrea.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain