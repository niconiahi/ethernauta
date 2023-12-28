/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2002 = {
  "name": "Milkomeda A1 Mainnet",
  "shortName": "milkALGO",
  "chain": "milkALGO",
  "icon": "milkomeda",
  "rpc": [
    "https://rpc-mainnet-algorand-rollup.a1.milkomeda.com",
    "wss://rpc-mainnet-algorand-rollup.a1.milkomeda.com/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "milkALGO",
    "symbol": "mALGO",
    "decimals": 18
  },
  "infoURL": "https://milkomeda.com",
  "chainId": 2002,
  "networkId": 2002,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer-mainnet-algorand-rollup.a1.milkomeda.com",
      "standard": "none"
    }
  ]
} satisfies Chain