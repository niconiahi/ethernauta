/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9393 = {
  "name": "Dela Sepolia Testnet",
  "shortName": "delasep",
  "chain": "ETH",
  "icon": "delaTestnet",
  "rpc": [
    "https://sepolia-dela.deperp.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.deperp.com/dela",
  "chainId": 9393,
  "networkId": 9393,
  "slip44": 1,
  "explorers": [
    {
      "name": "basescout",
      "url": "https://sepolia-delascan.deperp.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain