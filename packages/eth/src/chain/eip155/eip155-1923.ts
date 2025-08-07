/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1923 = {
  "name": "Swellchain",
  "shortName": "swellchain",
  "chain": "ETH",
  "icon": "swell",
  "rpc": [
    "https://swell-mainnet.alt.technology",
    "https://rpc.ankr.com/swell"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://app.swellnetwork.io/layer2/swell-l2",
  "chainId": 1923,
  "networkId": 1923,
  "explorers": [
    {
      "name": "Swellchain Explorer",
      "url": "https://explorer.swellnetwork.io",
      "standard": "none"
    }
  ]
} satisfies Chain