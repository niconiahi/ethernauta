/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_8869 = {
  "name": "Lif3 Chain",
  "shortName": "lif3-mainnet",
  "chain": "lif3chain",
  "icon": "lif3",
  "rpc": [
    "https://rpc.lif3.com"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "LIF3",
    "symbol": "LIF3",
    "decimals": 18
  },
  "infoURL": "https://docs.lif3.com/",
  "chainId": 8869,
  "networkId": 8869,
  "explorers": [
    {
      "name": "lif3scout",
      "url": "https://lif3scout.com",
      "standard": "none"
    }
  ]
} satisfies Chain