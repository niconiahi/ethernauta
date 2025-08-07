/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_434 = {
  "name": "Boyaa Mainnet",
  "shortName": "BYC",
  "chain": "BYC",
  "icon": "boyaanetwork",
  "rpc": [
    "https://evm-rpc.mainnet.boyaa.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Boyaa mainnet native coin",
    "symbol": "BYC",
    "decimals": 18
  },
  "infoURL": "https://boyaa.network",
  "chainId": 434,
  "networkId": 434,
  "explorers": [
    {
      "name": "Boyaa explorer",
      "url": "https://explorer.mainnet.boyaa.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain