/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2001 = {
  "name": "Milkomeda C1 Mainnet",
  "shortName": "milkAda",
  "chain": "milkAda",
  "icon": "milkomeda",
  "rpc": [
    "https://rpc-mainnet-cardano-evm.c1.milkomeda.com",
    "wss://rpc-mainnet-cardano-evm.c1.milkomeda.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "milkAda",
    "symbol": "mADA",
    "decimals": 18
  },
  "infoURL": "https://milkomeda.com",
  "chainId": 2001,
  "networkId": 2001,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer-mainnet-cardano-evm.c1.milkomeda.com",
      "standard": "none"
    }
  ]
} satisfies Chain