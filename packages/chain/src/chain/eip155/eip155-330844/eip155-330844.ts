/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_330844 = {
  "name": "TTcoin Smart Chain Mainnet",
  "shortName": "tc",
  "chain": "TSC",
  "icon": "tscscan",
  "rpc": [
    "https://mainnet-rpc.tscscan.com"
  ],
  "faucets": [
    "https://faucet.tscscan.com"
  ],
  "nativeCurrency": {
    "name": "TTcoin",
    "symbol": "TC",
    "decimals": 18
  },
  "infoURL": "https://ttcoin.info/",
  "chainId": 330844,
  "networkId": 330844,
  "explorers": [
    {
      "name": "TTcoin Smart Chain Explorer",
      "url": "https://tscscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain