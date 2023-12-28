/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_16718 = {
  "name": "AirDAO Mainnet",
  "shortName": "airdao",
  "chain": "ambnet",
  "icon": "airdao",
  "rpc": [
    "https://network.ambrosus.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Amber",
    "symbol": "AMB",
    "decimals": 18
  },
  "infoURL": "https://airdao.io",
  "chainId": 16718,
  "networkId": 16718,
  "explorers": [
    {
      "name": "AirDAO Network Explorer",
      "url": "https://airdao.io/explorer",
      "standard": "none"
    }
  ]
} satisfies Chain