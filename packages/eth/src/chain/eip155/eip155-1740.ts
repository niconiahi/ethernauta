/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1740 = {
  "name": "Metal L2 Testnet",
  "shortName": "metall2-testnet",
  "chain": "Metal L2 Testnet",
  "icon": "metal",
  "rpc": [
    "https://testnet.rpc.metall2.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://metall2.com",
  "chainId": 1740,
  "networkId": 1740,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.explorer.metall2.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain