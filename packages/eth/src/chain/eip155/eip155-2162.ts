/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2162 = {
  "name": "Animechain Testnet",
  "shortName": "animechaint",
  "chain": "Animechain",
  "rpc": [
    "https://rpc.kanda.animechain.ai"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Coin",
    "symbol": "COIN",
    "decimals": 18
  },
  "infoURL": "https://animechain.ai",
  "chainId": 2162,
  "networkId": 2162,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.kanda.animechain.ai",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain