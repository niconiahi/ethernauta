/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_7701 = {
  "name": "Canto Tesnet",
  "shortName": "TestnetCanto",
  "chain": "Canto",
  "rpc": [
    "https://testnet-archive.plexnode.wtf"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Testnet Canto",
    "symbol": "CANTO",
    "decimals": 18
  },
  "infoURL": "https://canto.io",
  "chainId": 7701,
  "networkId": 7701,
  "slip44": 1,
  "explorers": [
    {
      "name": "Canto Testnet EVM Explorer (Blockscout)",
      "url": "https://testnet.tuber.build",
      "standard": "none"
    },
    {
      "name": "dexguru",
      "url": "https://canto-test.dex.guru",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain