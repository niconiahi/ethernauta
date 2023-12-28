/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_200101 = {
  "name": "Milkomeda C1 Testnet",
  "shortName": "milkTAda",
  "chain": "milkTAda",
  "icon": "milkomeda",
  "rpc": [
    "https://rpc-devnet-cardano-evm.c1.milkomeda.com",
    "wss://rpc-devnet-cardano-evm.c1.milkomeda.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "milkTAda",
    "symbol": "mTAda",
    "decimals": 18
  },
  "infoURL": "https://milkomeda.com",
  "chainId": 200101,
  "networkId": 200101,
  "slip44": 1,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer-devnet-cardano-evm.c1.milkomeda.com",
      "standard": "none"
    }
  ]
} satisfies Chain