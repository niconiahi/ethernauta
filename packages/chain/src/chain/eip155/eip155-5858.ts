/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_5858 = {
  "name": "Chang Chain Foundation Mainnet",
  "shortName": "ChangChain",
  "chain": "ChangChain",
  "icon": "changchain",
  "rpc": [
    "https://rpc.cthscan.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Chang Coin Thailand",
    "symbol": "CTH",
    "decimals": 18
  },
  "infoURL": "https://changcoin.foundation/",
  "chainId": 5858,
  "networkId": 5858,
  "explorers": [
    {
      "name": "CTH Scan",
      "url": "https://cthscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain