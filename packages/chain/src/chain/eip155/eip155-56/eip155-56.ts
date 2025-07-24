/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_56 = {
  "name": "BNB Smart Chain Mainnet",
  "shortName": "bnb",
  "chain": "BSC",
  "rpc": [
    "https://bsc-dataseed1.bnbchain.org",
    "https://bsc-dataseed2.bnbchain.org",
    "https://bsc-dataseed3.bnbchain.org",
    "https://bsc-dataseed4.bnbchain.org",
    "https://bsc-dataseed1.defibit.io",
    "https://bsc-dataseed2.defibit.io",
    "https://bsc-dataseed3.defibit.io",
    "https://bsc-dataseed4.defibit.io",
    "https://bsc-dataseed1.ninicoin.io",
    "https://bsc-dataseed2.ninicoin.io",
    "https://bsc-dataseed3.ninicoin.io",
    "https://bsc-dataseed4.ninicoin.io",
    "https://bsc.publicnode.com",
    "wss://bsc.publicnode.com",
    "wss://bsc-ws-node.nariox.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "BNB",
    "decimals": 18
  },
  "infoURL": "https://www.bnbchain.org/en",
  "chainId": 56,
  "networkId": 56,
  "slip44": 714,
  "explorers": [
    {
      "name": "bscscan",
      "url": "https://bscscan.com",
      "standard": "EIP3091"
    },
    {
      "name": "dexguru",
      "url": "https://bnb.dex.guru",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain