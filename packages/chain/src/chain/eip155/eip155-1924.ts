/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1924 = {
  "name": "Swellchain Testnet",
  "shortName": "swellchain-sep",
  "chain": "ETH",
  "icon": "swell",
  "rpc": [
    "https://swell-testnet.alt.technology",
    "https://rpc.ankr.com/swell-testnet"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://app.swellnetwork.io/layer2/swell-l2",
  "chainId": 1924,
  "networkId": 1924,
  "explorers": [
    {
      "name": "Swellchain Testnet Explorer",
      "url": "https://swell-testnet-explorer.alt.technology",
      "standard": "none"
    }
  ]
} satisfies Chain