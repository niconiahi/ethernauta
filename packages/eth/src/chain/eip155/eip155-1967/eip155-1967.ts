/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1967 = {
  "name": "Eleanor",
  "shortName": "mtc",
  "title": "Metatime Testnet Eleanor",
  "chain": "MTC",
  "rpc": [
    "https://rpc.metatime.com/eleanor",
    "wss://ws.metatime.com/eleanor"
  ],
  "faucets": [
    "https://faucet.metatime.com/eleanor"
  ],
  "nativeCurrency": {
    "name": "Eleanor Metacoin",
    "symbol": "MTC",
    "decimals": 18
  },
  "infoURL": "https://eleanor.metatime.com",
  "chainId": 1967,
  "networkId": 1967,
  "slip44": 1,
  "explorers": [
    {
      "name": "metaexplorer-eleanor",
      "url": "https://explorer.metatime.com/eleanor",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain