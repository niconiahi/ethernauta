/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_19180 = {
  "name": "LocaChain Mainnet",
  "shortName": "locachain",
  "chain": "LocaChain",
  "icon": "locacoin",
  "rpc": [
    "https://tgrpntwm.locachain.io"
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
    "name": "LocaCoin",
    "symbol": "LCC",
    "decimals": 18
  },
  "infoURL": "https://locachain.io",
  "chainId": 19180,
  "networkId": 19180,
  "explorers": [
    {
      "name": "Locachain Explorer",
      "url": "https://explorer.locachain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain