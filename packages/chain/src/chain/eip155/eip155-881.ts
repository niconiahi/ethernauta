/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_881 = {
  "name": "Weber Governance Mainnet",
  "shortName": "ptt",
  "chain": "PTT",
  "icon": "ptt",
  "rpc": [
    "https://chain.myweber.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "PALLET",
    "symbol": "PTT",
    "decimals": 18
  },
  "infoURL": "https://myweber.org",
  "chainId": 881,
  "networkId": 881,
  "explorers": [
    {
      "name": "Weber Governance Mainnet Explorer",
      "url": "https://mainnet.myweber.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain