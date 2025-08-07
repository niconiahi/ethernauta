/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_571 = {
  "name": "MetaChain Mainnet",
  "shortName": "metatime",
  "chain": "MTC",
  "icon": "metachain",
  "rpc": [
    "https://rpc.metatime.com"
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
    "name": "Metatime Coin",
    "symbol": "MTC",
    "decimals": 18
  },
  "infoURL": "https://metatime.com/en",
  "chainId": 571,
  "networkId": 571,
  "slip44": 571,
  "explorers": [
    {
      "name": "MetaExplorer",
      "url": "https://explorer.metatime.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain